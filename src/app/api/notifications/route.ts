import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";
import { ValidationError, AuthorizationError, NotFoundError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Message and userId are required" },
        { status: 400 }
      );
    }
    
    await NotificationService.sendNotification(userId, message);
    
    return NextResponse.json({
      success: true,
      message: "Notification sent successfully"
    });

  } catch (error: any) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}