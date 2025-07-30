import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/actions/auth";


export async function POST(request: NextRequest) {
    const { ResetPasswordToken } = await request.json();
    if (!ResetPasswordToken) {
        return NextResponse.json({ valid: false, message: "Missing ResetPasswordToken" }, { status: 400 });
    }
    try {
        const verifyToken = await decrypt(ResetPasswordToken);
        
        if (!verifyToken) {
        return NextResponse.json({ valid: false, message: "Token invalid or expired" });
        }

        return NextResponse.json({ valid: true, payload: verifyToken });
    } catch (err) {
        return NextResponse.json({ valid: false, message: "Token is invalid or expired" }, { status: 401 });
    }
}