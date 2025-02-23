import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";
import { ValidationError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { userId, subject, content } = await request.json();

    if (!userId || !subject || !content) {
      return NextResponse.json(
        { error: "UserId, subject, and content are required" },
        { status: 400 }
      );
    }

    await NotificationService.sendEmailNotification(userId, subject, content);
    
    return NextResponse.json({
      success: true,
      message: "Email notification sent successfully"
    });

  } catch (error: any) {
    console.error("Send email notification error:", error);
    return NextResponse.json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
}