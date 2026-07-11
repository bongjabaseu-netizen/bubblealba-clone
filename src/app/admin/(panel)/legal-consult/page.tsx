/** 변호사 상담 답변 콘솔 — 비밀 상담글 본문 열람 + 답변 등록/수정 (사용자 지시 2026-07-11)
 * from: getAdminConsults(posts.ts). 권한: 관리자(변호사)만. 답변은 작성자에게만 비밀 표시 */
import { getAdminConsults } from "@/lib/actions/posts";
import { LegalConsultAdmin } from "./LegalConsultAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLegalConsultPage() {
  const consults = await getAdminConsults();
  if (consults === null) {
    return <div className="p-6 text-sm text-slate-400">권한이 없습니다.</div>;
  }
  return <LegalConsultAdmin consults={consults as never} />;
}
