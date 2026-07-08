import { getAdminJobs } from "@/lib/actions/admin";
import { AdminJobTable } from "./JobTable";

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs();
  // 제목은 공통 헤더가 pathname 기반으로 표시하므로 페이지 h1 블록 제거
  return (
    <div className="p-6">
      <AdminJobTable jobs={jobs} />
    </div>
  );
}
