"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/posts";

const BOARDS = [
  { slug: "free", name: "자유" },
  { slug: "company", name: "업체" },
  { slug: "question", name: "질문" },
];

export default function WritePage() {
  const router = useRouter();
  const [selectedBoard, setSelectedBoard] = useState("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("board", selectedBoard);

    const result = await createPost(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/community");
    }
  }

  return (
    <>
      {/* 카테고리 선택 */}
      <div className="px-15px mt-12px">
        <span className="font-13rg text-font-gray">카테고리</span>
        <div className="flex gap-8px mt-8px">
          {BOARDS.map((b) => (
            <button
              key={b.slug}
              type="button"
              onClick={() => setSelectedBoard(b.slug)}
              className={`shrink-0 rounded-14px px-12px h-button font-13rg ${
                selectedBoard === b.slug
                  ? "bg-font-black text-bg-white"
                  : "border border-line-gray-50 text-font-black"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="px-15px mt-8px">
          <p className="font-13rg text-warn-red">{error}</p>
        </div>
      )}

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="mt-12px">
        <div className="px-15px">
          <input
            name="title"
            placeholder="제목을 입력하세요"
            required
            className="w-full h-button border-b border-line-gray-20 bg-transparent font-15sb text-font-black placeholder:text-font-disabled outline-none"
          />
        </div>

        <div className="px-15px mt-8px">
          <textarea
            name="content"
            placeholder="내용을 입력하세요. 최소 10자 이상."
            required
            minLength={10}
            rows={12}
            className="w-full bg-transparent font-14rg text-font-black placeholder:text-font-disabled outline-none resize-y leading-relaxed"
          />
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-8px px-15px mt-20px pb-20px">
          <button
            type="button"
            onClick={() => router.push("/community")}
            className="flex-1 h-button rounded-14px border border-line-gray-50 font-14sb text-font-gray active-bg"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-button rounded-14px bg-warn-red font-14sb text-bg-white active-bg disabled:opacity-50"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </>
  );
}
