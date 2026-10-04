import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/metrics";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const employeeId = String(body.employeeId ?? "");
    const pinCode = String(body.pinCode ?? "");
    const productionUnits = Number(body.productionUnits ?? 0);
    const comment = body.comment ? String(body.comment) : null;
    const activities = Array.isArray(body.activities) ? body.activities : [];

    if (!employeeId || !pinCode) {
      return NextResponse.json({ error: "Medewerker en code zijn verplicht" }, { status: 400 });
    }

    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, active: true },
    });

    if (!employee) {
      return NextResponse.json({ error: "Medewerker niet gevonden" }, { status: 404 });
    }

    const validPin = await bcrypt.compare(pinCode, employee.pinCode);
    if (!validPin) {
      return NextResponse.json({ error: "Onjuiste persoonlijke code" }, { status: 401 });
    }

    const today = startOfDay(new Date());

    await prisma.registration.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
      update: {
        productionUnits,
        comment,
        activities: {
          deleteMany: {},
          create: activities.map((activity: { categoryId: string; hours: number }) => ({
            categoryId: activity.categoryId,
            hours: activity.hours,
          })),
        },
      },
      create: {
        employeeId,
        date: today,
        productionUnits,
        comment,
        activities: {
          create: activities.map((activity: { categoryId: string; hours: number }) => ({
            categoryId: activity.categoryId,
            hours: activity.hours,
          })),
        },
      },
    });

    return NextResponse.json({
      message: `Bedankt. Je registratie voor ${format(today, "d MMMM", { locale: nl })} is verwerkt.`,
    });
  } catch {
    return NextResponse.json({ error: "Er ging iets mis bij het opslaan" }, { status: 500 });
  }
}
