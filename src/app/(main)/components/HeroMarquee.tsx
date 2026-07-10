/** 히어로 배너 마퀴 — 여러 배너가 왼쪽으로 무한 슬라이딩 (갯수 가변)
 * from: 사용자 지시(2026-07-09) 홈 로고 배너 자리를 여러 개 좌슬라이딩으로. TextRolling 가로 버전(목록 2배 복제 + JS transform 무한 루프). */
"use client";

import { useEffect, useRef } from "react";

/** images: 슬라이딩할 배너 이미지 경로들 (갯수 자유) · height: 높이(px) · speed: 프레임당 이동 px */
export function HeroMarquee({ images, height = 80, speed = 0.6 }: { images: string[]; height?: number; speed?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || images.length === 0) return;
    const inner = container.querySelector("[data-marquee]") as HTMLElement | null;
    if (!inner) return;

    let offset = 0;
    let raf = 0;
    const step = () => {
      offset += speed;
      // 원본(절반) 폭을 넘으면 0으로 리셋 → 끊김 없는 무한 루프 (각 이미지에 동일 mr → 이음새 없음)
      if (offset >= inner.scrollWidth / 2) offset = 0;
      inner.style.transform = `translateX(-${offset}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [images, speed]);

  if (images.length === 0) return null;

  const doubled = [...images, ...images]; // 무한 루프 위해 2배 복제

  return (
    <div ref={containerRef} className="overflow-hidden bg-bg-gray-50" style={{ height }}>
      <div data-marquee className="flex w-max transition-none">
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="block shrink-0 w-auto max-w-none object-cover mr-[3px] select-none"
            style={{ height }}
            draggable={false}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
