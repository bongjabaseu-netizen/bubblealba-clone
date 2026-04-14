/** 초이스톡 톡방 — 채팅 UI */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getChoiceTalkRoom, getChoiceTalkMessages } from "@/lib/actions/choicetalk";
import { ChoiceTalkInput } from "./input";

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDateSeparator(date: Date): string {
  return new Date(date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

/** 메시지를 날짜별로 그룹핑 */
function groupByDate(messages: { createdAt: Date; [key: string]: unknown }[]) {
  const groups: { date: string; items: typeof messages }[] = [];
  let currentDate = "";
  for (const msg of messages) {
    const d = new Date(msg.createdAt).toDateString();
    if (d !== currentDate) {
      currentDate = d;
      groups.push({ date: formatDateSeparator(msg.createdAt), items: [] });
    }
    groups[groups.length - 1].items.push(msg);
  }
  return groups;
}

export default async function ChoiceTalkRoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = await getChoiceTalkRoom(slug);
  if (!room) notFound();

  const messages = await getChoiceTalkMessages(room.id);
  const groups = groupByDate(messages);

  return (
    <>
      {/* 뒤로가기 + 방 이름 */}
      <div className="flex items-center gap-10px px-15px py-8px border-b border-line-gray-20">
        <Link href="/choicetalk" className="active-bg rounded-6px p-4px">
          <svg className="w-5 h-5 text-font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-8px flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
            {room.logo ? (
              <img src={room.logo} alt={room.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-12sb text-font-gray">{room.name[0]}</span>
            )}
          </div>
          <span className="font-15sb text-font-black truncate">{room.name} 초이스톡</span>
        </div>
        <div className="font-12rg text-font-disabled">
          맞출방 {room.roomCount} · 인원 {room.memberCount}
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-15px pb-[80px]">
        {groups.map((group) => (
          <div key={group.date}>
            {/* 날짜 구분선 */}
            <div className="flex items-center gap-10px my-16px">
              <div className="flex-1 h-[1px] bg-line-gray-20" />
              <span className="font-12rg text-font-disabled shrink-0">{group.date}</span>
              <div className="flex-1 h-[1px] bg-line-gray-20" />
            </div>

            {/* 메시지들 */}
            {group.items.map((msg: any) => (
              <div key={msg.id} className="flex gap-8px mb-12px">
                {/* 프로필 */}
                <div className="w-9 h-9 rounded-full bg-primary/10 shrink-0 flex items-center justify-center">
                  <span className="font-12sb text-primary">
                    {(msg.author?.nickname ?? "?")[0]}
                  </span>
                </div>
                {/* 말풍선 */}
                <div className="flex-1 min-w-0">
                  <span className="font-12rg text-font-gray">{room.name}</span>
                  <div className="mt-3px rounded-10px rounded-tl-none bg-bg-gray-20 px-12px py-8px">
                    <p className="font-14rg text-font-black whitespace-pre-line break-words">{msg.content}</p>
                  </div>
                </div>
                {/* 시간 */}
                <span className="font-10rg text-font-disabled self-end shrink-0 mb-2px">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex items-center justify-center py-40px">
            <p className="font-14rg text-font-disabled">아직 메시지가 없습니다</p>
          </div>
        )}
      </div>

      {/* 하단 입력 */}
      <ChoiceTalkInput roomId={room.id} ownerId={room.ownerId} />
    </>
  );
}
