import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import { ValidationError, AuthorizationError, NotFoundError, AppError } from "@/lib/errors";

/**
 * Service class untuk mengelola Post/Todo
 * Mendukung penggunaan individual dan team
 */
export class PostService {
  /**
   * Membuat post baru
   * @param userId - ID user yang membuat post
   * @param data - Data post yang akan dibuat
   * @param teamId - Optional, ID team jika post dibuat dalam konteks team
   */
  static async createPost(
    userId: string,
    data: {
      content: string;
      mediaUrl?: string;
      scheduledAt?: Date;
    },
    teamId?: string
  ) {
    // Validasi input
    if (!userId) {
      throw new ValidationError("userId is required");
    }

    if (!data.content?.trim()) {
      throw new ValidationError("Content cannot be empty");
    }

    if (data.scheduledAt && data.scheduledAt < new Date()) {
      throw new ValidationError("Schedule date must be in the future");
    }

    // Jika ada teamId, validasi akses team
    if (teamId) {
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });

      if (!teamMember) {
        throw new AuthorizationError("User is not a member of this team");
      }
    }

    try {
      return await prisma.post.create({
        data: {
          content: data.content.trim(),
          mediaUrl: data.mediaUrl,
          scheduledAt: data.scheduledAt,
          status: data.scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
          userId,
          teamId, // Optional, bisa null untuk post individual
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          team: teamId
            ? {
                select: {
                  id: true,
                  name: true,
                },
              }
            : false,
        },
      });
    } catch (error) {
      throw new AppError("Failed to create post", 500, "DATABASE_ERROR");
    }
  }

  static async getPosts(
    userId: string,
    filters?: {
      teamId?: string;
      status?: PostStatus;
    }
  ) {
    if (!userId) {
      throw new ValidationError("userId is required");
    }

    const where: any = {};

    if (filters?.teamId) {
      // Validate team exists
      const team = await prisma.team.findUnique({
        where: { id: filters.teamId },
      });

      if (!team) {
        throw new NotFoundError("Team not found");
      }

      where.teamId = filters.teamId;

      // Verify team membership
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: filters.teamId,
            userId,
          },
        },
      });

      if (!teamMember) {
        throw new AuthorizationError("User is not a member of this team");
      }
    }

    if (filters?.status) {
      // Validate status enum
      if (!Object.values(PostStatus).includes(filters.status)) {
        throw new ValidationError("Invalid post status");
      }
      where.status = filters.status;
    }

    try {
      return await prisma.post.findMany({
        where: {
          OR: [
            { userId },
            {
              team: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
          ...where,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw new AppError("Failed to fetch posts", 500, "DATABASE_ERROR");
    }
  }

  static async updatePost(
    postId: string,
    userId: string,
    data: {
      content?: string;
      mediaUrl?: string;
      scheduledAt?: Date | null;
    }
  ) {
    if (!postId || !userId) {
      throw new ValidationError("postId and userId are required");
    }

    // Validate at least one field to update
    if (!data.content && data.mediaUrl === undefined && data.scheduledAt === undefined) {
      throw new ValidationError("No fields to update");
    }

    if (data.content && !data.content.trim()) {
      throw new ValidationError("Content cannot be empty");
    }

    if (data.scheduledAt && data.scheduledAt < new Date()) {
      throw new ValidationError("Schedule date must be in the future");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Check if post is already published
    if (post.status === PostStatus.PUBLISHED) {
      throw new ValidationError("Cannot update published post");
    }

    // Check if user has permission to edit
    const teamMember = post.team?.members.find((m) => m.userId === userId);
    if (post.userId !== userId && (!teamMember || teamMember.role === "VIEWER")) {
      throw new AuthorizationError("Not authorized to edit this post");
    }

    try {
      return await prisma.post.update({
        where: { id: postId },
        data: {
          content: data.content?.trim(),
          mediaUrl: data.mediaUrl,
          scheduledAt: data.scheduledAt,
          status: data.scheduledAt ? PostStatus.SCHEDULED : post.status,
        },
      });
    } catch (error) {
      throw new AppError("Failed to update post", 500, "DATABASE_ERROR");
    }
  }

  static async deletePost(postId: string, userId: string) {
    if (!postId || !userId) {
      throw new ValidationError("postId and userId are required");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // Check if post is published
    if (post.status === PostStatus.PUBLISHED) {
      throw new ValidationError("Cannot delete published post");
    }

    // Check if user has permission to delete
    const teamMember = post.team?.members.find((m) => m.userId === userId);
    if (post.userId !== userId && (!teamMember || teamMember.role === "VIEWER")) {
      throw new AuthorizationError("Not authorized to delete this post");
    }

    try {
      return await prisma.post.delete({
        where: { id: postId },
      });
    } catch (error) {
      throw new AppError("Failed to delete post", 500, "DATABASE_ERROR");
    }
  }
}
