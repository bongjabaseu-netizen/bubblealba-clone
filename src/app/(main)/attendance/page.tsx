/** 출석체크 페이지 */
export const dynamic = "force-dynamic";

import { getMonthlyAttendance } from "@/lib/actions/attendance";
import { auth } from "@/auth";
import { AttendanceClient } from "./AttendanceClient";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();

  // KST 기준 현재 날짜
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const year = params.year ? parseInt(params.year) : now.getUTCFullYear();
  const month = params.month ? parseInt(params.month) : now.getUTCMonth() + 1;

  const data = await getMonthlyAttendance(year, month);

  return (
    <AttendanceClient
      year={year}
      month={month}
      days={data.days}
      streak={data.streak}
      totalPoints={data.totalPoints}
      todayChecked={data.todayChecked}
      isLoggedIn={!!session?.user}
    />
  );
}
