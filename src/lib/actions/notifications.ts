"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });

  revalidatePath("/notification");
  return { success: true };
}

export async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;
  return prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });
}

export async function markAllRead() {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/notification");
  return { success: true };
}
