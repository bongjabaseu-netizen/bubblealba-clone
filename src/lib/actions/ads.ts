"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Get all active ad packages
export async function getAdPackages() {
  return prisma.adPackage.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
}

// Get advertiser profile for current user
export async function getAdvertiserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.advertiserProfile.findUnique({
    where: { userId: session.user.id },
  });
}

// Create or update advertiser profile
export async function upsertAdvertiserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const data = {
    businessName: formData.get("businessName") as string,
    businessNumber: formData.get("businessNumber") as string,
    representative: formData.get("representative") as string,
    phone: formData.get("phone") as string,
    address: (formData.get("address") as string) || undefined,
  };

  if (
    !data.businessName ||
    !data.businessNumber ||
    !data.representative ||
    !data.phone
  ) {
    return { error: "필수 항목을 모두 입력해주세요" };
  }

  await prisma.advertiserProfile.upsert({
    where: { userId: session.user.id },
    create: { ...data, userId: session.user.id },
    update: data,
  });

  // Upgrade user role to ADVERTISER if still USER
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (user?.role === "USER") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "ADVERTISER" },
    });
  }

  revalidatePath("/mypage/ad-center/profile");
  return { success: true };
}

// Purchase ad package (demo: no real payment, uses points or marks as completed)
export async function purchaseAd(packageId: string, jobId?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const pkg = await prisma.adPackage.findUnique({ where: { id: packageId } });
  if (!pkg) return { error: "패키지를 찾을 수 없습니다" };

  // Check advertiser profile exists
  const profile = await prisma.advertiserProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) return { error: "광고프로필을 먼저 등록해주세요" };

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + pkg.durationDays);

  // Create order (demo: auto-complete)
  const order = await prisma.adOrder.create({
    data: {
      userId: session.user.id,
      packageId: pkg.id,
      jobId: jobId || undefined,
      amount: pkg.price,
      status: "COMPLETED",
      startDate: now,
      endDate,
      paymentMethod: "demo",
    },
  });

  // If linked to a job, mark it as promoted
  if (jobId) {
    await prisma.job.update({
      where: { id: jobId },
      data: { isPromoted: true },
    });
  }

  // Notification
  await prisma.notification.create({
    data: {
      type: "SYSTEM",
      title: "광고 구매 완료",
      body: `${pkg.name} 패키지가 구매되었습니다. (${pkg.durationDays}일)`,
      userId: session.user.id,
    },
  });

  revalidatePath("/mypage/ad-center/orders");
  return { success: true, orderId: order.id };
}

// Get user's ad orders
export async function getAdOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.adOrder.findMany({
    where: { userId: session.user.id },
    include: {
      package: true,
      job: { select: { title: true, company: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Cancel order (only PENDING)
export async function cancelAdOrder(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const order = await prisma.adOrder.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id)
    return { error: "주문을 찾을 수 없습니다" };
  if (order.status !== "PENDING")
    return { error: "대기 중인 주문만 취소할 수 있습니다" };

  await prisma.adOrder.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/mypage/ad-center/orders");
  return { success: true };
}

// Get user's jobs (for selecting which job to promote)
export async function getMyJobs() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return prisma.job.findMany({
    where: { authorId: session.user.id },
    select: {
      id: true,
      title: true,
      company: true,
      status: true,
      isPromoted: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// Admin: get all ad orders
export async function getAdminAdOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (user?.role !== "ADMIN") return [];
  return prisma.adOrder.findMany({
    include: {
      package: true,
      user: { select: { nickname: true, email: true } },
      job: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Admin: verify advertiser profile
export async function verifyAdvertiserProfile(profileId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (user?.role !== "ADMIN") return { error: "관리자 권한이 필요합니다" };

  await prisma.advertiserProfile.update({
    where: { id: profileId },
    data: { verified: true },
  });
  revalidatePath("/admin/users");
  return { success: true };
}
