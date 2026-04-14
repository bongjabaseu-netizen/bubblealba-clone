/** 초이스톡 Server Actions — 톡방 목록/상세/메시지 전송 + 관리자 CRUD */
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** 톡방 목록 (검색 지원) */
export async function getChoiceTalkRooms(search?: string) {
  const where: Record<string, unknown> = { isActive: true };
  if (search) {
    where.name = { contains: search };
  }
  return prisma.choiceTalkRoom.findMany({
    where,
    include: {
      owner: { select: { nickname: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { lastMessageAt: { sort: "desc", nulls: "last" } },
  });
}

/** 톡방 상세 (slug로 조회) */
export async function getChoiceTalkRoom(slug: string) {
  return prisma.choiceTalkRoom.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, nickname: true, image: true } },
    },
  });
}

/** 톡방 메시지 조회 */
export async function getChoiceTalkMessages(roomId: string) {
  return prisma.choiceTalkMessage.findMany({
    where: { roomId },
    include: {
      author: { select: { nickname: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

/** 메시지 전송 (ADVERTISER + 본인 톡방만) */
export async function sendChoiceTalkMessage(roomId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const room = await prisma.choiceTalkRoom.findUnique({
    where: { id: roomId },
  });
  if (!room) return { error: "톡방을 찾을 수 없습니다" };
  if (room.ownerId !== session.user.id) return { error: "본인 톡방에만 작성할 수 있습니다" };

  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 2000) return { error: "메시지는 1~2000자로 입력해주세요" };

  const message = await prisma.choiceTalkMessage.create({
    data: {
      content: trimmed,
      roomId,
      authorId: session.user.id,
    },
  });

  await prisma.choiceTalkRoom.update({
    where: { id: roomId },
    data: { lastMessageAt: new Date() },
  });

  return { success: true, message };
}

// ========== 관리자 ==========

/** 관리자: 전체 톡방 목록 */
export async function adminGetChoiceTalkRooms() {
  return prisma.choiceTalkRoom.findMany({
    include: {
      owner: { select: { nickname: true, email: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** 관리자: 톡방 생성 */
export async function adminCreateRoom(formData: FormData) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const ownerId = formData.get("ownerId") as string;
  const logo = (formData.get("logo") as string) || null;

  if (!name || !slug || !ownerId) return { error: "필수 필드를 입력해주세요" };

  const exists = await prisma.choiceTalkRoom.findUnique({ where: { slug } });
  if (exists) return { error: "이미 사용 중인 슬러그입니다" };

  await prisma.choiceTalkRoom.create({
    data: { name, slug, ownerId, logo },
  });
  return { success: true };
}

/** 관리자: 톡방 활성/비활성 토글 */
export async function adminToggleRoom(roomId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  const room = await prisma.choiceTalkRoom.findUnique({ where: { id: roomId } });
  if (!room) return { error: "톡방 없음" };

  await prisma.choiceTalkRoom.update({
    where: { id: roomId },
    data: { isActive: !room.isActive },
  });
  return { success: true };
}

/** 관리자: 톡방 삭제 */
export async function adminDeleteRoom(roomId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  await prisma.choiceTalkRoom.delete({ where: { id: roomId } });
  return { success: true };
}
