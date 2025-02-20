import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";

export async function POST(req: Request) {
  try {
    // Check request method
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    // Check if sensitive data is in URL params
    const url = new URL(req.url);
    if (url.searchParams.has('email') || url.searchParams.has('password')) {
      return NextResponse.json(
        { error: "Credentials should be sent in request body, not URL parameters" },
        { status: 400 }
      );
    }

    // Check Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          error: "Content-Type must be multipart/form-data",
        },
        { status: 400 }
      );
    }

    // Parse FormData from body only
    const formData = await req.formData();

    // Extract data from FormData
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate required fields
    if (!data.email || !data.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await UserService.register(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
