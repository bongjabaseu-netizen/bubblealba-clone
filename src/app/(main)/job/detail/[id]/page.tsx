import Link from "next/link";
import { notFound } from "next/navigation";
import { getJob, getJobs } from "@/lib/actions/jobs";
import { ApplyButton } from "./apply-button";

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

/** 업종 ID → 한글 라벨 */
function categoryLabel(id: string): string {
  const map: Record<string, string> = {
    room: "룸싸롱",
    karaoke: "가라오케",
    hyperblick: "하이퍼블릭",
    massage: "마사지",
    bar: "바",
    ten: "텐카페",
    song: "노래주점",
    office: "오피스텔",
    etc: "기타",
  };
  return map[id] ?? id;
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

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const images: string[] = safeJsonParse(job.images as unknown, []);
  const tags: string[] = safeJsonParse(job.tags as unknown, []);

  const allJobs = await getJobs({ category: job.category });
  const related = allJobs.filter((j) => j.id !== id).slice(0, 3);

  return (
    <div className="pb-20px">
      {/* 빵부스러기 */}
      <nav className="px-15px py-10px flex items-center gap-4px font-12rg text-font-gray">
        <Link href="/" className="text-font-gray">홈</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <Link href="/job" className="text-font-gray">구인</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-font-black truncate max-w-[200px]">{job.title}</span>
      </nav>

      {/* 이미지 */}
      {images[0] && (
        <div
          className="w-full h-[240px] bg-bg-gray-50 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[0]})` }}
        />
      )}

      <div className="px-15px">
        {/* 태그 */}
        <div className="flex gap-6px flex-wrap mt-16px mb-8px">
          {tags.map((t) => (
            <span key={t} className="font-12rg px-8px py-3px rounded-6px bg-primary/10 text-primary border border-primary/20">{t}</span>
          ))}
        </div>

        {/* 제목 */}
        <h1 className="font-18sb text-font-black mb-10px leading-tight">{job.title}</h1>

        {/* 메타 정보 */}
        <div className="flex items-center gap-12px font-12rg text-font-gray mb-16px">
          <span className="flex items-center gap-2px">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {job.region} {job.city}
          </span>
          <span className="flex items-center gap-2px">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            {(job.views ?? 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-2px">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            {job._count?.favorites ?? 0}
          </span>
          <span className="flex items-center gap-2px ml-auto">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            {relativeTime(new Date(job.createdAt))}
          </span>
        </div>

        <hr className="border-line-gray-20" />

        {/* 공고 상세 */}
        <section className="py-16px">
          <h2 className="font-15sb text-font-black mb-10px">공고 상세</h2>
          <p className="font-14rg text-font-black leading-relaxed whitespace-pre-line">{job.description}</p>
        </section>

        <hr className="border-line-gray-20" />

        {/* 근무 조건 */}
        <section className="py-16px">
          <h2 className="font-15sb text-font-black mb-10px">근무 조건</h2>
          <dl className="grid grid-cols-2 gap-y-12px gap-x-16px">
            <div>
              <dt className="font-12rg text-font-gray mb-2px">업체</dt>
              <dd className="font-14sb text-font-black">{job.company}</dd>
            </div>
            <div>
              <dt className="font-12rg text-font-gray mb-2px">급여</dt>
              <dd className="font-14sb text-primary">{job.wage}</dd>
            </div>
            <div>
              <dt className="font-12rg text-font-gray mb-2px">지역</dt>
              <dd className="font-14sb text-font-black">{job.region} {job.city}</dd>
            </div>
            <div>
              <dt className="font-12rg text-font-gray mb-2px">업종</dt>
              <dd className="font-14sb text-font-black">{categoryLabel(job.category)}</dd>
            </div>
          </dl>
        </section>

        <hr className="border-line-gray-20" />

        {/* 액션 버튼 */}
        <div className="py-16px space-y-10px">
          <div className="font-18sb text-primary">{job.wage}</div>
          <button className="w-full h-44px rounded-10px bg-primary text-white font-15sb flex items-center justify-center gap-6px">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            전화 문의
          </button>
          <ApplyButton jobId={job.id} />
          <hr className="border-line-gray-20" />
          <div className="flex justify-around">
            <button className="flex flex-col items-center gap-4px font-12rg text-font-gray active-bg px-12px py-8px rounded-10px">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              즐겨찾기
            </button>
            <button className="flex flex-col items-center gap-4px font-12rg text-font-gray active-bg px-12px py-8px rounded-10px">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
              공유
            </button>
            <button className="flex flex-col items-center gap-4px font-12rg text-font-gray active-bg px-12px py-8px rounded-10px">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
              신고
            </button>
          </div>
        </div>

        {/* 업체 정보 */}
        <div className="rounded-14px border border-line-gray-20 p-14px mb-16px">
          <h3 className="font-14sb text-font-black mb-6px">업체 정보</h3>
          <span className="font-13rg text-font-gray">{job.company}</span>
        </div>

        {/* 관련 공고 */}
        {related.length > 0 && (
          <section>
            <h2 className="font-15sb text-font-black mb-10px">관련 공고</h2>
            <div className="space-y-8px">
              {related.map((r) => {
                const rImages: string[] = safeJsonParse(r.images as unknown, []);
                return (
                  <Link key={r.id} href={`/job/detail/${r.id}`} className="block active-bg rounded-14px border border-line-gray-20 p-12px">
                    <h4 className="font-14sb text-font-black line-clamp-1 mb-4px">{r.title}</h4>
                    <span className="font-13sb text-primary">{r.wage}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
