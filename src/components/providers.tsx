"use client";

/**
 * 테마(dark/light) + 뷰포트(pc/app) 상태 관리
 *
 * 앱 뷰 접근 방식: IFRAME 기반 시뮬레이터
 * - iframe 은 자체 viewport(430px) 를 가져서 Tailwind `sm:/md:/lg:` 응답이 정확히 작동
 * - 부모 창은 배경 + 전화기 프레임 + 외부 컨트롤만 렌더
 * - iframe 내부는 `?__embed=1&theme=...` URL 파라미터로 embed 모드 인식
 * - embed 모드에선 ModeToggle 숨김 (무한 재귀 방지)
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Monitor, Sun, Moon } from "lucide-react";

export type Theme = "light" | "dark";
export type Viewport = "pc" | "app";

interface UiState {
  theme: Theme;
  viewport: Viewport;
  isEmbed: boolean;
  setTheme: (t: Theme) => void;
  setViewport: (v: Viewport) => void;
}

const UiContext = createContext<UiState | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ProvidersInner>{children}</ProvidersInner>
    </SessionProvider>
  );
}

function ProvidersInner({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [viewport, setViewportState] = useState<Viewport>("pc");
  const [hydrated, setHydrated] = useState(false);
  const [isEmbed, setIsEmbed] = useState(false);

  const pathname = usePathname();

  // 초기 로드 — window.location 으로 __embed 감지 (Suspense 불필요)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const embed = params.get("__embed") === "1";
    setIsEmbed(embed);

    if (embed) {
      const urlTheme = (params.get("theme") as Theme) || "light";
      setThemeState(urlTheme);
      document.documentElement.classList.toggle("dark", urlTheme === "dark");
      setHydrated(true);
      return;
    }

    // 부모 창: localStorage 복원
    const storedTheme = (localStorage.getItem("bubble-theme") as Theme) || "light";
    const storedViewport =
      (localStorage.getItem("bubble-viewport") as Viewport) || "pc";
    setThemeState(storedTheme);
    setViewportState(storedViewport);
    setHydrated(true);
  }, []);

  // 테마/뷰포트 반영 (부모 창만)
  useEffect(() => {
    if (!hydrated || isEmbed) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("bubble-theme", theme);
    localStorage.setItem("bubble-viewport", viewport);
  }, [theme, viewport, hydrated, isEmbed]);

  const ctxValue: UiState = {
    theme,
    viewport,
    isEmbed,
    setTheme: setThemeState,
    setViewport: setViewportState,
  };

  // embed 모드: 자식만 렌더 (iframe 내부)
  if (isEmbed) {
    return (
      <UiContext.Provider value={ctxValue}>
        <div className="min-h-screen flex flex-col">{children}</div>
      </UiContext.Provider>
    );
  }

  // 하이드레이션 전: 자식 그대로 (SSR 일관성)
  if (!hydrated) {
    return (
      <UiContext.Provider value={ctxValue}>
        <div className="min-h-screen flex flex-col">{children}</div>
      </UiContext.Provider>
    );
  }

  // 앱 뷰: iframe 시뮬레이터
  if (viewport === "app") {
    const src = `${pathname}?__embed=1&theme=${theme}`;
    return (
      <UiContext.Provider value={ctxValue}>
        <div className="app-simulator">
          {/* 외부 컨트롤 */}
          <div className="app-simulator__toolbar">
            <button
              onClick={() => setThemeState(theme === "light" ? "dark" : "light")}
              aria-label="테마 전환"
            >
              {theme === "light" ? (
                <Sun className="w-3.5 h-3.5" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
              {theme === "light" ? "라이트" : "다크"}
            </button>
            <button onClick={() => setViewportState("pc")} aria-label="PC 버전">
              <Monitor className="w-3.5 h-3.5" />
              PC
            </button>
          </div>
          {/* 전화기 프레임 */}
          <div className="app-simulator__phone">
            <div className="app-simulator__notch" />
            <iframe
              key={`${pathname}-${theme}`}
              src={src}
              className="app-simulator__iframe"
              title="App preview"
            />
          </div>
        </div>
      </UiContext.Provider>
    );
  }

  // PC 뷰: 일반 렌더
  return (
    <UiContext.Provider value={ctxValue}>
      <div className="min-h-screen flex flex-col">{children}</div>
    </UiContext.Provider>
  );
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within Providers");
  return ctx;
}
