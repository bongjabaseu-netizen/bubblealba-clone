"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("로그인이 필요합니다");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") throw new Error("관리자 권한이 필요합니다");
  return session;
}

export async function getAdminStats() {
  await requireAdmin();
  const [totalUsers, totalJobs, totalPosts, pendingReports] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.communityPost.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
  ]);
  return { totalUsers, totalJobs, totalPosts, pendingReports };
}

export async function getAdminUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, nickname: true, role: true, region: true,
      points: true, phoneVerified: true, isAdult: true, createdAt: true,
    },
  });
}

export async function updateUserRole(userId: string, role: "USER" | "ADVERTISER" | "ADMIN") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function getAdminJobs() {
  await requireAdmin();
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nickname: true } } },
  });
}

export async function updateJobStatus(jobId: string, status: "ACTIVE" | "REJECTED" | "CLOSED") {
  await requireAdmin();
  const job = await prisma.job.update({ where: { id: jobId }, data: { status } });

  // Notify job author about status change
  const statusLabel: Record<string, string> = {
    ACTIVE: "승인",
    REJECTED: "거절",
    CLOSED: "마감",
  };
  await prisma.notification.create({
    data: {
      type: "SYSTEM",
      title: `공고 ${statusLabel[status] ?? status}`,
      body: `'${job.title}' 공고가 ${statusLabel[status] ?? status} 처리되었습니다.`,
      userId: job.authorId,
    },
  });

  revalidatePath("/admin/jobs");
  return { success: true };
}

export async function getAdminPosts() {
  await requireAdmin();
  return prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { nickname: true } },
      board: { select: { name: true } },
    },
  });
}

export async function deleteAdminPost(postId: string) {
  await requireAdmin();
  await prisma.communityPost.delete({ where: { id: postId } });
  revalidatePath("/admin/posts");
  return { success: true };
}

export async function getAdminReports() {
  await requireAdmin();
  return prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { reporter: { select: { nickname: true } } },
  });
}

export async function handleReport(reportId: string, status: "RESOLVED" | "DISMISSED") {
  await requireAdmin();
  const report = await prisma.report.update({ where: { id: reportId }, data: { status } });

  // Notify reporter about resolution
  const statusLabel = status === "RESOLVED" ? "처리 완료" : "반려";
  await prisma.notification.create({
    data: {
      type: "SYSTEM",
      title: `신고 ${statusLabel}`,
      body: `'${report.targetTitle}' 관련 신고가 ${statusLabel} 되었습니다.`,
      userId: report.reporterId,
    },
  });

  revalidatePath("/admin/reports");
  return { success: true };
}

// ========== 게시판 관리 ==========

export async function getBoards() {
  await requireAdmin();
  return prisma.board.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function createBoard(formData: FormData) {
  const session = await requireAdmin();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  if (!name || !slug) return { error: "이름과 슬러그를 입력해주세요" };

  const exists = await prisma.board.findUnique({ where: { slug } });
  if (exists) return { error: "이미 존재하는 슬러그입니다" };

  const maxOrder = await prisma.board.aggregate({ _max: { order: true } });
  await prisma.board.create({
    data: {
      name, slug, description,
      order: (maxOrder._max.order ?? 0) + 1,
      createdById: session.user!.id!,
    },
  });

  revalidatePath("/admin/boards");
  return { success: true };
}

export async function updateBoard(boardId: string, formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const isActive = formData.get("isActive") === "true";

  await prisma.board.update({
    where: { id: boardId },
    data: { ...(name && { name }), description, isActive },
  });

  revalidatePath("/admin/boards");
  return { success: true };
}

export async function getRecentUsers(limit = 5) {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, email: true, nickname: true, role: true, createdAt: true },
  });
}

export async function getRecentJobs(limit = 5) {
  await requireAdmin();
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, title: true, company: true, status: true, region: true, city: true, createdAt: true },
  });
}

export async function getTodayStats() {
  await requireAdmin();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const [todayUsers, todayJobs, todayPosts] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.job.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.communityPost.count({ where: { createdAt: { gte: startOfDay } } }),
  ]);
  return { todayUsers, todayJobs, todayPosts };
}

export async function searchUsers(query: string) {
  await requireAdmin();
  return prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query } },
        { nickname: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, nickname: true, role: true, region: true,
      points: true, phoneVerified: true, isAdult: true, createdAt: true,
    },
  });
}

export async function searchJobs(query: string, status?: string) {
  await requireAdmin();
  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") where.status = status;
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { company: { contains: query } },
    ];
  }
  return prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nickname: true } } },
  });
}

// ========== 광고 순서 관리 ==========

export async function getAdminJobsWithOrder() {
  await requireAdmin();
  return prisma.job.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, title: true, company: true, region: true, city: true,
      isPromoted: true, displayOrder: true, views: true, createdAt: true,
    },
  });
}

export async function updateJobOrder(jobId: string, displayOrder: number) {
  await requireAdmin();
  await prisma.job.update({ where: { id: jobId }, data: { displayOrder } });
  revalidatePath("/admin/ad-order");
  return { success: true };
}

export async function swapJobOrder(jobId1: string, jobId2: string) {
  await requireAdmin();
  const [job1, job2] = await Promise.all([
    prisma.job.findUnique({ where: { id: jobId1 }, select: { displayOrder: true } }),
    prisma.job.findUnique({ where: { id: jobId2 }, select: { displayOrder: true } }),
  ]);
  if (!job1 || !job2) return { error: "공고를 찾을 수 없습니다" };

  await Promise.all([
    prisma.job.update({ where: { id: jobId1 }, data: { displayOrder: job2.displayOrder } }),
    prisma.job.update({ where: { id: jobId2 }, data: { displayOrder: job1.displayOrder } }),
  ]);
  revalidatePath("/admin/ad-order");
  return { success: true };
}

export async function toggleJobPromoted(jobId: string) {
  await requireAdmin();
  const job = await prisma.job.findUnique({ where: { id: jobId }, select: { isPromoted: true } });
  if (!job) return { error: "공고를 찾을 수 없습니다" };
  await prisma.job.update({ where: { id: jobId }, data: { isPromoted: !job.isPromoted } });
  revalidatePath("/admin/ad-order");
  return { success: true };
}

// ========== 광고 편집 ==========

export async function getJobDetail(jobId: string) {
  await requireAdmin();
  return prisma.job.findUnique({
    where: { id: jobId },
    include: { author: { select: { nickname: true } } },
  });
}

export async function updateJob(jobId: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const wage = formData.get("wage") as string;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const images = formData.get("images") as string; // JSON string
  const tags = formData.get("tags") as string; // JSON string

  await prisma.job.update({
    where: { id: jobId },
    data: {
      ...(title && { title }),
      ...(company && { company }),
      ...(wage && { wage }),
      ...(region && { region }),
      ...(city && { city }),
      ...(category && { category }),
      ...(description && { description }),
      ...(images && { images }),
      ...(tags && { tags }),
    },
  });

  revalidatePath("/admin/jobs");
  return { success: true };
}

export async function deleteBoard(boardId: string) {
  await requireAdmin();
  const postCount = await prisma.communityPost.count({ where: { boardId } });
  if (postCount > 0) return { error: `게시글 ${postCount}개가 있어 삭제할 수 없습니다` };

  await prisma.board.delete({ where: { id: boardId } });
  revalidatePath("/admin/boards");
  return { success: true };
}
