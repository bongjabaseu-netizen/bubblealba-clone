import { getAdminUsers } from "@/lib/actions/admin";
import { AdminUserTable } from "./UserTable";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900">회원 관리</h1>
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
          {users.length}명
        </span>
      </div>
      <AdminUserTable users={users} />
    </div>
  );
}
