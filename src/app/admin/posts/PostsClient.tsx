"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { deleteAdminPost } from "@/lib/actions/admin";

type Post = {
  id: string;
  title: string;
  createdAt: Date;
  views?: number;
  likes?: number;
  author: { nickname: string | null };
  board: { name: string } | null;
};

export function PostsClient({ posts }: { posts: Post[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState("ALL");

  const boardNames = useMemo(() => {
    const names = new Set<string>();
    posts.forEach((p) => {
      if (p.board?.name) names.add(p.board.name);
    });
    return Array.from(names).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (boardFilter !== "ALL" && p.board?.name !== boardFilter) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [posts, search, boardFilter]);

  function handleDelete(postId: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    startTransition(async () => {
      await deleteAdminPost(postId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">게시물 관리</h1>
          <p className="text-sm text-slate-500 mt-1">총 {posts.length}개의 게시물</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="제목 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64"
        />
        <select
          value={boardFilter}
          onChange={(e) => setBoardFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        >
          <option value="ALL">전체 게시판</option>
          {boardNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {(search || boardFilter !== "ALL") && (
          <span className="text-sm text-slate-500">{filtered.length}건</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">제목</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">게시판</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">작성자</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">조회수</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">좋아요</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">작성일</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-16">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  게시물이 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                    {p.title}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      {p.board?.name || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.author?.nickname || "-"}</td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    {(p.views ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    {(p.likes ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
