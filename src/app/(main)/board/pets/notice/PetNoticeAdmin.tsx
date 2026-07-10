/** 애견자랑 공지 관리 — 관리자 등록 폼 + 개별 삭제 버튼 (사용자 지시 2026-07-10)
 * from: 관리자 공지 패턴(admin PostsClient) 참고, (main) 라이트 테마용 인라인 폼으로 재작성 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBoardNotice, deleteBoardNotice } from "@/lib/actions/admin";

/** 관리자 공지 등록 폼 — 접었다 펼치는 인라인 폼 */
export function PetNoticeForm({ boardSlug }: { boardSlug: string }) {
  const router = useRouter();
  const [isPending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const r = await createBoardNotice(boardSlug, fd);
      if (r?.error) setError(r.error);
      else { form.reset(); setOpen(false); router.refresh(); }
    });
  }

  return (
    <div className="mx-15px mt-12px rounded-12px border border-line-gray-20 bg-bg-gray-50 p-12px">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full h-button rounded-10px bg-font-black font-13sb text-white active-bg"
        >
          + 공지 등록 (관리자)
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-8px">
          <input
            name="title"
            placeholder="공지 제목"
            className="w-full h-button px-12px rounded-10px border border-line-gray-20 bg-bg-white font-14rg text-font-black outline-none"
          />
          <textarea
            name="content"
            rows={3}
            placeholder="공지 내용을 입력하세요"
            className="w-full px-12px py-8px rounded-10px border border-line-gray-20 bg-bg-white font-14rg text-font-black outline-none resize-none"
          />
          {error && <p className="font-12rg text-red-600">{error}</p>}
          <div className="flex gap-8px">
            <button
              type="button"
              onClick={() => { setOpen(false); setError(""); }}
              className="flex-1 h-button rounded-10px border border-line-gray-20 font-13sb text-font-gray active-bg"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-button rounded-10px bg-font-black font-13sb text-white disabled:opacity-50 active-bg"
            >
              {isPending ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/** 개별 공지 삭제 버튼 (관리자) */
export function NoticeDeleteButton({ id, boardSlug }: { id: string; boardSlug: string }) {
  const router = useRouter();
  const [isPending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (confirm("이 공지를 삭제할까요?")) {
          start(async () => { await deleteBoardNotice(id, boardSlug); router.refresh(); });
        }
      }}
      disabled={isPending}
      className="font-12rg text-red-600 disabled:opacity-50"
    >
      삭제
    </button>
  );
}
