import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const body = await request.json();
  const pinCode = String(body.pinCode ?? "");
  if (!/^\d{4}$/.test(pinCode)) {
    return NextResponse.json({ error: "Code moet 4 cijfers zijn" }, { status: 400 });
  }

  const employee = await prisma.employee.create({
    data: {
      name: String(body.name),
      email: body.email ? String(body.email) : null,
      teamId: body.teamId ? String(body.teamId) : null,
      normProfileId: String(body.normProfileId),
      hoursPerDay: Number(body.hoursPerDay),
      active: Boolean(body.active),
      pinCode: await bcrypt.hash(pinCode, 10),
    },
  });

  return NextResponse.json({ id: employee.id });
}
