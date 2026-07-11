/** 관리자 회원관리 — 목록은 클라이언트가 /api/admin/users로 페이지네이션 로드 */
import { AdminUserTable } from "./UserTable";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return <AdminUserTable />;
}
