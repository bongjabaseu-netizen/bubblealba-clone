import { getAdminUsers } from "@/lib/actions/admin";
import { AdminUserTable } from "./UserTable";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  // 제목은 공통 헤더가 pathname 기반으로 표시하므로 페이지 h1 블록 제거
  return (
    <div className="p-6">
      <AdminUserTable users={users} />
    </div>
  );
}
