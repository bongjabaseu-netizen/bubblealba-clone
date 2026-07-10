export const dynamic = "force-dynamic";
import Link from "next/link";
import { Search } from "lucide-react"; // ChevronRight·Plus 미사용(초이스톡·지역검색 세로형 전환·CTA 숨김) 2026-07-09
import { getBannerAds } from "@/lib/actions/banners";
// import { getJobs } from "@/lib/actions/jobs"; // 공고 리스트 임시 숨김 (2026-07-09)
// import { JobFilters } from "./components/job-filters"; // 홈 필터/검색 임시 숨김 (2026-07-08)
// import { TextRolling } from "./components/TextRolling"; // 텍스트롤링 광고 임시 숨김 (2026-07-09)
import { HeroMarquee } from "./components/HeroMarquee";

// 상단 히어로 마퀴 샘플 배너 (갯수 자유롭게 늘릴 수 있음 · 사용자 지시 2026-07-09)
const HERO_BANNERS = [
  "/banners/sample/top-1.svg",
  "/banners/sample/top-2.svg",
  "/banners/sample/bot-03.svg",
  "/banners/sample/bot-08.svg",
  "/banners/sample/bot-13.svg",
  "/banners/sample/bot-18.svg",
];

/**
 * 홈 — bubblealba 원본 구조, Tailwind v4 토큰 유틸리티 전용
 * 레이아웃: (main)/layout.tsx 가 상단 헤더 + 하단 탭바 + 600px 컨테이너 제공
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; city?: string; category?: string; q?: string }>;
}) {
  const banners = await getBannerAds();
  // 상단 히어로 마퀴: 관리자 등록 HERO_SLIDE 배너 사용, 없으면 샘플 폴백 (관리자 추가 시 자동 슬라이딩·갯수 가변)
  const heroImages = banners.heroSlide.length
    ? banners.heroSlide.map((b) => b.imageUrl).filter((u): u is string => !!u)
    : HERO_BANNERS;
  // 홈 임시: 배너 광고만 노출 → 필터/공고 조회 비활성 (사용자 지시 2026-07-09)
  // const params = await searchParams;
  // const jobs = await getJobs({ region: params.region, city: params.city, category: params.category, q: params.q });

  return (
    <>
      {/* 초이스톡·지역검색 — 카톡식 퀵메뉴: 아이콘 상단·텍스트 하단 가운데정렬, 2열 (사용자 디자인 지시 2026-07-09) */}
      <div className="grid grid-cols-2 border-b border-line-gray-20 pt-[18px]">
        <Link
          href="/choicetalk"
          className="active-bg-gray flex flex-col items-center justify-center gap-6px py-14px text-font-black border-r border-line-gray-20"
        >
          {/* 카카오톡 아이콘 — 노란 배지 + 갈색 말풍선 (사용자 지시 2026-07-09) */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FEE500]">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#3C1E1E" aria-label="카카오톡"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.67 1.78 5.01 4.46 6.33-.2.72-.72 2.62-.82 3.03-.13.5.18.5.39.36.16-.11 2.6-1.77 3.66-2.49.59.09 1.19.13 1.81.13 5.25 0 9.5-3.36 9.5-7.5S17.25 3.5 12 3.5z"/></svg>
          </div>
          <span className="font-12sb">초이스톡</span>
        </Link>
        <Link
          href="/job"
          className="active-bg-gray flex flex-col items-center justify-center gap-6px py-14px text-font-black"
        >
          {/* 검색 아이콘 — 검정 배지 + 흰 돋보기 (초이스톡 노랑과 카톡 팔레트로 짝맞춤, 사용자 지시 2026-07-09) */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-font-black">
            <Search className="h-6 w-6 text-white" strokeWidth={2.25} />
          </div>
          <span className="font-12sb">지역검색</span>
        </Link>
      </div>

      {/* 지역/직종 드롭다운 + 검색바 — 홈에서 임시 숨김 (사용자 디자인 지시 2026-07-08)
      <Suspense>
        <JobFilters />
      </Suspense>
      */}

      {/* ===== 히어로 배너 마퀴 ===== 여러 배너 좌슬라이딩(갯수 가변) — 위 초이스톡·아래 2개배너와 3px 간격 (사용자 지시 2026-07-09) */}
      <div className="mt-[3px]">
        <HeroMarquee images={heroImages} height={80} />
      </div>

      {/* ===== 사진 광고 영역 ===== 배너 사이 3px 간격(gap-[3px], 좌우 맨끝은 붙음·그리드 블록 사이도 3px)·높이 75px·각진 모서리 (사용자 샘플 2026-07-09) */}
      {(banners.imageTop.length > 0 || banners.imageMid.length > 0 || banners.imageBot.length > 0) && (
        <div className="flex flex-col gap-[3px] mt-[3px]">
          {/* 최상단 2개 — 큰 배너 (2:1 → 4:1로 높이 절반) */}
          {banners.imageTop.length > 0 && (
            <div className="grid grid-cols-2 gap-[3px]">
              {banners.imageTop.map((ad) => (
                <a key={ad.id} href={ad.linkUrl && ad.linkUrl !== "#" && ad.linkUrl !== "/job" ? ad.linkUrl : `/banner/${ad.id}`} className="block overflow-hidden bg-bg-gray-50 h-[75px]">
                  <img src={ad.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
          {/* 두번째줄 3개 (1:1 → 2:1로 높이 절반) */}
          {banners.imageMid.length > 0 && (
            <div className="grid grid-cols-3 gap-[3px]">
              {banners.imageMid.map((ad) => (
                <a key={ad.id} href={ad.linkUrl && ad.linkUrl !== "#" && ad.linkUrl !== "/job" ? ad.linkUrl : `/banner/${ad.id}`} className="block overflow-hidden bg-bg-gray-50 h-[75px]">
                  <img src={ad.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
          {/* 세번째줄 4개 (1:1 → 2:1로 높이 절반) */}
          {banners.imageBot.length > 0 && (
            <div className="grid grid-cols-4 gap-[3px]">
              {banners.imageBot.map((ad) => (
                <a key={ad.id} href={ad.linkUrl && ad.linkUrl !== "#" && ad.linkUrl !== "/job" ? ad.linkUrl : `/banner/${ad.id}`} className="block overflow-hidden bg-bg-gray-50 h-[75px]">
                  <img src={ad.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== 아래 3블록(텍스트롤링 광고·출석체크/광고등록 CTA·공고 리스트) 홈에서 임시 숨김 — 배너 광고만 노출 (사용자 디자인 지시 2026-07-09) ===== */}

      {/* 텍스트 롤링 광고 (숨김)
      {banners.textRolling.length > 0 && (
        <div>
          <TextRolling ads={banners.textRolling} />
        </div>
      )}
      */}

      {/* 출석체크 + 광고 등록하기 CTA (숨김)
      <div className="mt-12px">
        <Link href="/attendance" className="active-bg-gray flex h-44px items-center gap-6px px-15px font-15sb text-font-black border-b border-line-gray-20">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-green-500/10 text-green-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="mr-auto">출석체크</span>
          <span className="text-xs text-orange-500 font-bold mr-1">매일 포인트 적립!</span>
          <ChevronRight className="h-18px w-18px text-font-black" strokeWidth={2} />
        </Link>
        <Link href="/mypage/ad-center" className="active-bg-gray flex h-44px items-center gap-6px px-15px font-15sb text-font-black">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-link-blue/10 text-link-blue">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="mr-auto">광고 등록하기</span>
          <ChevronRight className="h-18px w-18px text-font-black" strokeWidth={2} />
        </Link>
      </div>
      */}

      {/* 공고 리스트 (숨김)
      <ul>
        {jobs.map((job) => {
          const daysAdvertised = Math.max(1, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
          const images = safeJsonParse(job.images, []);
          const tags = safeJsonParse(job.tags, []);
          return (<JobItem key={job.id} job={{ ...job, images, tags }} daysAdvertised={daysAdvertised} />);
        })}
      </ul>
      */}
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
            <span className="font-12sb text-orange-600">{job.company}</span>
            <span className="font-12rg text-font-disabled">· {daysAdvertised}일째 광고중</span>
          </div>
          <h2 className="font-16sb text-font-black truncate">{job.title}</h2>
          <div className="font-13rg">
            <span className="text-font-black">{wageLabel} {wageAmount}</span>
            <span className="text-blue-500">
              {" · "}
              {job.region} {job.city}</span>
            <span className="text-font-disabled">
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
