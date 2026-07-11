/** 관리자 회원관리 — /api/admin/users 서버 페이지네이션 + 검색 + 역할필터 (사용자 지시 2026-07-11, 확장성)
 * 회원이 많아져도 전량 로드 안 함. 역할 변경은 서버액션 유지 후 현재 페이지 새로고침 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { updateUserRole } from "@/lib/actions/admin";

type User = {
  id: string;
  email: string | null;
  nickname: string | null;
  role: string;
  region: string | null;
  points: number;
  phoneVerified: boolean;
  isAdult: boolean;
  createdAt: string;
};

const ROLES = ["USER", "ADVERTISER", "ADMIN"] as const;
type Role = (typeof ROLES)[number];

const ROLE_BADGE: Record<string, string> = {
  USER: "bg-navy-700 text-slate-300",
  ADVERTISER: "bg-brand/15 text-brand",
  ADMIN: "bg-red-500/15 text-red-400",
  LAWYER: "bg-sky-500/15 text-sky-400",
};

const ROLE_FILTERS = [
  { label: "전체", value: "ALL" },
  { label: "USER", value: "USER" },
  { label: "ADVERTISER", value: "ADVERTISER" },
  { label: "ADMIN", value: "ADMIN" },
  { label: "LAWYER", value: "LAWYER" },
] as const;

const PAGE_SIZE = 20;

export function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [changingId, setChangingId] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (p: number) => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(p), pageSize: String(PAGE_SIZE) });
      if (query.trim()) params.set("q", query.trim());
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      try {
        const res = await fetch(`/api/admin/users?${params}`);
        const data = await res.json();
        setUsers(data.items ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setPage(data.page ?? p);
      } finally {
        setLoading(false);
      }
    },
    [query, roleFilter]
  );

  // 검색/필터 변경 → 1페이지부터 (검색은 300ms 디바운스)
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  async function handleRoleChange(userId: string, role: Role) {
    setChangingId(userId);
    await updateUserRole(userId, role);
    setChangingId(null);
    fetchUsers(page);
  }

  return (
    <div className="space-y-4">
      {/* 검색 + 역할 필터 */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="닉네임 또는 이메일 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 text-sm rounded-lg bg-navy-850 border border-line text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
        />
        <div className="flex gap-1 flex-wrap">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                roleFilter === f.value
                  ? "bg-brand/15 text-brand border border-brand/40"
                  : "bg-navy-850 text-mute border border-line hover:text-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 테이블 카드 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">회원 목록</h2>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand/15 text-brand">
            총 {total.toLocaleString()}명
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
                <th className="px-5 py-2.5 font-semibold">닉네임</th>
                <th className="px-3 py-2.5 font-semibold">이메일</th>
                <th className="px-3 py-2.5 font-semibold">역할</th>
                <th className="px-3 py-2.5 font-semibold">지역</th>
                <th className="px-3 py-2.5 font-semibold">포인트</th>
                <th className="px-3 py-2.5 font-semibold">본인인증</th>
                <th className="px-3 py-2.5 font-semibold">가입일</th>
                <th className="px-5 py-2.5 font-semibold">역할 변경</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50 text-slate-300">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-mute">
                    {loading ? "불러오는 중…" : "검색 결과가 없습니다"}
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">{u.nickname || "-"}</td>
                    <td className="px-3 py-3">{u.email || "-"}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${ROLE_BADGE[u.role] || "bg-navy-700 text-slate-300"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-3 py-3">{u.region || "-"}</td>
                    <td className="px-3 py-3 text-slate-200">{u.points.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      {u.phoneVerified ? (
                        <span className="text-emerald-400 font-bold">&#10003;</span>
                      ) : (
                        <span className="text-red-400">&#10007;</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-mute">
                      {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-5 py-3">
                      {u.role === "LAWYER" ? (
                        <span className="text-mute text-xs">—</span>
                      ) : (
                        <select
                          value={u.role}
                          disabled={changingId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                          className="px-2 py-1 text-xs rounded-lg bg-navy-850 border border-line text-slate-200 focus:border-brand/60 focus:outline-none disabled:opacity-50"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-line text-[12px] text-mute">
          <span>
            {total > 0 ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} / ${total.toLocaleString()}` : "0"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUsers(page - 1)}
              disabled={page <= 1 || loading}
              className="px-3 py-1.5 rounded-lg bg-navy-850 border border-line text-slate-200 disabled:opacity-40 hover:border-brand/50"
            >
              이전
            </button>
            <span className="text-slate-300">{page} / {totalPages}</span>
            <button
              onClick={() => fetchUsers(page + 1)}
              disabled={page >= totalPages || loading}
              className="px-3 py-1.5 rounded-lg bg-navy-850 border border-line text-slate-200 disabled:opacity-40 hover:border-brand/50"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
