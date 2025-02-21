import { NextResponse } from "next/server";
import { TeamService } from "@/services/team.service";
import { getCurrentUser } from "@/lib/auth";

// Add social media account
export async function POST(req: Request, { params }: { params: { teamId: string } }) {
  try {
    await getCurrentUser(req); // Add req parameter
    const data = await req.json();

    // Validate required fields
    if (!data.platform || !data.username || !data.token) {
      return NextResponse.json({ error: "Platform, username and token are required" }, { status: 400 });
    }

    const account = await TeamService.addSocialAccount(params.teamId, data);

    // Don't return token in response
    const { token, ...accountWithoutToken } = account;
    return NextResponse.json(accountWithoutToken, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Get team's social media accounts
export async function GET(req: Request, { params }: { params: { teamId: string } }) {
  try {
    await getCurrentUser(req); // Add req parameter
    const accounts = await TeamService.getSocialAccounts(params.teamId);
    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
