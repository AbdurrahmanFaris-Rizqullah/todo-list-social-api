import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PostService } from "@/services/post.service";
import { ValidationError, AuthorizationError, NotFoundError } from "@/lib/errors";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    if (!params.postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser(request);
    const post = await PostService.rejectPost(params.postId, user.id);
    
    return NextResponse.json({
      success: true,
      message: "Post rejected successfully",
      data: post
    });

  } catch (error: any) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    console.error("Reject post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}