/**
 * NextAuth v5 — 카카오 + 구글 + Credentials 인증
 */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    // 카카오 로그인 (API 키 있을 때만 활성)
    ...(process.env.AUTH_KAKAO_ID
      ? [
          Kakao({
            clientId: process.env.AUTH_KAKAO_ID,
            clientSecret: process.env.AUTH_KAKAO_SECRET!,
          }),
        ]
      : []),
    // 구글 로그인 (API 키 있을 때만 활성)
    ...(process.env.AUTH_GOOGLE_ID
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
    // 이메일+비밀번호
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user?.password) return null;

        const valid = await compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.nickname,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // 초기 로그인 또는 세션 업데이트 시에만 DB 조회
      if (user) {
        token.id = user.id;
      }
      if (trigger === "signIn" || trigger === "update" || (token.id && !token.role)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, nickname: true, image: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.nickname = dbUser.nickname;
            token.picture = dbUser.image;
          }
        } catch {
          // Edge runtime에서 DB 접근 실패 시 기존 토큰 유지
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).nickname = token.nickname;
      }
      return session;
    },
  },
});
