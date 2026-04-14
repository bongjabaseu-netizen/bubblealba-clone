/** 초이스톡 입력 — 광고주(본인 톡방)만 작성 가능 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { sendChoiceTalkMessage } from "@/lib/actions/choicetalk";

export function ChoiceTalkInput({ roomId, ownerId }: { roomId: string; ownerId: string }) {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isOwner = session?.user?.id === ownerId;

  async function handleSend() {
    if (!text.trim() || isPending) return;
    startTransition(async () => {
      const result = await sendChoiceTalkMessage(roomId, text);
      if (result.success) {
        setText("");
        router.refresh();
      }
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-mobile border-t border-line-gray-20 bg-bg-white px-15px py-8px">
      <div className="flex items-center gap-8px">
        <input
          type="text"
          value={isOwner ? text : ""}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && handleSend()}
          placeholder={isOwner ? "메시지 입력 (최대 200자)" : "입력할 수 없어요. (기업회원 전용)"}
          disabled={!isOwner || isPending}
          maxLength={200}
          className="flex-1 h-button rounded-10px bg-bg-gray-50 px-12px font-14rg text-font-black placeholder:text-font-disabled outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!isOwner || !text.trim() || isPending}
          className="w-button h-button rounded-10px bg-primary flex items-center justify-center disabled:opacity-30"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
