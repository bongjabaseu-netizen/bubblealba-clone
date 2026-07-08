import { getAdminJobsWithOrder } from "@/lib/actions/admin";
import { AdOrderManager } from "./AdOrderManager";

export default async function AdminAdOrderPage() {
  const jobs = await getAdminJobsWithOrder();

  return <AdOrderManager jobs={jobs} />;
}
