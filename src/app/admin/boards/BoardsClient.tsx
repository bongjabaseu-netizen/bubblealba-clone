"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBoard, updateBoard, deleteBoard } from "@/lib/actions/admin";

type Board = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  order: number;
  _count: { posts: number };
};

export function BoardsClient({ boards }: { boards: Board[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const result = await createBoard(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        form.reset();
        router.refresh();
      }
    });
  }

  function startEdit(board: Board) {
    setEditingId(board.id);
    setEditName(board.name);
    setEditDesc(board.description || "");
  }

  function handleSaveEdit(boardId: string, isActive: boolean) {
    const formData = new FormData();
    formData.set("name", editName);
    formData.set("description", editDesc);
    formData.set("isActive", String(isActive));
    startTransition(async () => {
      await updateBoard(boardId, formData);
      setEditingId(null);
      router.refresh();
    });
  }

  function handleToggleActive(board: Board) {
    const formData = new FormData();
    formData.set("name", board.name);
    formData.set("description", board.description || "");
    formData.set("isActive", String(!board.isActive));
    startTransition(async () => {
      await updateBoard(board.id, formData);
      router.refresh();
    });
  }

  function handleDelete(boardId: string, postCount: number) {
    if (postCount > 0) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteBoard(boardId);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">게시판 관리</h1>
        <p className="text-sm text-slate-500 mt-1">총 {boards.length}개의 게시판</p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">새 게시판 추가</h2>
        <form onSubmit={handleCreate} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">이름</label>
            <input
              name="name"
              required
              placeholder="게시판 이름"
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">슬러그</label>
            <input
              name="slug"
              required
              placeholder="board-slug"
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-mono"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">설명</label>
            <input
              name="description"
              placeholder="설명 (선택)"
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
          >
            추가
          </button>
        </form>
        {error && (
          <p className="text-sm text-red-600 mt-3">{error}</p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-4 py-3 font-medium text-slate-600 w-16">순서</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">이름</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">슬러그</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">설명</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">게시글수</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">상태</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-28">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {boards.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  게시판이 없습니다
                </td>
              </tr>
            ) : (
              boards.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{b.order}</td>
                  <td className="px-4 py-3">
                    {editingId === b.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 px-2 rounded-md border border-slate-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                    ) : (
                      <span className="font-medium text-slate-900">{b.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{b.slug}</td>
                  <td className="px-4 py-3">
                    {editingId === b.id ? (
                      <input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="h-8 px-2 rounded-md border border-slate-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                    ) : (
                      <span className="text-slate-500">{b.description || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    {b._count.posts}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(b)}
                      disabled={isPending}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        b.isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {b.isActive ? "활성" : "비활성"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {editingId === b.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(b.id, b.isActive)}
                            disabled={isPending}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(b)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(b.id, b._count.posts)}
                            disabled={isPending || b._count.posts > 0}
                            title={b._count.posts > 0 ? `게시글 ${b._count.posts}개가 있어 삭제 불가` : "삭제"}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
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
