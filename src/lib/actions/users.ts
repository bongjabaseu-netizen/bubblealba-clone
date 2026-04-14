"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: { select: { favorites: true, scraps: true, applications: true } },
    },
  });
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const nickname = formData.get("nickname") as string;
  const region = formData.get("region") as string;

  if (nickname) {
    const exists = await prisma.user.findFirst({
      where: { nickname, NOT: { id: session.user.id } },
    });
    if (exists) return { error: "이미 사용 중인 닉네임입니다" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { ...(nickname && { nickname }), ...(region && { region }) },
  });

  revalidatePath("/mypage");
  return { success: true };
}

export async function toggleFavorite(jobId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const existing = await prisma.favorite.findUnique({
    where: { userId_jobId: { userId: session.user.id, jobId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: session.user.id, jobId } });

    // Notify job author
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (job && job.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "LIKE",
          title: "즐겨찾기",
          body: `'${job.title}' 공고가 즐겨찾기에 추가되었습니다.`,
          userId: job.authorId,
        },
      });
    }
  }

  revalidatePath("/mypage/favorite");
  return { success: true, isFavorite: !existing };
}

export async function toggleScrap(postId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const existing = await prisma.scrap.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });

  if (existing) {
    await prisma.scrap.delete({ where: { id: existing.id } });
  } else {
    await prisma.scrap.create({ data: { userId: session.user.id, postId } });

    // Notify post author
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (post && post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "LIKE",
          title: "스크랩",
          body: `회원님의 게시글 '${post.title}'이 스크랩되었습니다.`,
          userId: post.authorId,
        },
      });
    }
  }

  revalidatePath("/mypage/scrap");
  return { success: true, isScrapped: !existing };
}

export async function getFavorites() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getScraps() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.scrap.findMany({
    where: { userId: session.user.id },
    include: { post: { include: { board: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplications() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.jobApplication.findMany({
    where: { userId: session.user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });
}
