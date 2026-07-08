import { getAdminReports } from "@/lib/actions/admin";
import { ReportsClient } from "./ReportsClient";

export default async function AdminReportsPage() {
  const reports = await getAdminReports();
  return <ReportsClient reports={reports} />;
}
