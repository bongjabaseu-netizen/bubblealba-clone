"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/actions/users";

export default function AccountPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfile().then((user) => {
      if (user) {
        setNickname(user.nickname ?? "");
        setEmail(user.email ?? "");
        setRegion(user.region ?? "");
      }
    });
  }, []);

  async function handleSave() {
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.set("nickname", nickname);
    formData.set("region", region);
    const result = await updateProfile(formData);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("저장되었습니다.");
    }
    setLoading(false);
  }

  return (
    <div className="px-15px py-16px space-y-20px">
      <h1 className="font-18sb text-font-black">계정 설정</h1>

      {/* 기본 정보 */}
      <section className="space-y-14px">
        <h2 className="font-15sb text-font-black">기본 정보</h2>
        {message && <p className="font-13rg text-primary">{message}</p>}
        <div className="space-y-12px">
          <div>
            <label className="font-13rg text-font-gray block mb-4px">닉네임</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-44px px-12px rounded-10px border border-line-gray-20 font-15rg text-font-black bg-bg-white focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="font-13rg text-font-gray block mb-4px">이메일</label>
            <input
              value={email}
              type="email"
              disabled
              className="w-full h-44px px-12px rounded-10px border border-line-gray-20 font-15rg text-font-disabled bg-bg-gray-50"
            />
          </div>
          <div>
            <label className="font-13rg text-font-gray block mb-4px">주 활동 지역</label>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full h-44px px-12px rounded-10px border border-line-gray-20 font-15rg text-font-black bg-bg-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="h-44px px-20px rounded-10px bg-primary text-white font-15sb disabled:opacity-50"
        >
          {loading ? "저장 중..." : "저장"}
        </button>
      </section>

      {/* 계정 탈퇴 */}
      <section className="space-y-12px">
        <h2 className="font-15sb text-warn-red">계정 탈퇴</h2>
        <p className="font-13rg text-font-gray">
          탈퇴 시 모든 데이터(포인트/즐겨찾기/채팅 내역)가 삭제되며 복구할 수 없습니다.
        </p>
        <hr className="border-line-gray-20" />
        <button className="h-44px px-20px rounded-10px border border-warn-red font-15rg text-warn-red">
          회원 탈퇴
        </button>
      </section>
    </div>
  );
}
