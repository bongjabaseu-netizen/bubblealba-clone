"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getPosts(boardSlug?: string) {
  const where: Record<string, unknown> = {};
  if (boardSlug) {
    const board = await prisma.board.findUnique({ where: { slug: boardSlug } });
    if (board) where.boardId = board.id;
  }

  return prisma.communityPost.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], // 고정 공지 최상단
    include: {
      author: { select: { nickname: true, image: true } },
      board: { select: { name: true, slug: true } },
      _count: { select: { comments: true, scraps: true } },
    },
  });
}

export async function getPost(id: string) {
  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: {
      author: { select: { nickname: true, image: true } },
      board: { select: { name: true, slug: true } },
      comments: {
        include: { author: { select: { nickname: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { scraps: true } },
    },
  });
  if (post) {
    await prisma.communityPost.update({ where: { id }, data: { views: { increment: 1 } } });
  }
  return post;
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const boardSlug = formData.get("board") as string;

  if (!title || !content) return { error: "제목과 내용을 입력해주세요" };

  const board = await prisma.board.findUnique({ where: { slug: boardSlug || "free" } });
  if (!board) return { error: "게시판을 선택해주세요" };

  const images = (formData.get("images") as string) || "[]";
  // 비밀글(법률상담) — 제목만 공개, 본문/답변은 작성자·관리자(변호사)만
  const isSecret = formData.get("secret") === "1";

  const post = await prisma.communityPost.create({
    data: { title, content, images, authorId: session.user.id, boardId: board.id, isSecret },
  });

  revalidatePath("/community");
  revalidatePath(`/board/${boardSlug}`);
  return { success: true, id: post.id };
}

/** 변호사(관리자) 상담 목록 — legal-consult 비밀 상담글 전체(본문·답변 포함), 미답변 우선 */
export async function getAdminConsults() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return null;
  const board = await prisma.board.findUnique({ where: { slug: "legal-consult" } });
  if (!board) return [];
  return prisma.communityPost.findMany({
    where: { boardId: board.id, isSecret: true },
    orderBy: [{ answeredAt: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }],
    include: { author: { select: { nickname: true } } },
  });
}

/** 변호사(관리자) 답변 등록/수정 — 비밀 상담글에 대한 답변 */
export async function answerConsult(postId: string, answer: string) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return { error: "변호사 관리자만 답변할 수 있습니다" };
  if (!answer || answer.trim().length < 2) return { error: "답변 내용을 입력해주세요" };

  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) return { error: "상담글을 찾을 수 없습니다" };

  await prisma.communityPost.update({
    where: { id: postId },
    data: { answer: answer.trim(), answeredAt: new Date() },
  });
  revalidatePath(`/community/detail/${postId}`);
  revalidatePath("/admin/legal-consult");
  return { success: true };
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const post = await prisma.communityPost.findUnique({ where: { id } });
  if (!post) return { error: "게시글을 찾을 수 없습니다" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (post.authorId !== session.user.id && user?.role !== "ADMIN") {
    return { error: "권한이 없습니다" };
  }

  await prisma.communityPost.delete({ where: { id } });
  revalidatePath("/community");
  return { success: true };
}

export async function addComment(postId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };
  if (!content.trim()) return { error: "댓글 내용을 입력해주세요" };

  await prisma.comment.create({
    data: { content, authorId: session.user.id, postId },
  });

  // 알림
  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (post && post.authorId !== session.user.id) {
    await prisma.notification.create({
      data: {
        type: "LIKE",
        title: "새 댓글",
        body: `'${post.title}' 게시글에 새 댓글이 달렸어요.`,
        userId: post.authorId,
      },
    });
  }

  revalidatePath(`/community/detail/${postId}`);
  return { success: true };
}
