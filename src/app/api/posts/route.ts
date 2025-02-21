import { NextResponse } from "next/server";
import { PostService } from "@/services/post.service";
import { getCurrentUser } from "@/lib/auth";
import { CreatePostDTO } from "@/types/post";
import { AppError, ValidationError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    let data: CreatePostDTO;

    // Get content type, handle various formats
    const contentType = req.headers.get("content-type") || "";

    try {
      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        data = {
          content: formData.get("content") as string,
          teamId: formData.get("teamId") as string,
          mediaUrl: (formData.get("mediaUrl") as string) || undefined,
          scheduledAt: (formData.get("scheduledAt") as string) || undefined,
        };
      } else {
        // Default to treating as JSON
        data = await req.json();
      }
    } catch (e) {
      throw new ValidationError("Invalid request payload");
    }

    // Validate required fields
    if (!data.content?.trim()) {
      throw new ValidationError("Content is required and cannot be empty");
    }

    const user = await getCurrentUser(req);

    const post = await PostService.createPost(
      user.id,
      {
        content: data.content,
        mediaUrl: data.mediaUrl,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      },
      data.teamId // Optional
    );

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/posts error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }

    return NextResponse.json({ error: "An unexpected error occurred", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const { searchParams } = new URL(req.url);

    const filters = {
      teamId: searchParams.get("teamId") || undefined,
      status: (searchParams.get("status") as any) || undefined,
    };

    const posts = await PostService.getPosts(user.id, filters);
    return NextResponse.json(posts);
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
