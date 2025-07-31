    import { NextRequest, NextResponse } from "next/server";
    import { decrypt, verifyToken } from "@/app/actions/auth";

    import pool from "@/lib/db";
    import { ResultSetHeader } from "mysql2";
    import bcrypt from "bcryptjs";


    export async function POST(request: NextRequest) {
        //kunin yung userId sa token at gamiting where clause para sa pag change ng password

        try {
            const { token, password } = await request.json();
            const verify = await decrypt(token);
            console.log("Decrypted payload:", verify);

            if (!verify) {
                return NextResponse.json({valid: false, error: "token is invalid"}, {status: 400});
            }
            const users = await getUserById(verify.userId);
            if (!users) {
                return NextResponse.json({valid: false, error: "Invalid user id" }, { status: 401 });
            }

            if (users.updated_at && verify.iat * 1000 < new Date(users.updated_at).getTime()) {
                return NextResponse.json({ valid: false, error: "Token has already been used" }, { status: 401 });
            }

            const update = await changeUserPassword(password, verify.userId);
            if (!update) {
                return NextResponse.json({valid: false, error: "Internal Server Error"}, {status: 500});
            }

            return NextResponse.json({valid: true, success: "Password updated successfully" });
        } catch (err) {
            console.error("Reset password error:", err);
        return NextResponse.json({valid: false, error: "Something went wrong" }, { status: 500 });
    }
    }

    export async function getUserById(userId: string) {
    const conn = await pool.getConnection();
    try {
        const [row]: any = await conn.query<ResultSetHeader>(
            "SELECT * FROM users WHERE id = ?", 
            [userId]
        );
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
            const [result] = await conn.query<ResultSetHeader>(
                "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
                [hashedPassword, date, userId]
            );

            return result.affectedRows > 0;
        } finally {
            conn.release();
        }
    }