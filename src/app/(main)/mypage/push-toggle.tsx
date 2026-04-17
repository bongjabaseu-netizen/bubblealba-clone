"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";

export function PushToggle() {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // 브라우저 알림 API 지원 여부
    if (!("Notification" in window)) {
      setSupported(false);
      return;
    }
    setEnabled(Notification.permission === "granted");
  }, []);

  async function handleToggle() {
    if (!supported) return;

    if (!enabled) {
      // 알림 권한 요청
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setEnabled(true);
        new Notification("명품알바", {
          body: "푸시 알림이 활성화되었습니다.",
          icon: "/favicon.ico",
        });
      }
    } else {
      // 브라우저 API로는 권한 취소 불가 — UI만 토글
      setEnabled(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-between w-full px-15px h-44px active-bg"
    >
      <div className="flex items-center gap-10px">
        {enabled ? (
          <Bell className="h-18px w-18px text-font-gray" strokeWidth={2} />
        ) : (
          <BellOff className="h-18px w-18px text-font-gray" strokeWidth={2} />
        )}
        <span className="font-15rg text-font-black">푸시알림</span>
        {!supported && <span className="font-10rg text-font-disabled">(미지원)</span>}
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? "bg-good-green" : "bg-line-gray-50"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-bg-white transition-all ${enabled ? "right-0.5" : "left-0.5"}`} />
      </div>
    </button>
  );
}
