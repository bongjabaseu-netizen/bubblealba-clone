/** 명품 브랜드 익명 닉네임 — 유저별 고정 번호(anonNo)로 표시명 파생 (사용자 지시 2026-07-11)
 * 닉네임=브랜드+번호(샤넬1) / 게시글 작성자=브랜드_번호방장(샤넬_1방장) / 댓글=명품_user번호(명품_user1) */

export const LUXURY_BRANDS = ["샤넬", "구찌", "에르메스", "루이비통", "셀린느", "프라다", "버버리"] as const;

/** 번호 → 브랜드 (1→샤넬, 2→구찌 … 8→샤넬) */
export function brandOf(no: number): string {
  return LUXURY_BRANDS[(no - 1) % LUXURY_BRANDS.length];
}

/** 기본 닉네임: 샤넬1 */
export function aliasNick(no: number): string {
  return `${brandOf(no)}${no}`;
}

/** 게시글 작성자(방장): 샤넬_1방장 */
export function aliasPost(no: number): string {
  return `${brandOf(no)}_${no}방장`;
}

/** 댓글 작성자(익명): 명품_user1 */
export function aliasComment(no: number): string {
  return `명품_user${no}`;
}

type AuthorLike = { anonNo?: number | null; nickname?: string | null } | null | undefined;

/** 게시글 작성자 표시명 — anonNo 있으면 방장 별칭, 없으면(관리자 등) 기존 닉네임 */
export function displayPostAuthor(a: AuthorLike): string {
  if (a?.anonNo) return aliasPost(a.anonNo);
  return a?.nickname ?? "익명";
}

/** 댓글 작성자 표시명 — anonNo 있으면 명품_user 별칭, 없으면 기존 닉네임 */
export function displayCommentAuthor(a: AuthorLike): string {
  if (a?.anonNo) return aliasComment(a.anonNo);
  return a?.nickname ?? "익명";
}
