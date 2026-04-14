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

const ROLE_BADGE: Record<string, string> = {
  USER: "bg-slate-100 text-slate-700",
  ADVERTISER: "bg-blue-100 text-blue-700",
  ADMIN: "bg-red-100 text-red-700",
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
      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="닉네임 또는 이메일 검색..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-1">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                roleFilter === f.value
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">닉네임</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">이메일</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">역할</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">지역</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">포인트</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">본인인증</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">가입일</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">역할 변경</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.nickname || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${ROLE_BADGE[u.role] || "bg-slate-100 text-slate-600"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.region || "-"}</td>
                  <td className="px-4 py-3 text-slate-900">{u.points.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {u.phoneVerified ? (
                      <span className="text-green-600 font-medium">&#10003;</span>
                    ) : (
                      <span className="text-red-400">&#10007;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={isPending && changingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
