import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = body.email ? String(body.email).trim().toLowerCase() : null;
    const pinCode = String(body.pinCode ?? "");
    const confirmPin = String(body.confirmPin ?? "");

    if (!name || pinCode.length !== 4 || confirmPin.length !== 4) {
      return NextResponse.json(
        { error: "Vul uw naam in en kies een 4-cijferige code" },
        { status: 400 },
      );
    }

    if (pinCode !== confirmPin) {
      return NextResponse.json({ error: "De codes komen niet overeen" }, { status: 400 });
    }

    if (email) {
      const existingEmail = await prisma.employee.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: "Dit e-mailadres is al in gebruik" }, { status: 409 });
      }
    }

    const [normProfile, team] = await Promise.all([
      prisma.normProfile.findFirst({ orderBy: { name: "asc" } }),
      prisma.team.findFirst({ orderBy: { name: "asc" } }),
    ]);

    if (!normProfile) {
      return NextResponse.json({ error: "Account aanmaken is nog niet mogelijk" }, { status: 500 });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        pinCode: await bcrypt.hash(pinCode, 10),
        normProfileId: normProfile.id,
        teamId: team?.id,
        hoursPerDay: normProfile.hoursPerDay,
        active: true,
      },
    });

    await createEmployeeSession(employee.id);
    return NextResponse.json({ ok: true, name: employee.name });
  } catch {
    return NextResponse.json({ error: "Account aanmaken mislukt" }, { status: 500 });
  }
}
