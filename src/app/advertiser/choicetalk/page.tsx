/** 광고주 초이스톡 관리 — 내 톡방 목록 + 메시지 전송 */
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdvertiserChoiceTalk } from "./AdvertiserChoiceTalk";

export default async function AdvertiserChoiceTalkPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rooms = await prisma.choiceTalkRoom.findMany({
    where: { ownerId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { author: { select: { nickname: true } } },
      },
      _count: { select: { messages: true } },
    },
  });

  return <AdvertiserChoiceTalk rooms={rooms as any} />;
}
