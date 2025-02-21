import prisma from "@/lib/prisma";
import { CreateTeamDTO, AddMemberDTO, SocialAccountDTO } from "@/types/team";

export class TeamService {
  static async createTeam(userId: string, data: CreateTeamDTO) {
    return await prisma.team.create({
      data: {
        name: data.name,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            role: "OWNER",
          },
        },
      },
    });
  }

  static async getTeams(userId: string) {
    return await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId: userId },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async addMember(teamId: string, data: AddMemberDTO) {
    return await prisma.teamMember.create({
      data: {
        teamId: teamId,
        userId: data.userId,
        role: data.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  static async removeMember(teamId: string, userId: string) {
    return await prisma.teamMember.deleteMany({
      where: {
        teamId: teamId,
        userId: userId,
      },
    });
  }

  static async addSocialAccount(teamId: string, data: SocialAccountDTO) {
    return await prisma.socialMedia.create({
      data: {
        platform: data.platform,
        username: data.username,
        token: data.token,
        teamId: teamId,
      },
    });
  }

  static async getSocialAccounts(teamId: string) {
    return await prisma.socialMedia.findMany({
      where: {
        teamId: teamId,
      },
      select: {
        id: true,
        platform: true,
        username: true,
        teamId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
