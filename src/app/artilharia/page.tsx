"use client";

import { Crown, Minus, Plus, Target, UserRound } from "lucide-react";
import { useTournament } from "@/context/tournament-context";
import { useAdmin } from "@/context/admin-context";
import { PageTitle, Tag } from "@/components/ui";

export default function ScorersPage() {
  const { teams, changeAthleteGoals } = useTournament();
  const { isAdmin } = useAdmin();
  const scorers = teams.flatMap((team) => team.athletes.map((athlete) => ({ ...athlete, teamId: team.id, teamName: team.name })))
    .sort((a,b) => b.goals - a.goals || a.name.localeCompare(b.name, "pt-BR"));
  return <div>
    <PageTitle eyebrow="Ranking de atletas" title="Artilharia" subtitle="Os maiores pontuadores do campeonato" actions={<div className="mt-1 rounded-xl border border-[#ffcc00]/40 bg-[#2c2204] p-2 text-[#ffcc00]"><Target size={23}/></div>}/>
    <div className="mb-4 flex items-center justify-between"><p className="text-xs text-[#999]">Classificação individual</p><Tag kind="gold">{scorers.length} atletas</Tag></div>
    <div className="space-y-2">{scorers.map((scorer,i) => <article key={scorer.id} className={`flex items-center gap-3 rounded-2xl border px-3 py-4 ${i === 0 ? "border-[#ffcc00]/70 bg-[#2e2408]" : "border-[#303030] bg-[#161616]"}`}>
      <span className={`w-8 shrink-0 text-center text-base font-black ${i < 3 ? "text-[#ffcc00]" : "text-[#7c7c7c]"}`}>{i+1}º{i === 0 && <Crown size={15} className="mx-auto mt-1"/>}</span>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#555] bg-[#292929] text-[#aaa]"><UserRound size={22}/></span>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{scorer.name}</p><p className="mt-1 truncate text-xs text-[#999]">{scorer.teamName}</p></div>
      <div className="text-right"><strong className="block text-2xl font-black tabular-nums text-[#ffcc00]">{scorer.goals}</strong><span className="text-[10px] font-bold uppercase tracking-widest text-[#777]">Gols</span></div>
      {isAdmin && <div className="ml-1 flex flex-col gap-1"><button aria-label={`Adicionar gol de ${scorer.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffcc00] text-black" onClick={() => changeAthleteGoals(scorer.teamId,scorer.id,1)}><Plus size={17}/></button><button aria-label={`Remover gol de ${scorer.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#555] bg-[#2a2a2a]" onClick={() => changeAthleteGoals(scorer.teamId,scorer.id,-1)}><Minus size={17}/></button></div>}
    </article>)}</div>
    <p className="mt-5 text-xs leading-relaxed text-[#888]">Os gols individuais são gerenciados separadamente do placar da partida. A associação de cada gol a um atleta pode ser automatizada com eventos de partida na futura API.</p>
  </div>;
}
