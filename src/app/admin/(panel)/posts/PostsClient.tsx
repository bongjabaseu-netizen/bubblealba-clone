"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
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
    <div className="space-y-5">
      {/* 필터: 제목 검색 + 게시판 선택 */}
      <div className="flex items-center gap-3">
        {/* 검색 아이콘(Search) — 입력창 왼쪽 안에 표시 */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          <input
            type="text"
            placeholder="제목 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none w-64"
          />
        </div>
        <select
          value={boardFilter}
          onChange={(e) => setBoardFilter(e.target.value)}
          className="h-9 px-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 focus:border-brand/60 focus:outline-none"
        >
          <option value="ALL">전체 게시판</option>
          {boardNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {(search || boardFilter !== "ALL") && (
          <span className="text-[13px] text-mute">{filtered.length}건</span>
        )}
      </div>

      {/* 테이블 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">게시물 목록</h2>
          <span className="text-[12px] text-mute">총 {posts.length}개</span>
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="text-left px-5 py-2.5 font-semibold">제목</th>
              <th className="text-left px-3 py-2.5 font-semibold">게시판</th>
              <th className="text-left px-3 py-2.5 font-semibold">작성자</th>
              <th className="text-right px-3 py-2.5 font-semibold">조회수</th>
              <th className="text-right px-3 py-2.5 font-semibold">좋아요</th>
              <th className="text-left px-3 py-2.5 font-semibold">작성일</th>
              <th className="text-center px-5 py-2.5 font-semibold w-16">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-mute">
                  게시물이 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-navy-800/40">
                  <td className="px-5 py-3 font-semibold text-white max-w-xs truncate">
                    {p.title}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-navy-700 text-slate-300">
                      {p.board?.name || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{p.author?.nickname || "-"}</td>
                  <td className="px-3 py-3 text-right text-slate-300 tabular-nums">
                    {(p.views ?? 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-300 tabular-nums">
                    {(p.likes ?? 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-mute text-xs">
                    {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
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
