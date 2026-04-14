import Link from "next/link";
import { getApplications } from "@/lib/actions/users";

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING: { label: "대기중", color: "bg-yellow-50 text-yellow-700" },
  VIEWED: { label: "열람됨", color: "bg-blue-50 text-blue-700" },
  ACCEPTED: { label: "수락됨", color: "bg-green-50 text-green-700" },
  REJECTED: { label: "거절됨", color: "bg-bg-gray-50 text-font-disabled" },
};

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

export default async function ApplyPage() {
  const applications = await getApplications();

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">신청 내역</h1>
        <p className="font-13rg text-font-gray">신청한 공고 현황</p>
      </div>

      {applications.length === 0 && (
        <p className="font-13rg text-font-disabled">신청 내역이 없습니다.</p>
      )}

      <div className="space-y-10px">
        {applications.map((app) => {
          const job = app.job;
          const images: string[] = safeJsonParse(job.images as unknown, []);
          const status = STATUS_META[(app as Record<string, unknown>).status as string] ?? STATUS_META.PENDING;
          return (
            <Link key={app.id} href={`/job/detail/${job.id}`} className="flex items-center gap-12px active-bg rounded-14px border border-line-gray-20 p-12px">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-8px mb-4px">
                  <h3 className="font-15sb text-font-black line-clamp-1 flex-1">{job.title}</h3>
                  <span className={`font-11rg px-6px py-2px rounded-4px shrink-0 ${status.color}`}>{status.label}</span>
                </div>
                <div className="flex items-center gap-4px font-12rg text-font-gray mb-4px">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {job.region} {job.city}
                </div>
                <div className="font-14sb text-primary mb-2px">{job.wage}</div>
                <div className="font-12rg text-font-disabled">신청: {relativeTime(new Date(app.createdAt))}</div>
              </div>
              <svg className="w-4 h-4 text-font-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
