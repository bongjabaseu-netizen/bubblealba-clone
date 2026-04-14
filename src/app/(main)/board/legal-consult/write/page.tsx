/** 법률상담 글쓰기 — 사진 첨부 가능 */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/posts";

export default function LegalWritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("board", "legal-consult");
    formData.set("images", JSON.stringify(previews));
    const result = await createPost(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
    else router.push("/board/legal-consult");
  }

  return (
    <>
      <div className="px-15px mt-12px">
        <h2 className="font-16sb text-font-black">⚖️ 법률상담 글쓰기</h2>
        <p className="font-13rg text-font-gray mt-2px">관련 서류 사진을 첨부하면 더 정확한 답변을 받을 수 있어요</p>
      </div>

      {error && <div className="px-15px mt-8px"><p className="font-13rg text-warn-red">{error}</p></div>}

      <form onSubmit={handleSubmit} className="mt-12px">
        {/* 사진 첨부 */}
        <div className="px-15px">
          <span className="font-13rg text-font-gray">사진 첨부 (선택)</span>
          <div className="flex gap-8px mt-8px overflow-x-auto pb-4px">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-[80px] h-[80px] rounded-10px border-2 border-dashed border-line-gray-50 flex flex-col items-center justify-center shrink-0 active-bg">
              <svg className="w-6 h-6 text-font-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 5v14M5 12h14" /></svg>
              <span className="font-10rg text-font-disabled mt-2px">{previews.length}/5</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            {previews.map((src, i) => (
              <div key={i} className="relative w-[80px] h-[80px] rounded-10px overflow-hidden shrink-0">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-2px right-2px w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-line-gray-20 mt-12px" />

        <div className="px-15px mt-12px">
          <input name="title" placeholder="상담 제목 (예: 임대차 계약 관련 문의)" required
            className="w-full h-button border-b border-line-gray-20 bg-transparent font-15sb text-font-black placeholder:text-font-disabled outline-none" />
        </div>
        <div className="px-15px mt-8px">
          <textarea name="content" placeholder="상담 내용을 자세히 작성해주세요 (최소 10자)" required minLength={10} rows={10}
            className="w-full bg-transparent font-14rg text-font-black placeholder:text-font-disabled outline-none resize-y leading-relaxed" />
        </div>

        <div className="flex gap-8px px-15px mt-20px pb-20px">
          <button type="button" onClick={() => router.push("/board/legal-consult")}
            className="flex-1 h-button rounded-14px border border-line-gray-50 font-14sb text-font-gray active-bg">취소</button>
          <button type="submit" disabled={loading}
            className="flex-1 h-button rounded-14px bg-primary font-14sb text-white active-bg disabled:opacity-50">
            {loading ? "등록 중..." : "상담 등록"}
          </button>
        </div>
      </form>
    </>
  );
}
