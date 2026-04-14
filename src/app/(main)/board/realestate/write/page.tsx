/** 부동산 글쓰기 — 상담/비밀글은 로그인 유저, 매물 등록은 관리자 전용 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/posts";

const CATEGORIES = [
  { value: "[상담] ", label: "💬 상담문의" },
  { value: "[비밀] ", label: "🔒 비밀글" },
];

export default function RealEstateWritePage() {
  const router = useRouter();
  const [category, setCategory] = useState("[상담] ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    formData.set("title", category + title);
    formData.set("board", "realestate");

    const result = await createPost(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
    else router.push("/board/realestate?tab=consult");
  }

  return (
    <>
      {/* 안내 */}
      <div className="px-15px mt-12px">
        <div className="rounded-10px bg-blue-50 p-12px">
          <p className="font-13rg text-blue-700">💡 매물 등록은 관리자만 가능합니다. 상담문의/비밀글을 작성할 수 있습니다.</p>
        </div>
      </div>

      {/* 카테고리 선택 */}
      <div className="px-15px mt-12px">
        <span className="font-13rg text-font-gray">글 유형</span>
        <div className="flex gap-8px mt-8px">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`shrink-0 rounded-14px px-12px h-button font-13rg ${
                category === c.value ? "bg-font-black text-bg-white" : "border border-line-gray-50 text-font-black"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="px-15px mt-8px"><p className="font-13rg text-warn-red">{error}</p></div>}

      <form onSubmit={handleSubmit} className="mt-12px">
        <div className="px-15px">
          <input name="title" placeholder="제목을 입력하세요" required
            className="w-full h-button border-b border-line-gray-20 bg-transparent font-15sb text-font-black placeholder:text-font-disabled outline-none" />
        </div>
        <div className="px-15px mt-8px">
          <textarea name="content"
            placeholder={category.includes("비밀") ? "비밀글은 작성자와 관리자만 볼 수 있습니다. 최소 10자." : "상담 내용을 상세히 적어주세요. 최소 10자."}
            required minLength={10} rows={12}
            className="w-full bg-transparent font-14rg text-font-black placeholder:text-font-disabled outline-none resize-y leading-relaxed" />
        </div>
        <div className="flex gap-8px px-15px mt-20px pb-20px">
          <button type="button" onClick={() => router.push("/board/realestate")}
            className="flex-1 h-button rounded-14px border border-line-gray-50 font-14sb text-font-gray active-bg">취소</button>
          <button type="submit" disabled={loading}
            className="flex-1 h-button rounded-14px bg-primary font-14sb text-white active-bg disabled:opacity-50">
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </>
  );
}
