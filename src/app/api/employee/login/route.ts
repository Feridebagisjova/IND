import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createEmployeeSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const employeeId = String(body.employeeId ?? "");
    const pinCode = String(body.pinCode ?? "");

    if (!employeeId || !pinCode) {
      return NextResponse.json({ error: "Medewerker en code zijn verplicht" }, { status: 400 });
    }

    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, active: true },
    });

    if (!employee) {
      return NextResponse.json({ error: "Onjuiste inloggegevens" }, { status: 401 });
    }

    const validPin = await bcrypt.compare(pinCode, employee.pinCode);
    if (!validPin) {
      return NextResponse.json({ error: "Onjuiste inloggegevens" }, { status: 401 });
    }

    await createEmployeeSession(employee.id);
    return NextResponse.json({ ok: true, name: employee.name });
  } catch {
    return NextResponse.json({ error: "Inloggen mislukt" }, { status: 500 });
  }
}
