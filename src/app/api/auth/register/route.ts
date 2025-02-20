import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await UserService.register(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
