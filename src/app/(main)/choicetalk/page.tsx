/** 초이스톡 목록 — 업소별 톡방 카드 리스트 */
import Link from "next/link";
import { getChoiceTalkRooms } from "@/lib/actions/choicetalk";

function formatTime(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const isToday = d.toDateString() === now.toDateString();
  const isYesterday = diff < 86400000 * 2 && new Date(now.getTime() - 86400000).toDateString() === d.toDateString();

  const time = d.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true });
  if (isToday) return time;
  if (isYesterday) return `어제 ${time}`;
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export default async function ChoiceTalkListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const rooms = await getChoiceTalkRooms(q);

  return (
    <>
      {/* 검색 */}
      <div className="px-15px mt-12px">
        <form>
          <div className="flex items-center gap-8px rounded-10px border border-line-gray-50 px-12px h-button">
            <svg className="w-4 h-4 text-font-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              name="q"
              defaultValue={q}
              placeholder="초이스톡 검색"
              className="flex-1 bg-transparent font-14rg text-font-black placeholder:text-font-disabled outline-none"
            />
          </div>
        </form>
      </div>

      {/* 톡방 리스트 */}
      <ul className="mt-8px">
        {rooms.map((room) => (
          <li key={room.id}>
            <Link
              href={`/choicetalk/${room.slug}`}
              className="flex items-center gap-12px px-15px py-12px active-bg border-b border-line-gray-20"
            >
              {/* 로고 */}
              <div className="w-[56px] h-[56px] rounded-14px bg-bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                {room.logo ? (
                  <img src={room.logo} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-16sb text-font-gray">{room.name[0]}</span>
                )}
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-15sb text-font-black truncate">{room.name}</span>
                  <span className="font-12rg text-font-disabled shrink-0 ml-8px">
                    {formatTime(room.lastMessageAt)}
                  </span>
                </div>
                <div className="font-13rg text-font-gray mt-2px">
                  맞출방 {room.roomCount} · 맞출인원 {room.memberCount}
                </div>
              </div>
            </Link>
          </li>
        ))}

        {rooms.length === 0 && (
          <li className="px-15px py-40px text-center">
            <p className="font-14rg text-font-disabled">
              {q ? `"${q}" 검색 결과가 없습니다` : "등록된 초이스톡이 없습니다"}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}
