/** 공통 페이지네이션 — REST API 목록 응답 표준화 (사용자 지시 2026-07-11, 확장성)
 * 데이터가 많아져도 전량 로드하지 않도록 skip/take + total 기반 페이지 응답 */

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
};

/** page/pageSize 쿼리 파싱 → skip/take. 안전 클램프(1~maxSize) */
export function parsePage(
  sp: URLSearchParams,
  defaultSize = 20,
  maxSize = 100
): { page: number; pageSize: number; skip: number; take: number } {
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const raw = parseInt(sp.get("pageSize") ?? String(defaultSize), 10) || defaultSize;
  const pageSize = Math.min(maxSize, Math.max(1, raw));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

/** 표준 페이지 응답 조립 */
export function paginate<T>(items: T[], total: number, page: number, pageSize: number): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { items, total, page, pageSize, totalPages, hasMore: page < totalPages };
}
