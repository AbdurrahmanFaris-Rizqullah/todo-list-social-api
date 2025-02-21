import { NextResponse } from "next/server";
import { TeamService } from "@/services/team.service";
import { getCurrentUser } from "@/lib/auth";

// Create team
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const data = await req.json();

    const team = await TeamService.createTeam(user.id, data);
    return NextResponse.json(team, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Get user's teams
export async function GET() {
  try {
    const user = await getCurrentUser();
    const teams = await TeamService.getTeams(user.id);
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
