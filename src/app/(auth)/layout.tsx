import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex-1 flex flex-col bg-muted/30">
      <header className="h-14 border-b border-border bg-background flex items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/logo/logo-main.png" alt="명품알바" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg text-foreground">명품알바</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
