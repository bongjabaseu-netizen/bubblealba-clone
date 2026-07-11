"use server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signIn as nextAuthSignIn } from "@/auth";
import { aliasNick } from "@/lib/luxuryAlias";

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

  const hashed = await hash(password, 10);
  // 명품 익명 닉네임 — 가입순 고정 번호 부여, 닉네임=브랜드+번호(샤넬1). 입력 닉네임은 익명성 위해 미사용
  const maxNo = (await prisma.user.aggregate({ _max: { anonNo: true } }))._max.anonNo ?? 0;
  const anonNo = maxNo + 1;
  const alias = aliasNick(anonNo);
  await prisma.user.create({
    data: { email, password: hashed, nickname: alias, name: alias, anonNo },
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
