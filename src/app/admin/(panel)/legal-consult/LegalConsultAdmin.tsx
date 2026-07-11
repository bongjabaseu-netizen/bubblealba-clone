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
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("all");

  const total = consults.length;
  const pending = consults.filter((c) => !c.answer).length;
  const answered = total - pending;
  // 오늘 접수된 신규 상담 수
  const todayNew = consults.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;
  const shown = consults.filter((c) =>
    filter === "all" ? true : filter === "pending" ? !c.answer : !!c.answer
  );

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
          <h1 className="text-lg font-bold text-slate-100">법률상담 답변 관리</h1>
          {todayNew > 0 && (
            <span className="ml-1 inline-flex items-center rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand">
              오늘 신규 {todayNew}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-mute">
          들어온 상담에 답변을 답니다. 아래 카드로 답변 대기·완료 현황을 확인하고, 카드를 눌러 목록을 걸러 볼 수 있어요.
        </p>
      </div>

      {/* 통계 카드 — 클릭 시 목록 필터 */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { key: "pending", label: "답변 대기", value: pending, color: "text-amber-400" },
          { key: "answered", label: "답변 완료", value: answered, color: "text-emerald-400" },
          { key: "all", label: "전체 상담", value: total, color: "text-slate-100" },
        ] as const).map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setFilter(s.key)}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              filter === s.key
                ? "border-brand/60 bg-brand/10"
                : "border-line bg-navy-900/60 hover:bg-navy-800/60"
            }`}
          >
            <div className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
            <div className="mt-0.5 text-xs text-mute">{s.label}</div>
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      {/* 필터 상태 안내 */}
      <div className="flex items-center gap-2 text-xs text-mute">
        <span>
          {filter === "pending" ? "답변 대기" : filter === "answered" ? "답변 완료" : "전체"} {shown.length}건
        </span>
        {filter !== "all" && (
          <button type="button" onClick={() => setFilter("all")} className="text-brand hover:underline">
            전체 보기
          </button>
        )}
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-sm text-mute">
          {total === 0 ? "등록된 상담글이 없습니다." : "해당 조건의 상담이 없습니다."}
        </p>
      )}

      <div className="space-y-3">
        {shown.map((c) => {
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
