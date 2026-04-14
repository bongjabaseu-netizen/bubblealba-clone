"use client";

import { Moon, Sun } from "lucide-react";
import { useUi } from "@/components/providers";

export function ThemeToggle() {
  const { theme, setTheme } = useUi();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-between w-full px-15px h-44px active-bg"
    >
      <div className="flex items-center gap-10px">
        {isDark ? (
          <Sun className="h-18px w-18px text-font-gray" strokeWidth={2} />
        ) : (
          <Moon className="h-18px w-18px text-font-gray" strokeWidth={2} />
        )}
        <span className="font-15rg text-font-black">다크모드</span>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? "bg-good-green" : "bg-line-gray-50"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-bg-white transition-all ${isDark ? "right-0.5" : "left-0.5"}`} />
      </div>
    </button>
  );
}
