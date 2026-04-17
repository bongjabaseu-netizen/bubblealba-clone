export const dynamic = "force-dynamic";
/** 초이스톡 목록 — 업소별 톡방 카드 + 즐겨찾기 별표 */
import Link from "next/link";
import { getChoiceTalkRooms, getMyChoiceTalkFavorites } from "@/lib/actions/choicetalk";
import { FavoriteStar } from "./FavoriteStar";

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

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

export default async function ChoiceTalkListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [rooms, favoriteIds] = await Promise.all([
    getChoiceTalkRooms(q),
    getMyChoiceTalkFavorites(),
  ]);

  const favSet = new Set(favoriteIds);

  // 즐겨찾기 상단 정렬
  const sorted = [...rooms].sort((a, b) => {
    const aFav = favSet.has(a.id) ? 0 : 1;
    const bFav = favSet.has(b.id) ? 0 : 1;
    return aFav - bFav;
  });

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
        {sorted.map((room) => {
          const jobImages: string[] = room.job?.images ? safeJsonParse(room.job.images, []) : [];
          const displayLogo = room.logo || jobImages[0] || null;
          const displayName = room.job?.company || room.name;
          const location = room.job ? `${room.job.region} ${room.job.city ?? ""}`.trim() : "";
          const isFav = favSet.has(room.id);

          return (
            <li key={room.id} className={isFav ? "bg-yellow-50/50" : ""}>
              <Link
                href={`/choicetalk/${room.slug}`}
                className="flex items-center gap-12px px-15px py-12px active-bg border-b border-line-gray-20"
              >
                {/* 로고/배너 이미지 */}
                <div className="w-[56px] h-[56px] rounded-14px bg-bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                  {displayLogo ? (
                    <img src={displayLogo} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-16sb text-font-gray">{displayName[0]}</span>
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-15sb text-orange-600 truncate">{displayName}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-4px">
                      <span className="font-12rg text-font-disabled">
                        {formatTime(room.lastMessageAt)}
                      </span>
                      <FavoriteStar roomId={room.id} isFavorited={isFav} />
                    </div>
                  </div>
                  <div className="font-13rg text-font-gray mt-2px">
                    {location && <span className="text-blue-500">{location} · </span>}
                    맞출방 {room.roomCount} · 맞출인원 {room.memberCount}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}

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
