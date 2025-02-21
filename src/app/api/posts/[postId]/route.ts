import { NextResponse } from "next/server";
import { PostService } from "@/services/post.service";
import { getCurrentUser } from "@/lib/auth";
import { UpdatePostDTO } from "@/types/post";
import { AppError } from "@/lib/errors";

export async function PUT(req: Request, { params }: { params: { postId: string } }) {
  try {
    const user = await getCurrentUser(req);

    // Validate Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const data: UpdatePostDTO = await req.json();

    const post = await PostService.updatePost(params.postId, user.id, {
      content: data.content,
      mediaUrl: data.mediaUrl,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    });

    return NextResponse.json(post);
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
  try {
    const user = await getCurrentUser(req);
    await PostService.deletePost(params.postId, user.id);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
