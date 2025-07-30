"use server";

import { encrypt } from "@/app/actions/auth";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { setAuthCookie, updateAuthCookies } from "@/app/actions/cookies";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {email, password} = body;

        const users = await getUserByEmail(email);
        if (!users) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

         const isPasswordValid = await bcrypt.compare(password, users.password_hash);

         if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        // const expiresIn = 5 * 60; 
        const session = await encrypt({ userId: users.id, email: users.email, role: users.role });
        console.log("✅ Session Token created successfully:");
        await setAuthCookie("Session", session);

    return NextResponse.json({ success: "Login successful", user: { id: users.id, email: users.email, role: users.role } });

    } catch (error: any) {
        console.error("Login failed:", error.message);
        return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
    }
}

export async function getUserByEmail(email: string) {
  const conn = await pool.getConnection();
  try {
    const [row]: any = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    return row.length > 0 ? row[0] : null;
  } finally {
    conn.release();
  }
}