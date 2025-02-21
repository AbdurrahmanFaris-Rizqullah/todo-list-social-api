import { NextResponse } from "next/server";
import { TeamService } from "@/services/team.service";
import { getCurrentUser } from "@/lib/auth";

// Create team
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const { name } = await req.json();

    const team = await TeamService.createTeam(user.id, { name });
    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === "Not authenticated" ? 401 : 400 });
  }
}

// Get user's teams
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const teams = await TeamService.getTeams(user.id);
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
