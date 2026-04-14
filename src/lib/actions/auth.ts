"use server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signIn as nextAuthSignIn } from "@/auth";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;

  if (!email || !password || !nickname) {
    return { error: "모든 필드를 입력해주세요" };
  }

  if (email.length < 3) return { error: "아이디는 3자 이상이어야 합니다" };
  if (!/^[a-zA-Z0-9@._-]+$/.test(email)) return { error: "아이디는 영문, 숫자, 특수문자(@._-)만 사용 가능합니다" };

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "이미 사용 중인 아이디입니다" };

  const nickExists = await prisma.user.findUnique({ where: { nickname } });
  if (nickExists) return { error: "이미 사용 중인 닉네임입니다" };

  const hashed = await hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, nickname, name: nickname },
  });

  return { success: true };
}

export async function loginWithCredentials(formData: FormData) {
  try {
    await nextAuthSignIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "이메일 또는 비밀번호가 잘못되었습니다" };
  }
}
