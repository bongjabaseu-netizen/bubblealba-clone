"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getJobs(options?: { region?: string; city?: string; category?: string; q?: string }) {
  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (options?.region && options.region !== "전체") where.region = options.region;
  if (options?.city && options.city !== "전체") where.city = options.city;
  if (options?.category && options.category !== "전체") where.category = options.category;
  if (options?.q) {
    where.OR = [
      { title: { contains: options.q } },
      { company: { contains: options.q } },
      { description: { contains: options.q } },
      { region: { contains: options.q } },
      { city: { contains: options.q } },
    ];
  }

  return prisma.job.findMany({
    where,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { favorites: true, applications: true } } },
  });
}

export async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      author: { select: { nickname: true, image: true } },
      _count: { select: { favorites: true, applications: true } },
    },
  });
  if (job) {
    await prisma.job.update({ where: { id }, data: { views: { increment: 1 } } });
  }
  return job;
}

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    wage: formData.get("wage") as string,
    region: formData.get("region") as string,
    city: formData.get("city") as string,
    category: formData.get("category") as string,
    company: formData.get("company") as string,
    authorId: session.user.id,
  };

  if (!data.title || !data.description || !data.wage) {
    return { error: "필수 항목을 입력해주세요" };
  }

  const job = await prisma.job.create({ data });
  revalidatePath("/");
  revalidatePath("/job");
  return { success: true, id: job.id };
}

export async function applyJob(jobId: string, message?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const exists = await prisma.jobApplication.findUnique({
    where: { userId_jobId: { userId: session.user.id, jobId } },
  });
  if (exists) return { error: "이미 신청한 공고입니다" };

  await prisma.jobApplication.create({
    data: { userId: session.user.id, jobId, message },
  });

  // 알림 생성
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (job) {
    await prisma.notification.create({
      data: {
        type: "APPLY",
        title: "새 신청",
        body: `${job.title} 공고에 새 신청이 접수됐어요.`,
        userId: job.authorId,
      },
    });
  }

  revalidatePath("/mypage/apply");
  return { success: true };
}
