import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { getJobs } from "@/lib/actions/jobs";
import { getBannerAds } from "@/lib/actions/banners";
import { JobFilters } from "./components/job-filters";
import { TextRolling } from "./components/TextRolling";

/**
 * 홈 — bubblealba 원본 구조, Tailwind v4 토큰 유틸리티 전용
 * 레이아웃: (main)/layout.tsx 가 상단 헤더 + 하단 탭바 + 600px 컨테이너 제공
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; city?: string; category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const banners = await getBannerAds();
  const jobs = await getJobs({
    region: params.region,
    city: params.city,
    category: params.category,
    q: params.q,
  });

  return (
    <>
      {/* 지역/직종 드롭다운 + 검색바 (클라이언트 컴포넌트) */}
      <Suspense>
        <JobFilters />
      </Suspense>

      {/* ===== 사진 광고 영역 ===== */}
      {(banners.imageTop.length > 0 || banners.imageMid.length > 0 || banners.imageBot.length > 0) && (
        <div className="px-15px mt-12px space-y-6px">
          {/* 최상단 2개 — 큰 배너 */}
          {banners.imageTop.length > 0 && (
            <div className="grid grid-cols-2 gap-6px">
              {banners.imageTop.map((ad) => (
                <a key={ad.id} href={ad.linkUrl && ad.linkUrl !== "#" && ad.linkUrl !== "/job" ? ad.linkUrl : `/banner/${ad.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-[2/1]">
                  <img src={ad.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
          {/* 두번째줄 3개 */}
          {banners.imageMid.length > 0 && (
            <div className="grid grid-cols-3 gap-6px">
              {banners.imageMid.map((ad) => (
                <a key={ad.id} href={ad.linkUrl && ad.linkUrl !== "#" && ad.linkUrl !== "/job" ? ad.linkUrl : `/banner/${ad.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-square">
                  <img src={ad.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
          {/* 세번째줄 4개 */}
          {banners.imageBot.length > 0 && (
            <div className="grid grid-cols-4 gap-6px">
              {banners.imageBot.map((ad) => (
                <a key={ad.id} href={ad.linkUrl && ad.linkUrl !== "#" && ad.linkUrl !== "/job" ? ad.linkUrl : `/banner/${ad.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-square">
                  <img src={ad.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== 텍스트 롤링 광고 ===== */}
      {banners.textRolling.length > 0 && (
        <div className="mt-8px">
          <TextRolling ads={banners.textRolling} />
        </div>
      )}

      {/* 초이스톡 + 광고 등록하기 CTA */}
      <div className="mt-12px">
        <Link
          href="/choicetalk"
          className="active-bg-gray flex h-44px items-center gap-6px px-15px font-15sb text-font-black border-b border-line-gray-20"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <span className="mr-auto">초이스톡</span>
          <ChevronRight className="h-18px w-18px text-font-black" strokeWidth={2} />
        </Link>
        <Link
          href="/mypage/ad-center"
          className="active-bg-gray flex h-44px items-center gap-6px px-15px font-15sb text-font-black"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-link-blue/10 text-link-blue">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="mr-auto">광고 등록하기</span>
          <ChevronRight className="h-18px w-18px text-font-black" strokeWidth={2} />
        </Link>
      </div>

      {/* 공고 리스트 */}
      <ul>
        {jobs.map((job) => {
          const daysAdvertised = Math.max(1, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
          const images: string[] = safeJsonParse(job.images as unknown as string, []);
          const tags: string[] = safeJsonParse(job.tags as unknown as string, []);
          return (
            <JobItem key={job.id} job={{ ...job, images, tags }} daysAdvertised={daysAdvertised} />
          );
        })}
        {jobs.length === 0 && (
          <li className="p-15px text-center font-14rg text-font-disabled">
            검색 결과가 없습니다
          </li>
        )}
      </ul>
    </>
  );
}

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}


interface JobItemProps {
  job: {
    id: string;
    title: string;
    wage: string;
    company: string;
    region: string;
    city: string | null;
    category: string;
    images: string[];
    tags: string[];
  };
  daysAdvertised: number;
}

function JobItem({ job, daysAdvertised }: JobItemProps) {
  const wageText = job.wage || "";
  const prefixMatch = wageText.match(/^(시급|일|티씨|월)/);
  const wageLabel = prefixMatch?.[1] ?? "";
  const wageAmount = wageText.replace(/^(시급|일|티씨|월)\s*/, "").trim();

  return (
    <li className="active-bg-opacity relative border-b border-line-gray-20">
      <Link href={`/job/detail/${job.id}`} className="flex items-center gap-15px px-15px py-2px">
        <div
          className="h-70px w-70px shrink-0 rounded-14px bg-bg-gray-50 bg-cover bg-center"
          style={{ backgroundImage: job.images[0] ? `url(${job.images[0]})` : undefined }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2px">
          <div className="flex h-18px items-center gap-3px">
            <GoldBadge />
            <span className="font-12sb text-font-black">{job.company}</span>
            <span className="font-12rg text-font-disabled">· {daysAdvertised}일째 광고중</span>
          </div>
          <h2 className="font-16sb text-font-black truncate">{job.title}</h2>
          <div className="font-13rg">
            <span className="text-font-black">{wageLabel} {wageAmount}</span>
            <span className="text-font-disabled">
              {" · "}
              {job.region} {job.city}
              {" · "}
              {categoryLabel(job.category)}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

function GoldBadge() {
  return (
    <svg
      width={16}
      height={16}
      className="shrink-0"
      viewBox="0 0 16 16"
      aria-label="GOLD"
      role="img"
    >
      <defs>
        <radialGradient id="goldG" cx="35%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#ffe57a" />
          <stop offset="50%" stopColor="#ffc200" />
          <stop offset="100%" stopColor="#c98a00" />
        </radialGradient>
      </defs>
      <circle cx="8" cy="8" r="7" fill="url(#goldG)" stroke="#b07600" strokeWidth="0.6" />
      <text
        x="8"
        y="10.8"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="900"
        fill="#6b4400"
        fontFamily="Arial, sans-serif"
      >
        G
      </text>
    </svg>
  );
}

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
