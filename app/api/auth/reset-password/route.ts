import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    //kunin yung userId sa token at gamiting where clause para sa pag change ng password

    try {
        const { token, password } = await request.json();

        if (!token) {
            return NextResponse.json({error: "token is invalid"}, {status: 400});
        }

        




    } catch (err) {
        return NextResponse.json({err});
    }
}