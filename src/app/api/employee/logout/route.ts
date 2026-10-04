import { NextResponse } from "next/server";
import { clearEmployeeSession } from "@/lib/auth";

export async function POST() {
  await clearEmployeeSession();
  return NextResponse.json({ ok: true });
}
