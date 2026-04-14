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
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            B
          </div>
          <span className="font-bold text-lg text-foreground">버블알바</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
