/** 관리자 게시판별 관리 — 해당 게시판 글/공지 작성 + 목록 관리 (사용자 지시 2026-07-10) */
import { notFound } from "next/navigation";
import { getAdminBoardPosts } from "@/lib/actions/admin";
import { BoardManageClient } from "./BoardManageClient";

export const dynamic = "force-dynamic";

export default async function AdminBoardManagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getAdminBoardPosts(slug);
  if (!data) notFound();
  return <BoardManageClient slug={slug} board={data.board} posts={data.posts as never} />;
}
