import { encrypt } from "@/app/actions/auth";
import { getAuthCookie, setAuthCookie } from "@/app/actions/cookies";
import { emailTemplate } from "@/components/ui/emailTemplate";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {

    const body = await request.json();
    const { userId, email } = body;

    const expiresIn = 5 * 60; 
    const ResetPasswordToken = await encrypt({ userId, email }, expiresIn);

    console.log("✅ Session Token created successfully:");
    try {

        const getEmail = await getUserByEmail(email);
        if (!getEmail) {
            return NextResponse.json({ error: "Email not found. Please check and try again." }, { status: 401 });
        }

        const {data, error} = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset Password",
            react: emailTemplate({email: email, ResetPasswordToken: ResetPasswordToken})
        })

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

    return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 });
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