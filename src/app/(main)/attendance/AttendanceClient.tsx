/** 출석체크 클라이언트 — 한국식 스탬프 달력 UI */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

/** 해당 월의 일수 */
function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

/** 해당 월 1일의 요일 (0=일, 6=토) */
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

  // 오늘 날짜 (KST)
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
    <div className="px-4 pb-8">
      {/* 상단 출석 정보 카드 */}
      <div className="relative mt-3 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 p-5 text-white shadow-lg overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-2 h-16 w-16 rounded-full bg-white/5" />

        <div className="relative">
          <h2 className="text-lg font-bold">출석체크</h2>
          <p className="mt-1 text-sm text-white/80">매일 출석하고 포인트 받으세요!</p>

          <div className="mt-4 flex items-center gap-6">
            <div>
              <div className="text-xs text-white/70">연속 출석</div>
              <div className="text-2xl font-black">{currentStreak}일</div>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <div className="text-xs text-white/70">이번 달 적립</div>
              <div className="text-2xl font-black">{totalPoints}P</div>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <div className="text-xs text-white/70">출석일</div>
              <div className="text-2xl font-black">{days.length}일</div>
            </div>
          </div>
        </div>
      </div>

      {/* 포인트 안내 */}
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
          <span>🎁</span> 출석 포인트 안내
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-amber-700">
          <div className="rounded-lg bg-white px-2 py-1.5 text-center shadow-sm">
            <div className="font-bold text-amber-600">기본</div>
            <div className="mt-0.5 font-black text-lg text-amber-800">10P</div>
          </div>
          <div className="rounded-lg bg-white px-2 py-1.5 text-center shadow-sm">
            <div className="font-bold text-blue-600">3일 연속</div>
            <div className="mt-0.5 font-black text-lg text-blue-800">20P</div>
          </div>
          <div className="rounded-lg bg-white px-2 py-1.5 text-center shadow-sm">
            <div className="font-bold text-purple-600">7일 연속</div>
            <div className="mt-0.5 font-black text-lg text-purple-800">50P</div>
          </div>
        </div>
      </div>

      {/* 출석체크 버튼 */}
      {isCurrentMonth && (
        <div className="mt-4">
          {checked ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 border-2 border-green-200 py-4 text-green-700">
              <span className="text-2xl">✅</span>
              <span className="font-bold">오늘 출석 완료!</span>
              {earnedPoints && <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-bold">+{earnedPoints}P</span>}
            </div>
          ) : (
            <button
              onClick={handleCheck}
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-white font-bold text-lg shadow-lg hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> 출석 중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📌</span> 출석체크 하기
                </span>
              )}
            </button>
          )}
        </div>
      )}

      {/* 스탬프 적립 애니메이션 */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce rounded-2xl bg-orange-500 px-8 py-6 text-white shadow-2xl">
            <div className="text-center text-4xl">🎉</div>
            <div className="mt-2 text-center text-xl font-black">+{earnedPoints}P 적립!</div>
            <div className="mt-1 text-center text-sm text-white/80">연속 {currentStreak}일 출석</div>
          </div>
        </div>
      )}

      {/* 달력 헤더 */}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={handlePrevMonth} className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 active:bg-slate-200 text-sm font-medium">
          ◀ 이전
        </button>
        <h3 className="text-lg font-black text-slate-900">{year}년 {month}월</h3>
        <button onClick={handleNextMonth} className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 active:bg-slate-200 text-sm font-medium">
          다음 ▶
        </button>
      </div>

      {/* 달력 그리드 */}
      <div className="mt-3 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
          {WEEKDAYS.map((d, i) => (
            <div key={d} className={`py-2 text-center text-xs font-bold ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-500"}`}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {/* 빈 칸 (1일 이전) */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square border-b border-r border-slate-50" />
          ))}

          {/* 날짜들 */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const isChecked = checkedDates.has(day);
            const isToday = isCurrentMonth && day === todayDate;
            const dayOfWeek = (startDay + i) % 7;
            const isSun = dayOfWeek === 0;
            const isSat = dayOfWeek === 6;
            const isPast = isCurrentMonth && day < todayDate;
            const dayPoints = days.find((d) => parseInt(d.date.slice(8)) === day)?.points;

            return (
              <div
                key={day}
                className={`relative aspect-square flex flex-col items-center justify-center border-b border-r border-slate-50 transition-colors
                  ${isToday ? "bg-orange-50" : ""}
                  ${isChecked ? "bg-green-50/50" : ""}
                `}
              >
                {/* 날짜 숫자 */}
                <span className={`text-xs font-medium
                  ${isToday ? "font-black text-orange-600" : ""}
                  ${isSun ? "text-red-400" : isSat ? "text-blue-400" : "text-slate-600"}
                  ${isPast && !isChecked ? "text-slate-300" : ""}
                `}>
                  {day}
                </span>

                {/* 출석 스탬프 */}
                {isChecked ? (
                  <div className="mt-0.5">
                    <span className="text-lg">🔖</span>
                    {dayPoints && dayPoints > 10 && (
                      <div className="absolute bottom-0.5 right-0.5 rounded-full bg-purple-500 px-1 text-[8px] font-bold text-white">
                        {dayPoints}P
                      </div>
                    )}
                  </div>
                ) : isToday && !checked ? (
                  <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-dashed border-orange-300 animate-pulse" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* 이번 달 출석 기록 */}
      {days.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-bold text-slate-700 mb-3">📋 출석 기록</h4>
          <div className="space-y-2">
            {days.slice().reverse().map((d) => (
              <div key={d.date} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span>🔖</span>
                  <span className="text-sm text-slate-700">{d.date.slice(5).replace("-", "월 ")}일</span>
                </div>
                <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${d.points >= 50 ? "bg-purple-100 text-purple-700" : d.points >= 20 ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                  +{d.points}P
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
