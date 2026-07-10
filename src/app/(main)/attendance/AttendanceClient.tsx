/** 출석체크 클라이언트 — "딥 에메랄드 리워드" 디자인 (주홍 제거, 프리미엄 멤버십 카드 톤)
 * from: 사용자 지시(2026-07-10) "주홍색 말고 퀄리티 좋게". 데이터/로직 불변, 비주얼만 재구성. */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flame, Sparkles, Gift, CalendarCheck, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { checkAttendance } from "@/lib/actions/attendance";

interface Props {
  year: number;
  month: number;
  days: { date: string; points: number }[];
  streak: number;
  totalPoints: number;
  todayChecked: boolean;
  isLoggedIn: boolean;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 포인트 티어 (기본 slate / 3일 emerald / 7일 violet) */
const TIERS = [
  { label: "기본", pts: 10, ring: "ring-slate-200", dot: "bg-slate-400", num: "text-slate-800", sub: "text-slate-500" },
  { label: "3일 연속", pts: 20, ring: "ring-emerald-200", dot: "bg-emerald-500", num: "text-emerald-700", sub: "text-emerald-600" },
  { label: "7일 연속", pts: 50, ring: "ring-violet-200", dot: "bg-violet-500", num: "text-violet-700", sub: "text-violet-600" },
];

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}
function firstDayOfWeek(y: number, m: number) {
  return new Date(y, m - 1, 1).getDay();
}

export function AttendanceClient({ year, month, days, streak, totalPoints, todayChecked, isLoggedIn }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(todayChecked);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState(streak);
  const [showAnimation, setShowAnimation] = useState(false);

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfWeek(year, month);
  const checkedDates = new Set(days.map((d) => parseInt(d.date.slice(8))));

  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const todayDate = now.getUTCDate();
  const isCurrentMonth = now.getUTCFullYear() === year && now.getUTCMonth() + 1 === month;

  function handleCheck() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    startTransition(async () => {
      const result = await checkAttendance();
      if (result.success) {
        setChecked(true);
        setEarnedPoints(result.points ?? 10);
        setCurrentStreak(result.streak ?? 1);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
        router.refresh();
      }
    });
  }

  function handlePrevMonth() {
    const prev = month === 1 ? `?year=${year - 1}&month=12` : `?year=${year}&month=${month - 1}`;
    router.push(`/attendance${prev}`);
  }
  function handleNextMonth() {
    const next = month === 12 ? `?year=${year + 1}&month=1` : `?year=${year}&month=${month + 1}`;
    router.push(`/attendance${next}`);
  }

  return (
    <div className="px-4 pt-3 pb-24">
      {/* ===== 히어로 — 딥 에메랄드 리워드 카드 ===== */}
      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 text-white shadow-xl ring-1 ring-white/10">
        {/* 배경 글로우 + 상단 sheen */}
        <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
            <Sparkles className="h-3.5 w-3.5" /> 출석 리워드
          </div>

          <div className="mt-3 flex items-end gap-2">
            <Flame className="mb-1 h-7 w-7 text-emerald-400" strokeWidth={2.2} />
            <span className="text-[54px] font-black leading-none tabular-nums">{currentStreak}</span>
            <span className="mb-1.5 text-xl font-bold text-white/70">일</span>
            <span className="mb-2 ml-1 text-sm font-medium text-white/55">연속 출석 중</span>
          </div>

          <div className="mt-5 flex divide-x divide-white/10 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
            <div className="flex-1 px-4 py-3">
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/45">이번 달 적립</div>
              <div className="mt-1 flex items-baseline gap-0.5 text-2xl font-black tabular-nums text-emerald-300">
                {totalPoints}<span className="text-sm font-bold text-emerald-300/70">P</span>
              </div>
            </div>
            <div className="flex-1 px-4 py-3">
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/45">출석일</div>
              <div className="mt-1 flex items-baseline gap-0.5 text-2xl font-black tabular-nums text-white">
                {days.length}<span className="text-sm font-bold text-white/60">일</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 포인트 안내 (티어 카드) ===== */}
      <section className="mt-4">
        <div className="mb-2 flex items-center gap-1.5 px-1 text-[13px] font-bold text-slate-700">
          <Gift className="h-4 w-4 text-emerald-500" /> 출석 포인트 안내
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((t) => (
            <div key={t.label} className={`rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ${t.ring}`}>
              <div className="flex items-center justify-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                <span className={`text-[11px] font-bold ${t.sub}`}>{t.label}</span>
              </div>
              <div className={`mt-1 text-xl font-black tabular-nums ${t.num}`}>
                {t.pts}<span className="text-xs font-bold">P</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 출석체크 버튼 ===== */}
      {isCurrentMonth && (
        <div className="mt-4">
          {checked ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-4 text-emerald-700 ring-1 ring-emerald-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="font-bold">오늘 출석 완료</span>
              {earnedPoints && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white tabular-nums">+{earnedPoints}P</span>}
            </div>
          ) : (
            <button
              onClick={handleCheck}
              disabled={isPending}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                {isPending ? (
                  <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> 출석 중…</>
                ) : (
                  <><CalendarCheck className="h-5 w-5" strokeWidth={2.4} /> 출석체크 하기</>
                )}
              </span>
            </button>
          )}
        </div>
      )}

      {/* 적립 토스트 */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none">
          <div className="rounded-3xl bg-slate-900/95 px-8 py-6 text-center text-white shadow-2xl ring-1 ring-emerald-400/40 backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40">
              <Check className="h-8 w-8" strokeWidth={3} />
            </div>
            <div className="mt-3 text-2xl font-black tabular-nums text-emerald-300">+{earnedPoints}P</div>
            <div className="mt-0.5 text-sm text-white/70">{currentStreak}일 연속 출석 · 적립 완료</div>
          </div>
        </div>
      )}

      {/* ===== 달력 ===== */}
      <div className="mt-6 flex items-center justify-between px-1">
        <button onClick={handlePrevMonth} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:bg-slate-200" aria-label="이전 달">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-base font-black tabular-nums text-slate-900">{year}년 {month}월</h3>
        <button onClick={handleNextMonth} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:bg-slate-200" aria-label="다음 달">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((d, i) => (
            <div key={d} className={`py-2 text-center text-[11px] font-bold ${i === 0 ? "text-rose-400" : i === 6 ? "text-sky-400" : "text-slate-400"}`}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const isChecked = checkedDates.has(day);
            const isToday = isCurrentMonth && day === todayDate;
            const dayOfWeek = (startDay + i) % 7;
            const isSun = dayOfWeek === 0;
            const isSat = dayOfWeek === 6;
            const isPast = isCurrentMonth && day < todayDate;
            const dayPoints = days.find((d) => parseInt(d.date.slice(8)) === day)?.points;

            const base = "relative flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums transition";
            const tone = isChecked
              ? "bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-500/30"
              : isToday
              ? "text-emerald-600 font-black ring-2 ring-emerald-400"
              : isPast
              ? "text-slate-300"
              : isSun
              ? "text-rose-400"
              : isSat
              ? "text-sky-400"
              : "text-slate-600";

            return (
              <div key={day} className="flex justify-center py-0.5">
                <div className={`${base} ${tone}`}>
                  {day}
                  {isChecked && dayPoints && dayPoints > 10 && (
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-violet-500 px-1 text-[8px] font-bold text-white ring-2 ring-white tabular-nums">
                      {dayPoints}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== 이번 달 출석 기록 ===== */}
      {days.length > 0 && (
        <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
            <CalendarCheck className="h-4 w-4 text-emerald-500" /> 출석 기록
          </div>
          <div className="space-y-1.5">
            {days.slice().reverse().map((d) => (
              <div key={d.date} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {d.date.slice(5).replace("-", "월 ")}일
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${d.points >= 50 ? "bg-violet-100 text-violet-700" : d.points >= 20 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                  +{d.points}P
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
