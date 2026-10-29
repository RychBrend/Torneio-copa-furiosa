"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Radio, RotateCcw, Trophy } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { useTournament } from "@/context/tournament-context";
import { MatchCard } from "@/components/match-card";
import { Button, Empty, PageTitle, Tag } from "@/components/ui";

export default function LivePage() {
  const { matches, restoreDemo } = useTournament();
  const { isAdmin, demoMode } = useAdmin();
  const live = matches.filter((m) => m.status === "live");
  const next = matches.filter((m) => m.status === "scheduled" || m.status === "future").sort((a,b) => a.startAt.localeCompare(b.startAt))[0];
  return <div>
    <PageTitle eyebrow="Copa Halterada · Edição 2026" title="Ao vivo" subtitle="Placares oficiais acontecendo agora" actions={<div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl border border-[#fe0000] bg-[#2a0909] text-[#fe0000]"><Radio size={22}/></div>}/>
    <div className="mb-6 flex items-center justify-between border-l-4 border-[#fe0000] bg-[#171717] px-4 py-4"><div className="flex items-center gap-2 font-extrabold"><span className="live-dot h-2.5 w-2.5 rounded-full bg-[#fe0000]" />{live.length} {live.length === 1 ? "partida ao vivo" : "partidas ao vivo"}</div><Tag kind="gold">AGORA</Tag></div>
    <div className="space-y-4">{live.length > 0 ? live.map((match) => <MatchCard key={match.id} match={match}/>) : <Empty title="Nenhuma partida ao vivo" text="Confira a agenda para saber os próximos confrontos."/>}</div>
    <Link href="/jogos" className="mt-6 flex items-center justify-between rounded-xl border border-[#ffcc00]/50 bg-[#211b0c] px-4 py-4 font-black uppercase tracking-wide text-[#ffcc00] hover:bg-[#2f260b]"><span className="flex items-center gap-3"><Trophy size={20}/>Todos os jogos</span><ArrowRight size={19}/></Link>
    {next && <div className="panel mt-7 p-4"><p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.14em] text-[#ffcc00]"><Clock3 size={15}/>Próxima partida</p><p className="text-sm text-[#ccc]">{next.startAt.slice(8,10)}/{next.startAt.slice(5,7)} · {next.startAt.slice(11,16)} — acompanhe pela aba Jogos.</p></div>}
    {isAdmin && demoMode && <Button variant="ghost" className="mt-6 w-full text-xs" onClick={() => { if (window.confirm("Restaurar todos os dados da demonstração?")) restoreDemo(); }}><RotateCcw size={14}/>Restaurar dados de demonstração</Button>}
  </div>;
}
