import Link from "next/link";
import { getJobs } from "@/lib/actions/jobs";

const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "광주", "대전",
  "울산", "세종", "강원",
];

const CATEGORIES = [
  { id: "room", name: "룸싸롱", icon: "🎤" },
  { id: "karaoke", name: "가라오케", icon: "🎶" },
  { id: "hyperblick", name: "하이퍼블릭", icon: "✨" },
  { id: "massage", name: "마사지", icon: "💆" },
  { id: "bar", name: "바", icon: "🍸" },
  { id: "ten", name: "텐카페", icon: "🍷" },
  { id: "song", name: "노래주점", icon: "🎼" },
  { id: "office", name: "오피스텔", icon: "🏢" },
  { id: "etc", name: "기타", icon: "📋" },
];

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

export default async function JobListPage() {
  const jobs = await getJobs();

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">전체 구인 공고</h1>
        <p className="font-13rg text-font-gray">총 {jobs.length}개 공고</p>
      </div>

      {/* 지역 필터 */}
      <div>
        <h3 className="font-14sb text-font-black mb-8px">지역</h3>
        <div className="flex flex-wrap gap-6px">
          {REGIONS.map((r) => (
            <Link
              key={r}
              href={`/job/${encodeURIComponent(r)}/전체`}
              className="h-32px px-12px flex items-center rounded-full border border-line-gray-20 font-13rg text-font-black active-bg"
            >
              {r}
            </Link>
          ))}
        </div>
      </div>

      {/* 업종 필터 */}
      <div>
        <h3 className="font-14sb text-font-black mb-8px">업종</h3>
        <div className="flex flex-wrap gap-6px">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className="h-36px px-12px flex items-center gap-6px rounded-10px border border-line-gray-20 font-13rg text-font-black active-bg"
            >
              <span>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 */}
      <div className="flex gap-8px">
        <button className="h-32px px-12px rounded-full bg-font-black text-white font-13sb">최신순</button>
        <button className="h-32px px-12px rounded-full border border-line-gray-20 font-13rg text-font-gray">조회수</button>
        <button className="h-32px px-12px rounded-full border border-line-gray-20 font-13rg text-font-gray">인기순</button>
      </div>

      {/* 공고 리스트 */}
      <div className="space-y-1px bg-line-gray-20">
        {jobs.map((job) => {
          const tags: string[] = safeJsonParse(job.tags as unknown, []);
          return (
            <Link key={job.id} href={`/job/detail/${job.id}`} className="block active-bg bg-bg-white px-15px py-14px">
              <div className="flex gap-6px mb-6px flex-wrap">
                {tags.slice(0, 2).map((t) => (
                  <span key={t} className="font-11rg px-6px py-1px rounded-4px bg-primary/10 text-primary">{t}</span>
                ))}
              </div>
              <h3 className="font-15sb text-font-black line-clamp-2 mb-6px">{job.title}</h3>
              <div className="flex items-center gap-4px font-12rg text-font-gray mb-4px">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {job.region} {job.city}
              </div>
              <div className="font-14sb text-primary mb-6px">{job.wage}</div>
              <div className="flex items-center gap-10px font-12rg text-font-disabled">
                <span className="flex items-center gap-2px">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  {(job.views ?? 0).toLocaleString()}
                </span>
                <span className="flex items-center gap-2px">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  {job._count?.favorites ?? 0}
                </span>
                <span className="ml-auto">{relativeTime(new Date(job.createdAt))}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
