import { NextResponse } from "next/server";
import { getEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isFutureDate,
  parseInputDate,
  toInputDateValue,
} from "@/lib/metrics";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

type DossierInput = {
  title: string;
  hours: number;
};

type ActivityInput = {
  categoryId: string;
  hours: number;
};

function parseDossiers(raw: unknown): DossierInput[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => ({
      title: String(item?.title ?? "").trim(),
      hours: Number(item?.hours ?? 0),
    }))
    .filter((item) => item.title && item.hours > 0);
}

function parseActivities(raw: unknown): ActivityInput[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => ({
      categoryId: String(item?.categoryId ?? ""),
      hours: Number(item?.hours ?? 0),
    }))
    .filter((item) => item.categoryId && item.hours > 0);
}

function parseRegistrationDate(raw: unknown) {
  const date = parseInputDate(String(raw ?? ""));
  if (!date) {
    return { error: "Ongeldige datum" as const };
  }

  if (isFutureDate(date)) {
    return { error: "U kunt geen registratie voor een toekomstige datum opslaan" as const };
  }

  return { date };
}

export async function GET(request: Request) {
  try {
    const session = await getEmployeeSession();
    if (!session) {
      return NextResponse.json({ error: "U bent niet ingelogd" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = parseRegistrationDate(searchParams.get("date") ?? toInputDateValue(new Date()));
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: {
        employeeId_date: {
          employeeId: session.employeeId,
          date: parsed.date,
        },
      },
      include: {
        dossiers: { orderBy: { title: "asc" } },
        activities: { orderBy: { categoryId: "asc" } },
      },
    });

    return NextResponse.json({
      date: toInputDateValue(parsed.date),
      exists: Boolean(registration),
      registration: registration
        ? {
            comment: registration.comment ?? "",
            dossiers: registration.dossiers.map((dossier) => ({
              title: dossier.title,
              hours: dossier.hours,
            })),
            activities: registration.activities.map((activity) => ({
              categoryId: activity.categoryId,
              hours: activity.hours,
            })),
          }
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Registratie ophalen mislukt" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getEmployeeSession();
    if (!session) {
      return NextResponse.json({ error: "U bent niet ingelogd" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = parseRegistrationDate(body.date ?? toInputDateValue(new Date()));
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const dossiers = parseDossiers(body.dossiers);
    const activities = parseActivities(body.activities);
    const comment = body.comment ? String(body.comment) : null;

    if (dossiers.length === 0 && activities.length === 0) {
      return NextResponse.json(
        { error: "Vul minimaal één dossier of andere werkzaamheid in" },
        { status: 400 },
      );
    }

    const employee = await prisma.employee.findFirst({
      where: { id: session.employeeId, active: true },
    });

    if (!employee) {
      return NextResponse.json({ error: "Medewerker niet gevonden" }, { status: 404 });
    }

    const productionUnits = dossiers.length;
    const productionHours = dossiers.reduce((sum, dossier) => sum + dossier.hours, 0);
    const employeeId = employee.id;
    const registrationDate = parsed.date;

    await prisma.registration.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: registrationDate,
        },
      },
      update: {
        productionUnits,
        productionHours,
        comment,
        dossiers: {
          deleteMany: {},
          create: dossiers.map((dossier) => ({
            title: dossier.title,
            hours: dossier.hours,
          })),
        },
        activities: {
          deleteMany: {},
          create: activities.map((activity) => ({
            categoryId: activity.categoryId,
            hours: activity.hours,
          })),
        },
      },
      create: {
        employeeId,
        date: registrationDate,
        productionUnits,
        productionHours,
        comment,
        dossiers: {
          create: dossiers.map((dossier) => ({
            title: dossier.title,
            hours: dossier.hours,
          })),
        },
        activities: {
          create: activities.map((activity) => ({
            categoryId: activity.categoryId,
            hours: activity.hours,
          })),
        },
      },
    });

    return NextResponse.json({
      message: `Bedankt. Je registratie voor ${format(registrationDate, "d MMMM yyyy", { locale: nl })} is verwerkt.`,
      date: toInputDateValue(registrationDate),
    });
  } catch {
    return NextResponse.json({ error: "Er ging iets mis bij het opslaan" }, { status: 500 });
  }
}
