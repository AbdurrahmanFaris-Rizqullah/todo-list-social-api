import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { MonitoringService } from "@/services/monitoring.service";
import { AuthorizationError } from "@/lib/errors";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    const activities = await MonitoringService.getTeamActivities(teamId, user.id);
    
    return NextResponse.json({
      success: true,
      data: activities
    });

  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}