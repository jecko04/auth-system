import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/actions/auth";

import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";


export async function POST(request: NextRequest) {
    //kunin yung userId sa token at gamiting where clause para sa pag change ng password

    try {
        const { token, password } = await request.json();
        const decrypted = await decrypt(token);

        if (!token) {
            return NextResponse.json({error: "token is invalid"}, {status: 400});
        }

        const users = await getUserById(decrypted.userId);
        if (!users) {
            return NextResponse.json({ error: "Invalid user id" }, { status: 401 });
        }

        const update = await changeUserPassword(password, decrypted.userId);
        if (!update) {
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }

        return NextResponse.json({ success: "Password updated successfully" });
    } catch (err) {
        return NextResponse.json({err});
    }
}

export async function getUserById(userId: string) {
  const conn = await pool.getConnection();
  try {
    const [row]: any = await conn.query("SELECT * FROM users WHERE id = ?", [userId]);
    return row.length > 0 ? row[0] : null;
  } finally {
    conn.release();
  }
}

export async function changeUserPassword(password: string, userId: string) {
    const conn = await pool.getConnection();
    try {
        const date = new Date();    

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await conn.query<ResultSetHeader>("UPDATE password_hash set password_hash = ?, updated_at = ? WHERE id = ?", [hashedPassword, date, userId ]);

        if (result.affectedRows > 0) {
            NextResponse.json({success: "Successfully Changed Password"}, {status: 200});
            return { result };
        }
    } finally {
        conn.release();
    }
}