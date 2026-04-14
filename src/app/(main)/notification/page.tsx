"use client";

import { useEffect, useState } from "react";
import { Bell, Briefcase, MessageCircle, Heart, Settings } from "lucide-react";
import { getNotifications, markRead, markAllRead } from "@/lib/actions/notifications";

const TYPE_META: Record<string, { icon: typeof Bell; label: string; color: string }> = {
  APPLY: { icon: Briefcase, label: "신청", color: "bg-link-blue/10 text-link-blue" },
  MESSAGE: { icon: MessageCircle, label: "메시지", color: "bg-good-green/10 text-good-green" },
  LIKE: { icon: Heart, label: "좋아요", color: "bg-warn-red/10 text-warn-red" },
  SYSTEM: { icon: Settings, label: "시스템", color: "bg-bg-gray-50 text-font-gray" },
};

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifications(data as Notification[]);
      setLoaded(true);
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkAllRead() {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    window.dispatchEvent(new Event("notifications-updated"));
  }

  async function handleClick(id: string) {
    await markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    window.dispatchEvent(new Event("notifications-updated"));
  }

  return (
    <>
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between px-15px mt-12px">
        <div>
          <span className="font-14rg text-font-gray">
            읽지 않은 알림 <span className="font-14sb text-warn-red">{unreadCount}</span>개
          </span>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="font-13rg text-link-blue active-bg px-8px py-4px rounded-6px"
        >
          모두 읽음
        </button>
      </div>

      {/* 알림 리스트 */}
      <ul className="mt-8px">
        {notifications.map((notif) => {
          const meta = TYPE_META[notif.type] ?? TYPE_META.SYSTEM;
          const Icon = meta.icon;
          return (
            <li
              key={notif.id}
              className={`active-bg-opacity border-b border-line-gray-20 ${!notif.read ? "bg-link-blue/5" : ""}`}
              onClick={() => handleClick(notif.id)}
            >
              <div className="flex items-start gap-12px p-15px">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-5px">
                    <span className="font-14sb text-font-black">{notif.title}</span>
                    <span className="font-10rg text-font-disabled">{meta.label}</span>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-warn-red ml-auto shrink-0" />}
                  </div>
                  <p className="font-13rg text-font-gray mt-3px">{notif.body}</p>
                  <p className="font-12rg text-font-disabled mt-3px">{relativeTime(new Date(notif.createdAt))}</p>
                </div>
              </div>
            </li>
          );
        })}
        {loaded && notifications.length === 0 && (
          <li className="p-15px text-center">
            <Bell className="w-10 h-10 text-font-disabled mx-auto mb-8px" />
            <p className="font-14rg text-font-disabled">알림이 없습니다</p>
          </li>
        )}
      </ul>
    </>
  );
}
