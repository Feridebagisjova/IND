import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const pinCode = body.pinCode ? String(body.pinCode) : "";

  if (pinCode && !/^\d{4}$/.test(pinCode)) {
    return NextResponse.json({ error: "Code moet 4 cijfers zijn" }, { status: 400 });
  }

  await prisma.employee.update({
    where: { id },
    data: {
      name: String(body.name),
      email: body.email ? String(body.email) : null,
      teamId: body.teamId ? String(body.teamId) : null,
      normProfileId: String(body.normProfileId),
      hoursPerDay: Number(body.hoursPerDay),
      active: Boolean(body.active),
      ...(pinCode ? { pinCode: await bcrypt.hash(pinCode, 10) } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
