"use client";

/**
 * 관리자 ⌘K 통합검색 — 회원·공고·광고주 실시간 검색 오버레이
 * cmdk 등 외부 의존성 없이 자체 구현 (Ctrl/⌘+K 열기, Esc 닫기, 300ms 디바운스)
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Briefcase, ShieldCheck, Loader2 } from "lucide-react";
import { adminSearchAll } from "@/lib/actions/admin";

type Results = Awaited<ReturnType<typeof adminSearchAll>>;

const EMPTY: Results = { users: [], jobs: [], advertisers: [] };

export function AdminSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 요청 시퀀스 — 응답 역전 방지 (느린 이전 검색 응답이 최신 결과를 덮어쓰는 것 차단)
  const seqRef = useRef(0);
  const router = useRouter();

  // Ctrl/⌘+K 로 열기 (전역 단축키)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // 열릴 때 입력 포커스 + 상태 초기화 (시퀀스 증가로 in-flight 응답 무효화)
  useEffect(() => {
    if (open) {
      seqRef.current++;
      setQuery("");
      setResults(EMPTY);
      setLoading(false);
      // 오버레이 렌더 후 포커스
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // 언마운트 시 대기중인 디바운스 타이머 정리 (불필요한 서버 요청 방지)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 300ms 디바운스 검색 — 최신 시퀀스 응답만 반영
  const handleChange = useCallback((value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    const seq = ++seqRef.current;
    if (!value.trim()) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const r = await adminSearchAll(value);
        if (seq === seqRef.current) setResults(r);
      } finally {
        if (seq === seqRef.current) setLoading(false);
      }
    }, 300);
  }, []);

  // 결과 클릭 → 해당 관리 페이지로 이동 후 닫기
  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const hasResults =
    results.users.length > 0 || results.jobs.length > 0 || results.advertisers.length > 0;

  return (
    <>
      {/* 트리거 버튼 (기존 장식 검색바와 동일 스타일) */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-navy-850 border border-line text-mute text-[12.5px] w-[260px] hover:border-brand/60 transition-colors"
      >
        <Search className="w-4 h-4" />
        공고 · 회원 · 광고주 검색
        <span className="ml-auto text-[10.5px] border border-line rounded px-1.5 py-0.5">⌘K</span>
      </button>

      {/* 검색 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[560px] max-w-[90vw] rounded-2xl bg-navy-900 border border-line shadow-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 검색 입력 */}
            <div className="flex items-center gap-3 px-4 h-[52px] border-b border-line">
              {loading ? (
                <Loader2 className="w-4 h-4 text-brand animate-spin shrink-0" />
              ) : (
                <Search className="w-4 h-4 text-mute shrink-0" />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="공고 제목·업체명, 회원 이메일·닉네임, 광고주 상호·사업자번호"
                className="flex-1 bg-transparent text-[13.5px] text-slate-200 placeholder:text-mute focus:outline-none"
              />
              <span className="text-[10.5px] text-mute border border-line rounded px-1.5 py-0.5">
                ESC
              </span>
            </div>

            {/* 결과 */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {!query.trim() && (
                <div className="px-4 py-6 text-center text-[12.5px] text-mute">
                  검색어를 입력하세요
                </div>
              )}
              {query.trim() && !loading && !hasResults && (
                <div className="px-4 py-6 text-center text-[12.5px] text-mute">
                  &lsquo;{query}&rsquo; 검색 결과가 없습니다
                </div>
              )}

              {results.users.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2 py-1.5 text-[10.5px] font-bold tracking-[.18em] text-mute/80">
                    회원
                  </div>
                  {results.users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => go("/admin/users")}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-navy-800/60 transition-colors"
                    >
                      <Users className="w-4 h-4 text-mute shrink-0" />
                      <span className="text-[13px] text-white font-semibold">
                        {u.nickname ?? "-"}
                      </span>
                      <span className="text-[11.5px] text-mute truncate">{u.email}</span>
                      <span className="ml-auto text-[10.5px] text-mute">{u.role}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.jobs.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2 py-1.5 text-[10.5px] font-bold tracking-[.18em] text-mute/80">
                    공고
                  </div>
                  {results.jobs.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => go("/admin/jobs")}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-navy-800/60 transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-mute shrink-0" />
                      <span className="text-[13px] text-white font-semibold truncate">
                        {j.title}
                      </span>
                      <span className="text-[11.5px] text-mute truncate">{j.company}</span>
                      <span className="ml-auto text-[10.5px] text-mute">{j.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.advertisers.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2 py-1.5 text-[10.5px] font-bold tracking-[.18em] text-mute/80">
                    광고주
                  </div>
                  {results.advertisers.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => go("/admin/advertisers")}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-navy-800/60 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-mute shrink-0" />
                      <span className="text-[13px] text-white font-semibold">
                        {a.businessName}
                      </span>
                      <span className="text-[11.5px] text-mute">{a.businessNumber}</span>
                      <span
                        className={`ml-auto text-[10.5px] ${a.verified ? "text-emerald-400" : "text-brand"}`}
                      >
                        {a.verified ? "인증" : "미인증"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
