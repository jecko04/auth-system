"use server";

import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/app/actions/cookies";

import { encrypt } from "@/app/actions/auth";

export async function POST(request: NextRequest) {
   try {
    const body = await request.json();
    const { full_name, email, password } = body;

    const emailExists = await isEmailExists(email);
    if (emailExists) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: "Fullname, Email and password are required" },
        { status: 400 }
      );
    } else {
        const role = 'users';
        const user = await createUser(full_name, email, password, role);
        if (!user) {
            return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
            );
        }
        return NextResponse.json({ success: "User created successfully", user });
    }

   } catch (error: any) {
  console.error("Registration failed:", error.message);
  return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
}
} 

export async function isEmailExists(email: string) {
  const conn = await pool.getConnection();
  try {
    const [row]: any = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    return row.length > 0;
  } finally {
    conn.release();
  }
}

export async function createUser(full_name: string, email: string, password: string, role: string) {
    const conn = await pool.getConnection();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result]: any  = await conn.query(
            "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)", 
            [full_name, email, hashedPassword, role]);
        
            if (result.affectedRows > 0) {
                const userId = result.insertId;
                const session = await encrypt({ userId, email, role });
                console.log("✅ Session Token created successfully:");
                await setAuthCookie("Session",session);
                return { userId, email, session };
            }
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    } finally {
        conn.release();
    }
}