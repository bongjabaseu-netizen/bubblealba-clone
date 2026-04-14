"use client";

import { useUi } from "@/components/providers";
import { Sun, Moon, Monitor, Smartphone } from "lucide-react";

export function ModeToggle() {
  const { theme, viewport, setTheme, setViewport } = useUi();

  return (
    <div className="flex items-center gap-1.5">
      {/* 테마 토글 */}
      <div className="flex items-center bg-muted dark:bg-zinc-800 rounded-full p-0.5">
        <button
          onClick={() => setTheme("light")}
          aria-label="라이트 모드"
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
            theme === "light"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          aria-label="다크 모드"
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
            theme === "dark"
              ? "bg-zinc-900 text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 뷰포트 토글 */}
      <div className="hidden sm:flex items-center bg-muted dark:bg-zinc-800 rounded-full p-0.5">
        <button
          onClick={() => setViewport("pc")}
          aria-label="PC 버전"
          className={`flex items-center gap-1 px-2 h-7 rounded-full text-xs font-medium transition-all ${
            viewport === "pc"
              ? "bg-background text-primary shadow-sm dark:bg-zinc-900"
              : "text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          PC
        </button>
        <button
          onClick={() => setViewport("app")}
          aria-label="앱 버전"
          className={`flex items-center gap-1 px-2 h-7 rounded-full text-xs font-medium transition-all ${
            viewport === "app"
              ? "bg-background text-primary shadow-sm dark:bg-zinc-900"
              : "text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          앱
        </button>
      </div>
    </div>
  );
}
