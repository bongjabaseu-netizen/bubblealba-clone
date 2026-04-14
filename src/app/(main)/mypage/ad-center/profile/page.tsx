"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdvertiserProfile, upsertAdvertiserProfile } from "@/lib/actions/ads";
import Link from "next/link";

type Profile = Awaited<ReturnType<typeof getAdvertiserProfile>>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAdvertiserProfile().then((p) => {
      setProfile(p);
      setLoading(false);
      if (!p) setEditing(true);
    });
  }, []);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertAdvertiserProfile(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: profile ? "프로필이 수정되었습니다." : "프로필이 등록되었습니다." });
        const updated = await getAdvertiserProfile();
        setProfile(updated);
        setEditing(false);
      }
    });
  }

  if (loading) {
    return (
      <div className="px-15px py-16px">
        <p className="font-13rg text-font-disabled">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">광고프로필</h1>
        <p className="font-13rg text-font-gray">
          {profile ? "사업자 정보를 관리합니다." : "광고 구매를 위해 프로필을 등록하세요."}
        </p>
      </div>

      {/* 기존 프로필 보기 */}
      {profile && !editing && (
        <div className="rounded-14px border border-line-gray-20 p-12px space-y-8px">
          <div className="flex items-center justify-between">
            <span className="font-14sb text-font-black">{profile.businessName}</span>
            {profile.verified && (
              <span className="font-11rg px-6px py-2px rounded-4px bg-green-50 text-green-700">
                인증완료
              </span>
            )}
          </div>
          <InfoRow label="사업자번호" value={profile.businessNumber} />
          <InfoRow label="대표자명" value={profile.representative} />
          <InfoRow label="연락처" value={profile.phone} />
          {profile.address && <InfoRow label="주소" value={profile.address} />}

          <button
            onClick={() => setEditing(true)}
            className="w-full h-button rounded-10px border border-line-gray-50 font-14sb text-font-black mt-8px"
          >
            수정하기
          </button>
        </div>
      )}

      {/* 등록/수정 폼 */}
      {editing && (
        <form action={handleSubmit} className="space-y-12px">
          <Field
            name="businessName"
            label="업체명"
            placeholder="업체명을 입력하세요"
            defaultValue={profile?.businessName ?? ""}
            required
          />
          <Field
            name="businessNumber"
            label="사업자번호"
            placeholder="000-00-00000"
            defaultValue={profile?.businessNumber ?? ""}
            required
          />
          <Field
            name="representative"
            label="대표자명"
            placeholder="대표자 성명"
            defaultValue={profile?.representative ?? ""}
            required
          />
          <Field
            name="phone"
            label="연락처"
            placeholder="010-0000-0000"
            defaultValue={profile?.phone ?? ""}
            required
          />
          <Field
            name="address"
            label="주소 (선택)"
            placeholder="사업장 주소"
            defaultValue={profile?.address ?? ""}
          />

          {message && (
            <div
              className={`rounded-10px px-12px py-10px font-13rg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-button rounded-10px bg-warn-red text-bg-white font-15sb disabled:opacity-40 transition-opacity"
          >
            {isPending ? "저장중..." : profile ? "수정 완료" : "등록하기"}
          </button>

          {profile && (
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setMessage(null);
              }}
              className="w-full h-button rounded-10px border border-line-gray-50 font-14sb text-font-gray"
            >
              취소
            </button>
          )}
        </form>
      )}

      <Link
        href="/mypage/ad-center"
        className="block text-center font-13rg text-font-disabled"
      >
        광고센터로 돌아가기
      </Link>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-13rg text-font-gray">{label}</span>
      <span className="font-13rg text-font-black">{value}</span>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-13rg text-font-gray mb-4px block">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full h-44px rounded-10px border border-line-gray-50 px-12px font-14rg text-font-black bg-bg-white placeholder:text-font-disabled"
      />
    </div>
  );
}
