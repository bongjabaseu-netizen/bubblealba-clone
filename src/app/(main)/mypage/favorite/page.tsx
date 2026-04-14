import Link from "next/link";
import { getFavorites } from "@/lib/actions/users";

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

export default async function FavoritePage() {
  const favorites = await getFavorites();

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">즐겨찾기</h1>
        <p className="font-13rg text-font-gray">하트 누른 공고들이에요</p>
      </div>

      {favorites.length === 0 && (
        <p className="font-13rg text-font-disabled">즐겨찾기한 공고가 없습니다.</p>
      )}

      <div className="space-y-10px">
        {favorites.map((fav) => {
          const job = fav.job;
          return (
            <Link key={fav.id} href={`/job/detail/${job.id}`} className="flex items-center gap-12px active-bg rounded-14px border border-line-gray-20 p-12px">
              <button className="absolute top-10px right-10px w-28px h-28px flex items-center justify-center z-10">
                <svg className="w-4 h-4 text-warn-red fill-warn-red" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-15sb text-font-black line-clamp-1 mb-4px">{job.title}</h3>
                <div className="flex items-center gap-4px font-12rg text-font-gray mb-4px">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {job.region} {job.city}
                </div>
                <span className="font-14sb text-primary">{job.wage}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
