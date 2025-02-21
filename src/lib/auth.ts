import { headers } from "next/headers";
import prisma from "./prisma";

export async function getCurrentUser() {
  const headersList = headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    throw new Error("Not authenticated");
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
}

// Helper untuk cek role
export function checkRole(allowedRoles: string[], userRole: string) {
  return allowedRoles.includes(userRole);
}
