import prisma from "@/lib/prisma";
import { CreateTeamDTO, AddMemberDTO } from "@/types/team";

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
}
