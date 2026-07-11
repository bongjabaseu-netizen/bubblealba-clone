/** 변호사 상담 답변 콘솔 클라이언트 — 상담 본문 열람 + 답변 등록/수정 (사용자 지시 2026-07-11)
 * from: admin 다크 네이비 테마. answerConsult(posts.ts) 호출 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Scale, Save, Lock, CheckCircle2, Clock } from "lucide-react";
import { answerConsult } from "@/lib/actions/posts";

type Consult = {
  id: string;
  title: string;
  content: string;
  answer: string | null;
  answeredAt: Date | null;
  createdAt: Date;
  author: { nickname: string | null };
};

export function LegalConsultAdmin({ consults }: { consults: Consult[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const pending = consults.filter((c) => !c.answer).length;

  const save = (id: string, current: string | null) => {
    const text = (drafts[id] ?? current ?? "").trim();
    if (text.length < 2) {
      setError("답변 내용을 입력해주세요");
      return;
    }
    setError("");
    setSavingId(id);
    startTransition(async () => {
      const r = await answerConsult(id, text);
      setSavingId(null);
      if (r?.error) setError(r.error);
      else router.refresh();
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* 헤더 */}
      <div>
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-brand" />
          <h1 className="text-lg font-bold text-slate-100">법률상담 답변</h1>
          <span className="ml-1 text-xs text-mute">
            미답변 <b className="text-amber-400">{pending}</b> / 전체 {consults.length}
          </span>
        </div>
        <p className="mt-1 text-xs text-mute">
          비밀 상담글의 본문을 열람하고 답변을 등록합니다. 본문·답변은 작성자 본인에게만 비밀로 표시됩니다.
        </p>
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      {consults.length === 0 && (
        <p className="py-16 text-center text-sm text-mute">등록된 상담글이 없습니다.</p>
      )}

      <div className="space-y-3">
        {consults.map((c) => {
          const answered = !!c.answer;
          return (
            <div key={c.id} className="overflow-hidden rounded-xl border border-line bg-navy-900/60">
              {/* 헤더줄 */}
              <div className="flex items-center gap-2 border-b border-line/70 px-4 py-3">
                <Lock className="w-3.5 h-3.5 text-mute" />
                <h3 className="flex-1 truncate text-sm font-semibold text-slate-100">{c.title}</h3>
                {answered ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    답변완료
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    답변대기
                  </span>
                )}
              </div>

              {/* 본문 */}
              <div className="px-4 py-3">
                <div className="mb-1 text-xs text-mute">
                  {c.author?.nickname ?? "익명"} · {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{c.content}</p>
              </div>

              {/* 답변 폼 */}
              <div className="px-4 pb-4">
                <label className="text-xs text-mute">변호사 답변</label>
                <textarea
                  defaultValue={c.answer ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                  rows={3}
                  placeholder="답변을 입력하세요 (작성자에게만 비밀로 표시됩니다)"
                  className="mt-1 w-full resize-y rounded-lg border border-line bg-navy-950 px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => save(c.id, c.answer)}
                    disabled={isPending && savingId === c.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white active:brightness-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isPending && savingId === c.id ? "저장 중..." : answered ? "답변 수정" : "답변 등록"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
