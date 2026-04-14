"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { sendVerificationCode, verifyCode } from "@/lib/actions/phone-verify";

const TERMS = [
  { id: "age", label: "만 19세 이상입니다", required: true },
  { id: "tos", label: "이용약관 동의", required: true, link: "/legal" },
  { id: "privacy", label: "개인정보처리방침 동의", required: true, link: "/legal" },
  { id: "youth", label: "청소년보호정책 확인", required: true, link: "/legal" },
  { id: "marketing", label: "마케팅 정보 수신 동의 (선택)", required: false },
  { id: "event", label: "이벤트 및 혜택 알림 (선택)", required: false },
];

export default function LegalAgreePage() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const allRequiredChecked = TERMS.filter((t) => t.required).every(
    (t) => checked[t.id]
  );
  const allChecked = TERMS.every((t) => checked[t.id]);
  const canSubmit = allRequiredChecked && phoneVerified;

  function handleToggleAll() {
    if (allChecked) {
      setChecked({});
    } else {
      const all: Record<string, boolean> = {};
      TERMS.forEach((t) => (all[t.id] = true));
      setChecked(all);
    }
  }

  function handleToggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSendCode() {
    setError("");
    setMessage("");
    const result = await sendVerificationCode(phone);
    if (result.error) {
      setError(result.error);
    } else {
      setCodeSent(true);
      setMessage(result.message || "인증코드가 발송되었습니다");
    }
  }

  async function handleVerifyCode() {
    setError("");
    setMessage("");
    const result = await verifyCode(phone, code);
    if (result.error) {
      setError(result.error);
    } else {
      setPhoneVerified(true);
      setMessage(result.message || "본인인증이 완료되었습니다");
    }
  }

  async function handleComplete() {
    setLoading(true);
    router.push("/");
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">약관 동의</h1>
          <p className="text-sm text-muted-foreground">
            가입 전 필수 약관을 확인해주세요
          </p>
        </div>

        {/* Terms checkboxes */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-2 p-3 border-2 border-primary rounded-lg cursor-pointer bg-primary/5">
            <input
              type="checkbox"
              className="w-5 h-5 accent-primary"
              checked={allChecked}
              onChange={handleToggleAll}
            />
            <span className="font-bold text-sm">전체 동의</span>
          </label>

          <div className="space-y-1">
            {TERMS.map((t) => (
              <label
                key={t.id}
                className="flex items-center gap-2 p-3 hover:bg-muted/50 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                  checked={!!checked[t.id]}
                  onChange={() => handleToggle(t.id)}
                />
                <span className="text-sm flex-1">
                  {t.label}{" "}
                  {t.required ? (
                    <span className="text-primary font-bold">(필수)</span>
                  ) : (
                    <span className="text-muted-foreground/70">(선택)</span>
                  )}
                </span>
                {t.link && (
                  <Link
                    href={t.link}
                    className="text-xs text-muted-foreground/70 hover:text-primary flex items-center"
                  >
                    보기 <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Phone verification */}
        <div className="space-y-3 mb-6 p-4 border rounded-lg bg-muted/30">
          <p className="text-sm font-bold">본인인증</p>
          <p className="text-xs text-muted-foreground">
            데모 인증코드: <span className="font-mono font-bold">123456</span>
          </p>

          <div className="flex gap-2">
            <Input
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={phoneVerified}
              className="h-10"
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0"
              onClick={handleSendCode}
              disabled={phoneVerified || !phone}
            >
              인증번호 발송
            </Button>
          </div>

          {codeSent && !phoneVerified && (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="인증코드 6자리"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-10"
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0"
                onClick={handleVerifyCode}
                disabled={code.length !== 6}
              >
                확인
              </Button>
            </div>
          )}

          {phoneVerified && (
            <p className="text-sm text-green-600 font-medium">
              본인인증 완료
            </p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && !error && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link href="/login" className="flex-1">
            <Button variant="outline" className="w-full h-11">
              취소
            </Button>
          </Link>
          <Button
            className="flex-1 h-11 bg-primary hover:bg-primary/90"
            disabled={!canSubmit || loading}
            onClick={handleComplete}
          >
            {loading ? "처리 중..." : "동의하고 가입"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
