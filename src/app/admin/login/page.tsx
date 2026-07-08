/** 관리자 전용 로그인 페이지 — 로그인 후 /admin으로 이동 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithCredentials } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginWithCredentials(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-scene min-h-screen flex items-center justify-center p-4">
      {/* 사이드바 없는 독립 로그인 카드 */}
      <div className="w-full max-w-[400px] rounded-2xl bg-navy-850/90 border border-line shadow-card p-8">
        {/* 로고 — sample-01 사이드바의 크라운 로고 블록(그라데이션 gold→brand)을 중앙 배치 */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-brand flex items-center justify-center shadow-glow mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-950" fill="currentColor">
                <path d="M2.6 18 4.3 7.6l4.5 4.4L12 5l3.2 7 4.5-4.4L21.4 18Z" />
                <rect x="3.6" y="19.2" width="16.8" height="2" rx="1" />
              </svg>
            </div>
            <div className="text-[20px] font-bold tracking-tight text-white leading-none">명품알바</div>
            <div className="text-[10px] tracking-[.22em] text-gold mt-1.5">PREMIUM ALBA</div>
          </div>
          <p className="text-sm text-mute mt-4">관리자 계정으로 로그인하세요</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">아이디</label>
            <input
              name="email"
              type="text"
              required
              placeholder="관리자 아이디"
              className="w-full rounded-lg bg-navy-850 border border-line px-4 py-3 text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">비밀번호</label>
            <input
              name="password"
              type="password"
              required
              placeholder="비밀번호"
              className="w-full rounded-lg bg-navy-850 border border-line px-4 py-3 text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand py-3 text-navy-950 font-bold shadow-glow hover:bg-brand-soft active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "관리자 로그인"}
          </button>
        </form>

        <p className="text-center text-xs text-mute mt-6">
          관리자 권한이 없는 계정은 로그인할 수 없습니다
        </p>
      </div>
    </div>
  );
}
