"use server";

import { request } from "http";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./auth";

export async function setAuthCookie(name: string, session: string) {
const cookieStore: any = await cookies()
  cookieStore.set(name = "session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // secure: false,
    path: "/",
    maxAge: 30 * 60,
    samesite: "strict",
  });
}

export async function getAuthCookie() {
  const cookieStore: any = await cookies();
  return cookieStore.get("session")?.value || null;
}

export async function updateAuthCookies(request: NextRequest): Promise<NextResponse | undefined> {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);

  const isExpiringSoon = new Date(parsed.expires).getTime() - Date.now() < 15 * 60 * 1000;
  if (isExpiringSoon) {
    parsed.expires = new Date(Date.now() + 30 * 60 * 1000); 

    const response = NextResponse.next();
    response.cookies.set({
      name: 'session',
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires,
      maxAge: 30 * 60,
      path: '/',
      sameSite: 'strict',
      // secure: false,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  }
  return; 
}

export async function deleteAuthCookie() {
  const cookieStore: any = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, 
  })
};