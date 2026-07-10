import Link from "next/link";
import { getJobs } from "@/lib/actions/jobs";
import { JobFilterSelect } from "../components/JobFilterSelect";

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

export default async function JobListPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; category?: string }>;
}) {
  const { region, category } = await searchParams;
  const jobs = await getJobs({ region, category });

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">전체 구인 공고</h1>
        <p className="font-13rg text-font-gray">총 {jobs.length}개 공고</p>
      </div>

      {/* 지역·업종 필터 — 버튼 → 네이티브 select 2개 한 줄 (사용자 지시 2026-07-10) */}
      <JobFilterSelect />

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
          const images: string[] = safeJsonParse(job.images as unknown, []);
          return (
            <Link key={job.id} href={`/job/detail/${job.id}`} className="block active-bg bg-bg-white px-15px py-14px">
              <div className="flex gap-15px">
                {/* 왼쪽 정사각 프로필 썸네일 (메인페이지 공고와 동일) */}
                <div
                  className="h-70px w-70px shrink-0 rounded-14px bg-bg-gray-50 bg-cover bg-center"
                  style={{ backgroundImage: images[0] ? `url(${images[0]})` : undefined }}
                />
                {/* 카드 우측 텍스트 — 5줄 → 3줄로 통일: 태그 / 제목(1줄) / 지역·급여 (사용자 지시 2026-07-10, 조회수·좋아요·시간 줄 제거) */}
                <div className="min-w-0 flex-1">
                  {/* ① 태그(광고 문구) */}
                  <div className="flex gap-6px mb-6px flex-wrap">
                    {tags.slice(0, 2).map((t) => (
                      // 태그 칩 — 로즈(급여 그린과 대비). 색상 샘플 14번 선택 (사용자 지시 2026-07-10)
                      <span key={t} className="font-11rg px-6px py-1px rounded-4px bg-rose-100 text-rose-600">{t}</span>
                    ))}
                  </div>
                  {/* ② 제목 — 1줄 고정으로 모든 카드 높이 정렬 */}
                  <h3 className="font-15sb text-font-black line-clamp-1 mb-6px">{job.title}</h3>
                  {/* ③ 지역(좌) · 급여(우) 한 줄 */}
                  <div className="flex items-center gap-4px font-12rg text-font-gray">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span className="truncate">{job.region} {job.city}</span>
                    {/* 급여 — 머니그린. 색상 샘플 14번 선택 (사용자 지시 2026-07-10) */}
                    <span className="ml-auto shrink-0 font-14sb text-green-600">{job.wage}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
