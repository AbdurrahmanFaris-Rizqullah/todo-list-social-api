import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { AuthenticationError } from './errors';

export async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Invalid authorization header");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as { userId: string };
    const userId = decoded.userId;

    if (!userId) {
      throw new Error("Invalid token payload");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new AuthenticationError();
  }
}

// Helper untuk cek role
export function checkRole(allowedRoles: string[], userRole: string) {
  return allowedRoles.includes(userRole);
}
