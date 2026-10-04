import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const adminCookieName = "ind_admin_session";
const employeeCookieName = "ind_employee_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET ontbreekt");
  }
  return new TextEncoder().encode(secret);
}

async function setSessionCookie(name: string, token: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

async function clearSessionCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

async function readSessionCookie(name: string, key: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { [key]: payload[key] as string };
  } catch {
    return null;
  }
}

export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

  await setSessionCookie(adminCookieName, token);
}

export async function clearAdminSession() {
  await clearSessionCookie(adminCookieName);
}

export async function getAdminSession() {
  const session = await readSessionCookie(adminCookieName, "adminId");
  return session ? { adminId: session.adminId } : null;
}

export async function createEmployeeSession(employeeId: string) {
  const token = await new SignJWT({ employeeId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());

  await setSessionCookie(employeeCookieName, token);
}

export async function clearEmployeeSession() {
  await clearSessionCookie(employeeCookieName);
}

export async function getEmployeeSession() {
  const session = await readSessionCookie(employeeCookieName, "employeeId");
  return session ? { employeeId: session.employeeId } : null;
}

export async function requireEmployeeSession() {
  const session = await getEmployeeSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
