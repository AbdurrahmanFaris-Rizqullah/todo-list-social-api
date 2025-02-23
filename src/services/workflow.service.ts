import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import { ValidationError, AuthorizationError, NotFoundError } from "@/lib/errors";

export class WorkflowService {
  // Submit post untuk approval
  static async submitForReview(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { team: true }
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.userId !== userId) {
      throw new AuthorizationError("Not authorized to submit this post");
    }

    return await prisma.post.update({
      where: { id: postId },
      data: { status: PostStatus.PENDING }
    });
  }

  // Approve post
  static async approvePost(postId: string, userId: string) {
    const post = await this.checkApprovalPermission(postId, userId);

    return await prisma.post.update({
      where: { id: postId },
      data: { 
        status: post.scheduledAt ? PostStatus.SCHEDULED : PostStatus.APPROVED 
      }
    });
  }

  // Reject post dengan feedback
  static async rejectPost(postId: string, userId: string) {
    await this.checkApprovalPermission(postId, userId);

    return await prisma.post.update({
      where: { id: postId },
      data: { status: PostStatus.REJECTED }
    });
  }

  private static async checkApprovalPermission(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        team: {
          include: {
            members: true
          }
        }
      }
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const teamMember = post.team?.members.find(m => m.userId === userId);
    if (!teamMember || (teamMember.role !== 'ADMIN' && teamMember.role !== 'OWNER')) {
      throw new AuthorizationError("Not authorized to approve/reject posts");
    }

    return post;
  }
}