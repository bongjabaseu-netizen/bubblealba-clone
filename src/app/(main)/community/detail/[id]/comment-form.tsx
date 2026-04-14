"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addComment } from "@/lib/actions/posts";

export function CommentForm({ postId }: { postId: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (!content.trim()) return;
    setLoading(true);
    await addComment(postId, content);
    setContent("");
    setLoading(false);
  }

  if (status === "unauthenticated") {
    return (
      <button
        onClick={() => router.push("/login")}
        className="w-full border border-line-gray-20 rounded-14px p-12px font-14rg text-font-disabled text-center active-bg"
      >
        로그인 후 댓글을 작성할 수 있습니다
      </button>
    );
  }

  if (status === "loading") {
    return (
      <div className="border border-line-gray-20 rounded-14px p-12px font-14rg text-font-disabled text-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="border border-line-gray-20 rounded-14px p-12px mb-12px">
      <textarea
        placeholder="따뜻한 댓글을 남겨주세요"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full resize-none font-14rg text-font-black bg-transparent focus:outline-none placeholder:text-font-disabled"
      />
      <div className="flex justify-end mt-8px">
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="h-32px px-14px rounded-8px bg-warn-red text-bg-white font-13sb disabled:opacity-50"
        >
          {loading ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </div>
  );
}
