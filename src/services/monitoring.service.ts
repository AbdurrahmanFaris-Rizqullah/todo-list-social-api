import prisma from "@/lib/prisma";
import { AuthorizationError } from "@/lib/errors";
import { NotificationService } from "./notification.service";

export class MonitoringService {
  static async logActivity(data: {
    action: 'POST_CREATE' | 'POST_UPDATE' | 'POST_DELETE' | 'POST_APPROVE' | 'POST_REJECT';
    status: 'success' | 'failed';
    userId: string;
    teamId?: string;
    postId?: string;
    details?: string;
  }) {
    const { action, status, userId, teamId, postId, details } = data;
    
    // Log activity implementation
    console.log(`Activity logged: ${action} - ${status}`);
    
    // Send notifications if needed
    if (teamId) {
      await this.notifyTeam(teamId, action, status);
    }
  }

  static async getTeamActivities(teamId: string, userId: string) {
    // Verify team membership
    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!member) {
      throw new AuthorizationError("Not authorized to view team activities");
    }

    // Get team activities implementation
    return []; // Replace with actual implementation
  }

  private static async notifyTeam(teamId: string, action: string, status: string) {
    const message = `Team activity: ${action} ${status}`;
    // Send to both Slack and Discord if configured
    await NotificationService.sendWebhookNotification(teamId, message, 'slack');
    await NotificationService.sendWebhookNotification(teamId, message, 'discord');
  }
}