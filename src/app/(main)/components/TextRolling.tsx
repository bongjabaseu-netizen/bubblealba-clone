/** 텍스트 롤링 광고 — 5줄 보이고 무한 스크롤 */
"use client";

import { useEffect, useRef } from "react";

interface TextAd {
  id: string;
  text: string | null;
  linkUrl: string | null;
}

export function TextRolling({ ads }: { ads: TextAd[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || ads.length === 0) return;

    const lineHeight = 28; // 한 줄 높이(px)
    let offset = 0;
    const inner = container.querySelector("[data-rolling]") as HTMLElement;
    if (!inner) return;

    const interval = setInterval(() => {
      offset += 1;
      // 전체 높이의 절반(원본 높이)을 넘으면 리셋 — 무한 루프
      if (offset >= inner.scrollHeight / 2) {
        offset = 0;
      }
      inner.style.transform = `translateY(-${offset}px)`;
    }, 40); // ~25fps smooth scroll

    return () => clearInterval(interval);
  }, [ads]);

  if (ads.length === 0) return null;

  // 무한 스크롤 위해 광고 목록을 2번 반복
  const doubled = [...ads, ...ads];

  return (
    <div
      ref={containerRef}
      className="overflow-hidden border-y border-line-gray-20 bg-bg-gray-20"
      style={{ height: 140 }} // 5줄 × 28px
    >
      <div data-rolling className="transition-none">
        {doubled.map((ad, i) => (
          <a
            key={`${ad.id}-${i}`}
            href={ad.linkUrl ?? "#"}
            className="flex items-center px-15px font-13rg text-font-black hover:text-primary truncate"
            style={{ height: 28 }}
          >
            <span className="w-4 h-4 rounded bg-primary/10 text-primary font-10rg flex items-center justify-center shrink-0 mr-8px">
              AD
            </span>
            <span className="truncate">{ad.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
