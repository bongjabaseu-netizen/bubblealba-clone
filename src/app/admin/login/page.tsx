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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-4">
            <span className="text-3xl font-black text-white">B</span>
          </div>
          <h1 className="text-xl font-bold text-white">버블알바 관리자</h1>
          <p className="text-sm text-slate-400 mt-1">관리자 계정으로 로그인하세요</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 space-y-4 border border-slate-700">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
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
              className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">비밀번호</label>
            <input
              name="password"
              type="password"
              required
              placeholder="비밀번호"
              className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-3 text-white font-bold hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "관리자 로그인"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          관리자 권한이 없는 계정은 로그인할 수 없습니다
        </p>
      </div>
    </div>
  );
}
