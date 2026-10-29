import type { Metadata, Viewport } from "next";
import { auth } from "../../auth";
import { DEMO_MODE } from "@/lib/access";
import { Providers } from "@/components/providers";
import { BottomNav, SiteHeader } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copa Halterada 2026 | MaxMZR",
  description: "Placar ao vivo, jogos, modalidades, equipes e artilharia.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080808" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = DEMO_MODE ? null : await auth();
  return <html lang="pt-BR"><body>
    <Providers sessionAdmin={session?.user?.role === "admin"}>
      <div className="mx-auto min-h-dvh max-w-2xl border-x border-[#1b1b1b] bg-[#090909]">
        <SiteHeader/>
        <main className="px-4 pt-7 pb-[calc(112px+env(safe-area-inset-bottom))] sm:px-6">{children}</main>
      </div>
      <BottomNav/>
    </Providers>
  </body></html>;
}
