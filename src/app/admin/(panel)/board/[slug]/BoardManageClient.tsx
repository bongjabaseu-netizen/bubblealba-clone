/** 게시판별 관리 클라이언트 — 글/공지 작성 + 목록(고정/편집/삭제) (사용자 지시 2026-07-10)
 * from: admin PostsClient 패턴 참고, 단일 게시판 스코프로 재작성 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pin, PinOff, Pencil, Trash2, Plus, X, Save, Megaphone, FileText } from "lucide-react";
import {
  adminCreateBoardPost,
  adminTogglePinPost,
  adminUpdatePost,
  deleteAdminPost,
} from "@/lib/actions/admin";

type Post = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: Date;
  views?: number;
  likes?: number;
  author: { nickname: string | null };
};

const FIELD =
  "w-full bg-navy-900 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none";

export function BoardManageClient({
  slug,
  board,
  posts,
}: {
  slug: string;
  board: { slug: string; name: string };
  posts: Post[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [asNotice, setAsNotice] = useState(true);
  const [error, setError] = useState("");
  const [editPost, setEditPost] = useState<Post | null>(null);

  const noticeCount = posts.filter((p) => p.pinned).length;

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("pinned", asNotice ? "true" : "false");
    startTransition(async () => {
      const r = await adminCreateBoardPost(slug, fd);
      if (r?.error) setError(r.error);
      else {
        form.reset();
        setShowForm(false);
        router.refresh();
      }
    });
  }
  function handleTogglePin(id: string) {
    startTransition(async () => {
      await adminTogglePinPost(id);
      router.refresh();
    });
  }
  function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    startTransition(async () => {
      await deleteAdminPost(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {/* 상단: 게시판명 + 작성 토글 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-mute">
          <FileText className="w-4 h-4 text-brand" />
          <b className="text-slate-200">{board.name}</b> 게시판 · 전체 {posts.length}개 · 공지{" "}
          <b className="text-slate-300">{noticeCount}</b>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
          className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "취소" : "글/공지 작성"}
        </button>
      </div>

      {/* 작성 폼 */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5 space-y-3"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAsNotice(true)}
              className={`inline-flex items-center gap-1 h-8 px-3 rounded-lg text-[12.5px] font-bold border transition-colors ${
                asNotice
                  ? "bg-brand/20 text-brand border-brand/40"
                  : "bg-navy-800 text-mute border-line hover:text-slate-200"
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" /> 공지 (상단 고정)
            </button>
            <button
              type="button"
              onClick={() => setAsNotice(false)}
              className={`inline-flex items-center gap-1 h-8 px-3 rounded-lg text-[12.5px] font-bold border transition-colors ${
                !asNotice
                  ? "bg-brand/20 text-brand border-brand/40"
                  : "bg-navy-800 text-mute border-line hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> 일반 글
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <input name="title" placeholder="제목" className={FIELD} />
          <textarea name="content" rows={4} placeholder="내용을 입력하세요" className={FIELD} />
          <p className="text-xs text-mute">
            {asNotice
              ? "공지로 등록하면 게시판 최상단에 고정됩니다."
              : "일반 글로 등록됩니다."}
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> {isPending ? "등록 중..." : asNotice ? "공지 등록" : "글 등록"}
          </button>
        </form>
      )}

      {/* 목록 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">{board.name} 게시글</h2>
          <span className="text-[12px] text-mute">총 {posts.length}개 · 공지 {noticeCount}</span>
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="text-left px-5 py-2.5 font-semibold">제목</th>
              <th className="text-left px-3 py-2.5 font-semibold">작성자</th>
              <th className="text-right px-3 py-2.5 font-semibold">조회수</th>
              <th className="text-left px-3 py-2.5 font-semibold">작성일</th>
              <th className="text-center px-3 py-2.5 font-semibold w-20">고정</th>
              <th className="text-center px-5 py-2.5 font-semibold w-28">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-mute">
                  게시글이 없습니다. 위 &quot;글/공지 작성&quot;으로 등록하세요.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className={`hover:bg-navy-800/40 ${p.pinned ? "bg-brand/5" : ""}`}>
                  <td className="px-5 py-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      {p.pinned && (
                        <span className="shrink-0 inline-flex items-center gap-0.5 rounded-md bg-brand/20 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                          <Pin className="w-3 h-3" />
                          공지
                        </span>
                      )}
                      <span className="font-semibold text-white truncate">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{p.author?.nickname || "-"}</td>
                  <td className="px-3 py-3 text-right text-slate-300 tabular-nums">
                    {(p.views ?? 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-mute text-xs">
                    {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => handleTogglePin(p.id)}
                      disabled={isPending}
                      title={p.pinned ? "고정 해제" : "상단 고정"}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-colors disabled:opacity-50 ${
                        p.pinned
                          ? "bg-brand/20 text-brand border-brand/40"
                          : "bg-navy-800 text-mute border-line hover:text-slate-200"
                      }`}
                    >
                      {p.pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditPost(p)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand/15 text-brand border border-brand/30 hover:bg-brand/25"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={isPending}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editPost && (
        <EditPostModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onSaved={() => {
            setEditPost(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

/** 글/공지 편집 모달 (제목·내용) */
function EditPostModal({
  post,
  onClose,
  onSaved,
}: {
  post: Post;
  onClose: () => void;
  onSaved: () => void;
}) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-navy-900 border border-line rounded-2xl shadow-card w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-lg font-bold text-white">
            {post.pinned ? "공지 편집" : "글 편집"}
          </h2>
          <button onClick={onClose} className="text-mute hover:text-slate-200 text-2xl leading-none">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <div>
            <label className="text-sm font-medium text-slate-300">제목</label>
            <input name="title" defaultValue={post.title} className={`mt-1 ${FIELD}`} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">내용</label>
            <textarea
              name="content"
              defaultValue={post.content}
              rows={6}
              className={`mt-1 ${FIELD}`}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 bg-navy-850 border border-line rounded-lg hover:border-brand/60"
            >
              <X className="w-4 h-4" />
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-navy-950 bg-brand rounded-lg hover:bg-brand-soft shadow-glow disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
