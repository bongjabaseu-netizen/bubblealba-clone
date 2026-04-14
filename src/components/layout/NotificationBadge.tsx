"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getUnreadCount } from "@/lib/actions/notifications";

export function NotificationBadge() {
  const { status } = useSession();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    getUnreadCount().then(setCount);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    // Initial fetch
    refresh();

    // Poll every 30 seconds
    const interval = setInterval(refresh, 30000);

    // 알림 읽음 이벤트 수신 — 즉시 갱신
    const handler = () => refresh();
    window.addEventListener("notifications-updated", handler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-updated", handler);
    };
  }, [status, refresh]);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-warn-red text-bg-white text-[10px] font-bold flex items-center justify-center px-1">
      {count > 99 ? "99+" : count}
    </span>
  );
}
