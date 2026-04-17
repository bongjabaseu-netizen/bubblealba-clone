"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginWithCredentials, register } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (mode === "login") {
        const result = await loginWithCredentials(formData);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const result = await register(formData);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("회원가입이 완료되었습니다. 로그인해주세요.");
          setMode("login");
        }
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">
            {mode === "login" ? "환영합니다" : "회원가입"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "명품알바에 오신 것을 환영해요"
              : "새 계정을 만들어보세요"}
          </p>
        </div>

        {/* Social login */}
        <div className="space-y-2 mb-6">
          <Button
            variant="outline"
            className="w-full h-11 bg-[#FEE500] hover:bg-[#FEE500]/90 border-0 text-black"
            onClick={() => signIn("kakao", { callbackUrl: "/" })}
          >
            <span className="font-bold">카카오로 시작하기</span>
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 !bg-white hover:!bg-zinc-50 border border-zinc-300 !text-zinc-900"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <span className="font-medium">G Google로 시작하기</span>
          </Button>
        </div>

        <div className="relative my-6">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
            또는 아이디 {mode === "login" ? "로그인" : "가입"}
          </span>
        </div>

        {/* Error / Success messages */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-md bg-green-500/10 text-green-600 text-sm">
            {success}
          </div>
        )}

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="닉네임"
                className="mt-1 h-11"
                required
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">아이디</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="아이디 (영문, 이메일 가능)"
              className="mt-1 h-11"
              required
              minLength={3}
            />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              className="mt-1 h-11"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading
              ? "처리 중..."
              : mode === "login"
                ? "로그인"
                : "회원가입"}
          </Button>
        </form>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          {mode === "login" ? (
            <>
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                }}
                className="hover:text-primary"
              >
                회원가입
              </button>
              <button
                onClick={() => alert("비밀번호 찾기 기능은 준비 중입니다.")}
                className="hover:text-primary"
              >
                비밀번호 찾기
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className="hover:text-primary"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground/70 text-center mt-6">
          본 서비스는 만 19세 이상 성인만 이용 가능합니다.
        </p>
      </CardContent>
    </Card>
  );
}
