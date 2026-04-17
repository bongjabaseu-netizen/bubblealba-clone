import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "명품알바 - PREMIUM ALBA",
  description: "명품알바 — 대한민국 No.1 프리미엄 구인구직 플랫폼",
  openGraph: {
    title: "명품알바 - PREMIUM ALBA",
    description: "명품알바 — 대한민국 No.1 프리미엄 구인구직 플랫폼",
    images: [{ url: "/logo/logo-main.png", width: 1200, height: 1200 }],
    siteName: "명품알바",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "명품알바 - PREMIUM ALBA",
    description: "명품알바 — 대한민국 No.1 프리미엄 구인구직 플랫폼",
    images: ["/logo/logo-main.png"],
  },
  icons: { icon: "/logo/logo-main.png", apple: "/logo/logo-main.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
