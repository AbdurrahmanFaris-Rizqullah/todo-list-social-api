import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PostService } from "@/services/post.service";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getCurrentUser(request);
    const post = await PostService.approvePost(params.postId, user.id);
    
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}