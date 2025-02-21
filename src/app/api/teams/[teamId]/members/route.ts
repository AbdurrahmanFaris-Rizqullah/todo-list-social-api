import { NextResponse } from "next/server";
import { TeamService } from "@/services/team.service";
import { getCurrentUser } from "@/lib/auth";

// Add member to team
export async function POST(req: Request, { params }: { params: { teamId: string } }) {
  try {
    await getCurrentUser(); // Verify authenticated
    const data = await req.json();

    const member = await TeamService.addMember(params.teamId, data);
    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Remove member from team
export async function DELETE(req: Request, { params }: { params: { teamId: string; userId: string } }) {
  try {
    await getCurrentUser(); // Verify authenticated
    await TeamService.removeMember(params.teamId, params.userId);
    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
