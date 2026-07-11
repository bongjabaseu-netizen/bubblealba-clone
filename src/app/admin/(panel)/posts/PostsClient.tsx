/** 관리자 게시물관리 — /api/admin/posts 서버 페이지네이션 + 검색 + 게시판필터 (사용자 지시 2026-07-11, 확장성)
 * 글이 많아져도 전량 로드 안 함. 공지등록/수정/삭제/고정 뮤테이션은 서버액션 유지 후 현재 페이지 새로고침 */
"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { Search, Trash2, Pin, PinOff, Pencil, Megaphone, Plus, X, Save } from "lucide-react";
import { deleteAdminPost, adminCreateNotice, adminTogglePinPost, adminUpdatePost } from "@/lib/actions/admin";

type Post = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  views?: number;
  likes?: number;
  author: { nickname: string | null };
  board: { name: string; slug: string } | null;
};

const FIELD = "w-full bg-navy-900 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none";
const PAGE_SIZE = 20;

export function PostsClient({ boards }: { boards: { name: string; slug: string }[] }) {
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState("ALL"); // slug
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(
    async (p: number) => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(p), pageSize: String(PAGE_SIZE) });
      if (search.trim()) params.set("q", search.trim());
      if (boardFilter !== "ALL") params.set("board", boardFilter);
      try {
        const res = await fetch(`/api/admin/posts?${params}`);
        const data = await res.json();
        setPosts(data.items ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setPage(data.page ?? p);
      } finally {
        setLoading(false);
      }
    },
    [search, boardFilter]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchPosts(1), 300);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  const reload = () => fetchPosts(page);

  function handleDelete(postId: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    startTransition(async () => { await deleteAdminPost(postId); reload(); });
  }
  function handleTogglePin(postId: string) {
    startTransition(async () => { await adminTogglePinPost(postId); reload(); });
  }
  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const r = await adminCreateNotice(fd);
      if (r?.error) setError(r.error);
      else { form.reset(); setShowForm(false); reload(); }
    });
  }

  const pinnedCount = posts.filter((p) => p.pinned).length;

  return (
    <div className="space-y-5">
      {/* 공지/이벤트 등록 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-mute">
          <Megaphone className="w-4 h-4 text-brand" />
          커뮤니티 최상단 고정 공지·이벤트 (이 페이지 <b className="text-slate-300">{pinnedCount}건</b>)
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(""); }} className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "취소" : "공지/이벤트 등록"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5 space-y-3">
          <h2 className="text-[14px] font-bold text-white flex items-center gap-1.5"><Megaphone className="w-4 h-4 text-brand" /> 새 공지/이벤트</h2>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <input name="title" placeholder="제목 (예: 🎉 신규 오픈 이벤트 안내)" className={FIELD} />
          <textarea name="content" rows={4} placeholder="공지·이벤트 내용을 입력하세요" className={FIELD} />
          <p className="text-xs text-mute">등록하면 커뮤니티 목록 <b>최상단에 고정</b>되어 표시됩니다.</p>
          <button type="submit" disabled={isPending} className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow disabled:opacity-50">
            <Plus className="w-4 h-4" /> {isPending ? "등록 중..." : "고정글로 등록"}
          </button>
        </form>
      )}

      {/* 필터 */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          <input type="text" placeholder="제목·내용 검색..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none w-64" />
        </div>
        <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}
          className="h-9 px-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 focus:border-brand/60 focus:outline-none">
          <option value="ALL">전체 게시판</option>
          {boards.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </select>
      </div>

      {/* 테이블 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">게시물 목록</h2>
          <span className="text-[12px] text-mute">총 {total.toLocaleString()}개</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
                <th className="text-left px-5 py-2.5 font-semibold">제목</th>
                <th className="text-left px-3 py-2.5 font-semibold">게시판</th>
                <th className="text-left px-3 py-2.5 font-semibold">작성자</th>
                <th className="text-right px-3 py-2.5 font-semibold">조회수</th>
                <th className="text-left px-3 py-2.5 font-semibold">작성일</th>
                <th className="text-center px-3 py-2.5 font-semibold w-20">고정</th>
                <th className="text-center px-5 py-2.5 font-semibold w-28">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50 text-slate-300">
              {posts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-mute">{loading ? "불러오는 중…" : "게시물이 없습니다"}</td></tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className={`hover:bg-navy-800/40 ${p.pinned ? "bg-brand/5" : ""}`}>
                    <td className="px-5 py-3 max-w-xs">
                      <div className="flex items-center gap-2">
                        {p.pinned && <span className="shrink-0 inline-flex items-center gap-0.5 rounded-md bg-brand/20 px-1.5 py-0.5 text-[10px] font-bold text-brand"><Pin className="w-3 h-3" />공지</span>}
                        <span className="font-semibold text-white truncate">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-navy-700 text-slate-300">{p.board?.name || "-"}</span></td>
                    <td className="px-3 py-3 text-slate-300">{p.author?.nickname || "-"}</td>
                    <td className="px-3 py-3 text-right text-slate-300 tabular-nums">{(p.views ?? 0).toLocaleString()}</td>
                    <td className="px-3 py-3 text-mute text-xs">{new Date(p.createdAt).toLocaleDateString("ko-KR")}</td>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => handleTogglePin(p.id)} disabled={isPending} title={p.pinned ? "고정 해제" : "상단 고정"}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-colors disabled:opacity-50 ${p.pinned ? "bg-brand/20 text-brand border-brand/40" : "bg-navy-800 text-mute border-line hover:text-slate-200"}`}>
                        {p.pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditPost(p)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand/15 text-brand border border-brand/30 hover:bg-brand/25"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} disabled={isPending} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-line text-[12px] text-mute">
          <span>{total > 0 ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} / ${total.toLocaleString()}` : "0"}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchPosts(page - 1)} disabled={page <= 1 || loading} className="px-3 py-1.5 rounded-lg bg-navy-850 border border-line text-slate-200 disabled:opacity-40 hover:border-brand/50">이전</button>
            <span className="text-slate-300">{page} / {totalPages}</span>
            <button onClick={() => fetchPosts(page + 1)} disabled={page >= totalPages || loading} className="px-3 py-1.5 rounded-lg bg-navy-850 border border-line text-slate-200 disabled:opacity-40 hover:border-brand/50">다음</button>
          </div>
        </div>
      </div>

      {editPost && <EditPostModal post={editPost} onClose={() => setEditPost(null)} onSaved={() => { setEditPost(null); reload(); }} />}
    </div>
  );
}

/** 게시글 편집 모달 (제목/내용) */
function EditPostModal({ post, onClose, onSaved }: { post: Post; onClose: () => void; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await adminUpdatePost(post.id, fd);
      if (r?.error) setError(r.error);
      else onSaved();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-navy-900 border border-line rounded-2xl shadow-card w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-lg font-bold text-white">게시글 편집{post.pinned && <span className="ml-2 text-[11px] font-bold text-brand">고정 공지</span>}</h2>
          <button onClick={onClose} className="text-mute hover:text-slate-200 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
          <div>
            <label className="text-sm font-medium text-slate-300">제목</label>
            <input name="title" defaultValue={post.title} className={`mt-1 ${FIELD}`} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">내용</label>
            <textarea name="content" defaultValue={post.content} rows={6} className={`mt-1 ${FIELD}`} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 bg-navy-850 border border-line rounded-lg hover:border-brand/60"><X className="w-4 h-4" />취소</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-navy-950 bg-brand rounded-lg hover:bg-brand-soft shadow-glow disabled:opacity-50"><Save className="w-4 h-4" />{isPending ? "저장 중..." : "저장"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
