/** 애견자랑 글쓰기 — 사진 업로드 + 글 작성 */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/posts";

export default function PetsWritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  /** 파일 선택 → base64 미리보기 (실제 서비스면 S3 업로드) */
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
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
    formData.set("board", "pets");
    formData.set("images", JSON.stringify(previews));

    const result = await createPost(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/board/pets");
    }
  }

  return (
    <>
      <div className="px-15px mt-12px">
        <h2 className="font-16sb text-font-black">🐶 애견자랑 글쓰기</h2>
        <p className="font-13rg text-font-gray mt-2px">우리 아이 사진과 함께 자랑해보세요!</p>
      </div>

      {error && (
        <div className="px-15px mt-8px">
          <p className="font-13rg text-warn-red">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-12px">
        {/* 사진 업로드 영역 */}
        <div className="px-15px">
          <span className="font-13rg text-font-gray">사진 첨부</span>
          <div className="flex gap-8px mt-8px overflow-x-auto pb-4px">
            {/* 추가 버튼 */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-[80px] h-[80px] rounded-10px border-2 border-dashed border-line-gray-50 flex flex-col items-center justify-center shrink-0 active-bg"
            >
              <svg className="w-6 h-6 text-font-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="font-10rg text-font-disabled mt-2px">{previews.length}/10</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />

            {/* 미리보기 */}
            {previews.map((src, i) => (
              <div key={i} className="relative w-[80px] h-[80px] rounded-10px overflow-hidden shrink-0">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2px right-2px w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-line-gray-20 mt-12px" />

        {/* 제목 */}
        <div className="px-15px mt-12px">
          <input
            name="title"
            placeholder="제목 (예: 우리 강아지 첫 산책!)"
            required
            className="w-full h-button border-b border-line-gray-20 bg-transparent font-15sb text-font-black placeholder:text-font-disabled outline-none"
          />
        </div>

        {/* 내용 */}
        <div className="px-15px mt-8px">
          <textarea
            name="content"
            placeholder="우리 아이 이야기를 들려주세요 🐾 (최소 10자)"
            required
            minLength={10}
            rows={8}
            className="w-full bg-transparent font-14rg text-font-black placeholder:text-font-disabled outline-none resize-y leading-relaxed"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-8px px-15px mt-20px pb-20px">
          <button
            type="button"
            onClick={() => router.push("/board/pets")}
            className="flex-1 h-button rounded-14px border border-line-gray-50 font-14sb text-font-gray active-bg"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-button rounded-14px bg-primary font-14sb text-white active-bg disabled:opacity-50"
          >
            {loading ? "등록 중..." : "🐶 자랑하기"}
          </button>
        </div>
      </form>
    </>
  );
}
