/** 관리자 초이스톡 관리 — 톡방 목록 + 생성/삭제/토글 */
import { adminGetChoiceTalkRooms } from "@/lib/actions/choicetalk";
import { prisma } from "@/lib/prisma";
import { ChoiceTalkAdmin } from "./ChoiceTalkAdmin";

export default async function AdminChoiceTalkPage() {
  const rooms = await adminGetChoiceTalkRooms();
  const advertisers = await prisma.user.findMany({
    where: { role: { in: ["ADVERTISER", "ADMIN"] } },
    select: { id: true, nickname: true, email: true },
  });

  return <ChoiceTalkAdmin rooms={rooms as any} advertisers={advertisers} />;
}
