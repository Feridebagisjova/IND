import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const body = await request.json();
  await prisma.appSettings.upsert({
    where: { id: "default" },
    update: {
      thresholdGreen: Number(body.thresholdGreen),
      thresholdOrange: Number(body.thresholdOrange),
    },
    create: {
      thresholdGreen: Number(body.thresholdGreen),
      thresholdOrange: Number(body.thresholdOrange),
    },
  });

  return NextResponse.json({ ok: true });
}
