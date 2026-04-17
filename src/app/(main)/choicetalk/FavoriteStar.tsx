/** 초이스톡 즐겨찾기 별표 버튼 */
"use client";

import { useState, useTransition } from "react";
import { toggleChoiceTalkFavorite } from "@/lib/actions/choicetalk";
import { useRouter } from "next/navigation";

export function FavoriteStar({ roomId, isFavorited }: { roomId: string; isFavorited: boolean }) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleChoiceTalkFavorite(roomId);
      if (result.success) {
        setFavorited(result.favorited ?? false);
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="shrink-0 p-1 transition-transform active:scale-90 disabled:opacity-50"
      aria-label={favorited ? "즐겨찾기 해제" : "즐겨찾기"}
    >
      {favorited ? (
        <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </button>
  );
}
