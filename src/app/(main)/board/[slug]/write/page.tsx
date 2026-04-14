/** 게시판 글쓰기 */
"use client";

import { useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { createPost } from "@/lib/actions/posts";

export default function BoardWritePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("board", slug);

    const result = await createPost(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(`/board/${slug}`);
    }
  }

  return (
    <>
      <div className="px-15px mt-12px">
        <span className="font-13rg text-font-gray">글쓰기</span>
      </div>

      {error && (
        <div className="px-15px mt-8px">
          <p className="font-13rg text-warn-red">{error}</p>
        </div>
      )}

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

        <div className="flex gap-8px px-15px mt-20px pb-20px">
          <button
            type="button"
            onClick={() => router.push(`/board/${slug}`)}
            className="flex-1 h-button rounded-14px border border-line-gray-50 font-14sb text-font-gray active-bg"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-button rounded-14px bg-primary font-14sb text-white active-bg disabled:opacity-50"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </>
  );
}
