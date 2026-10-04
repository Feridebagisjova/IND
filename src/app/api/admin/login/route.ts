import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Onjuiste inloggegevens" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Onjuiste inloggegevens" }, { status: 401 });
    }

    await createAdminSession(admin.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Inloggen mislukt" }, { status: 500 });
  }
}
