"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole, searchUsers } from "@/lib/actions/admin";

type User = {
  id: string;
  email: string | null;
  nickname: string | null;
  role: string;
  region: string | null;
  points: number;
  phoneVerified: boolean;
  isAdult: boolean;
  createdAt: Date;
};

const ROLES = ["USER", "ADVERTISER", "ADMIN"] as const;
type Role = (typeof ROLES)[number];

// 역할 배지 색 — 중립/주황(brand)/위험(red)
const ROLE_BADGE: Record<string, string> = {
  USER: "bg-navy-700 text-slate-300",
  ADVERTISER: "bg-brand/15 text-brand",
  ADMIN: "bg-red-500/15 text-red-400",
};

const ROLE_FILTERS = [
  { label: "전체", value: "ALL" },
  { label: "USER", value: "USER" },
  { label: "ADVERTISER", value: "ADVERTISER" },
  { label: "ADMIN", value: "ADMIN" },
] as const;

export function AdminUserTable({ users: initialUsers }: { users: User[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [changingId, setChangingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [users, setUsers] = useState(initialUsers);

  const filtered = roleFilter === "ALL"
    ? users
    : users.filter((u) => u.role === roleFilter);

  function handleSearch(value: string) {
    setQuery(value);
    startTransition(async () => {
      if (value.trim()) {
        const results = await searchUsers(value.trim());
        setUsers(results as User[]);
      } else {
        setUsers(initialUsers);
      }
    });
  }

  function handleRoleChange(userId: string, role: Role) {
    setChangingId(userId);
    startTransition(async () => {
      await updateUserRole(userId, role);
      setChangingId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {/* 검색 + 역할 필터 */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="닉네임 또는 이메일 검색..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 text-sm rounded-lg bg-navy-850 border border-line text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
        />
        <div className="flex gap-1">
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
            {filtered.length}명
          </span>
        </div>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-mute">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
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
                    <select
                      value={u.role}
                      disabled={isPending && changingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="px-2 py-1 text-xs rounded-lg bg-navy-850 border border-line text-slate-200 focus:border-brand/60 focus:outline-none disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
