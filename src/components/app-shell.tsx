"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, LogIn, LogOut, Radio, Shield, Target, Trophy } from "lucide-react";
import { signOut } from "next-auth/react";
import { useAdmin } from "@/context/admin-context";
import { useTournament } from "@/context/tournament-context";

const tabs = [
  { href: "/", label: "Ao vivo", Icon: Radio },
  { href: "/jogos", label: "Jogos", Icon: CalendarDays },
  { href: "/modalidades", label: "Modalidades", Icon: Trophy },
  { href: "/equipes", label: "Equipes", Icon: Shield },
  { href: "/artilharia", label: "Artilharia", Icon: Target },
];

export function SiteHeader() {
  const { isAdmin, demoMode } = useAdmin();
  const { matches } = useTournament();
  const live = matches.filter((m) => m.status === "live").length;
  return <div className="border-b border-[#262626] bg-[#0a0a0a] px-4 pt-5 pb-4 sm:px-6">
    <div className="flex items-center justify-between gap-3">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#fe0000] bg-[#250000] text-xl font-black italic text-[#ffcc00]">M<span className="absolute -bottom-1 -right-1 rounded-sm bg-[#ffcc00] px-1 text-[9px] not-italic text-black">26</span></div>
        <div className="min-w-0"><p className="truncate text-[10px] font-bold uppercase tracking-[.18em] text-[#9ca3af]">Torneio • Edição 2026</p><p className="truncate text-[19px] font-black uppercase leading-tight tracking-tight">Copa Halterada</p></div>
      </Link>
      <div className="shrink-0 text-right"><span className="inline-flex items-center gap-1.5 text-xs font-black text-[#ffcc00]"><span className={`h-2 w-2 rounded-full ${live > 0 ? "live-dot bg-[#fe0000]" : "bg-[#555]"}`} />{live > 0 ? "AO VIVO" : "SEM JOGO"}</span><p className="mt-1 text-[10px] uppercase tracking-wider text-[#777]">{isAdmin ? (demoMode ? "ADM · DEMO" : "ADMIN") : "ACESSO PÚBLICO"}</p></div>
    </div>
  </div>;
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, demoMode, logoutDemo } = useAdmin();
  const logout = async () => {
    if (demoMode) { logoutDemo(); router.push("/"); }
    else await signOut({ redirectTo: "/" });
  };
  return <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#fe0000] bg-[#090909]/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
    <div className="relative mx-auto max-w-2xl px-1 pt-2">
      {isAdmin && <button onClick={logout} aria-label="Sair do administrador" className="absolute -top-8 right-3 inline-flex items-center gap-1 rounded-t-lg border-x border-t border-[#3a3a3a] bg-[#151515] px-3 py-1.5 text-[10px] font-semibold text-[#aaa]"><LogOut size={12}/>Sair</button>}
      <div className="grid grid-cols-5 gap-0">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" || pathname === "/ao-vivo" : pathname.startsWith(href);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex flex-col items-center gap-1.5 rounded-xl px-1 pt-2 pb-3 text-[10px] font-bold transition-colors sm:text-xs ${active ? "bg-[#2a0909] text-[#ffcc00]" : "text-[#858585] hover:text-white"}`}>
            <Icon size={23} strokeWidth={active ? 2.5 : 1.9} className={active ? "text-[#fe0000]" : ""} />
            <span className="truncate">{label}</span>
          </Link>;
        })}
      </div>
      {!isAdmin && <Link href="/login" aria-label="Login do administrador" className="absolute -top-8 right-3 inline-flex items-center gap-1 rounded-t-lg border-x border-t border-[#333] bg-[#151515] px-3 py-1.5 text-[10px] text-[#888]"><LogIn size={12}/>ADM</Link>}
    </div>
  </nav>;
}
