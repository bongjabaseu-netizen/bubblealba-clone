import { getAdminJobs } from "@/lib/actions/admin";
import { AdminJobTable } from "./JobTable";

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900">광고 관리</h1>
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
          {jobs.length}개
        </span>
      </div>
      <AdminJobTable jobs={jobs} />
    </div>
  );
}
