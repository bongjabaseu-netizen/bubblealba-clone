import { getAdminJobsWithOrder } from "@/lib/actions/admin";
import { AdOrderManager } from "./AdOrderManager";

export default async function AdminAdOrderPage() {
  const jobs = await getAdminJobsWithOrder();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">광고 순서 관리</h1>
        <p className="text-sm text-slate-500 mt-1">
          공고 노출 순서를 조정합니다. 순서가 낮을수록 상단에 표시됩니다.
        </p>
      </div>
      <AdOrderManager jobs={jobs} />
    </div>
  );
}
