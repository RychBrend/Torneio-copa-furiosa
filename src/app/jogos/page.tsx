"use client";

import { useMemo, useState } from "react";
import { CalendarDays, GitBranchPlus, FilterX, Settings2 } from "lucide-react";
import { BracketManager } from "@/components/bracket-manager";
import { MatchCard } from "@/components/match-card";
import { Button, Empty, PageTitle, Tag } from "@/components/ui";
import { useTournament } from "@/context/tournament-context";
import { useAdmin } from "@/context/admin-context";
import { PHASES } from "@/types/tournament";

export default function GamesPage() {
  const { matches, teams, sports } = useTournament();
  const { isAdmin } = useAdmin();
  const [date, setDate] = useState("");
  const [phase, setPhase] = useState("");
  const [round, setRound] = useState("");
  const [manage, setManage] = useState(false);
  const rounds = [...new Set(matches.map((m) => m.round))];
  const filtered = useMemo(() => matches.filter((m) =>
    (!date || m.startAt.startsWith(date)) && (!phase || m.phase === phase) && (!round || m.round === round)
  ).sort((a,b) => a.startAt.localeCompare(b.startAt)), [matches,date,phase,round]);
  const groups = PHASES.map((name) => ({ name, games: matches.filter((m) => m.phase === name) }));
  return <div>
    <PageTitle eyebrow="Calendário oficial" title="Jogos" subtitle="Confrontos, resultados e chaveamento" />
    {isAdmin && <Button variant="primary" className="mb-5 w-full" onClick={() => setManage(true)}><Settings2 size={17}/>Gerenciar chaveamento</Button>}
    <div className="mb-6 rounded-2xl border border-[#5a1414] bg-[#120d0d] p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[.17em] text-[#ffcc00]"><CalendarDays size={16}/>Filtros de jogos</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div><label className="field-label" htmlFor="filter-date">Data</label><input id="filter-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field text-xs"/></div>
        <div><label className="field-label" htmlFor="filter-phase">Fase</label><select id="filter-phase" value={phase} onChange={(e) => setPhase(e.target.value)} className="field text-xs"><option value="">Todas</option>{PHASES.map((p) => <option key={p}>{p}</option>)}</select></div>
        <div className="col-span-2 sm:col-span-1"><label className="field-label" htmlFor="filter-round">Rodada</label><select id="filter-round" value={round} onChange={(e) => setRound(e.target.value)} className="field text-xs"><option value="">Todas</option>{rounds.map((r) => <option key={r}>{r}</option>)}</select></div>
      </div>
      {(date || phase || round) && <button onClick={() => { setDate("");setPhase("");setRound(""); }} className="mt-3 flex items-center gap-2 text-xs text-[#ffcc00]"><FilterX size={14}/>Limpar filtros</button>}
    </div>
    <div className="mb-3 flex items-center justify-between"><h2 className="text-base font-black uppercase">Partidas</h2><Tag kind="gold">{filtered.length} jogos</Tag></div>
    <div className="space-y-4">{filtered.length ? filtered.map((m) => <MatchCard compact key={m.id} match={m}/>) : <Empty title="Nenhum jogo encontrado" text="Ajuste a data, a fase ou a rodada selecionada."/>}</div>
    <section className="mt-9"><h2 className="mb-1 flex items-center gap-2 text-lg font-black uppercase"><GitBranchPlus size={20} className="text-[#fe0000]"/>Chaveamento</h2><p className="mb-4 text-xs text-[#929292]">Deslize para visualizar as fases do campeonato.</p>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
        {groups.map(({ name, games }) => <div key={name} className="w-56 shrink-0 snap-start rounded-xl border border-[#383838] bg-[#151515] p-3"><h3 className="mb-3 border-b border-[#fe0000] pb-2 text-xs font-black uppercase text-[#ffcc00]">{name}</h3>{games.length ? games.map((m) => <div key={m.id} className="mb-2 rounded-lg border border-[#333] bg-[#0c0c0c] p-2 text-xs"><p className="flex justify-between gap-2"><span>{teams.find((t) => t.id === m.homeId)?.shortName ?? "?"}</span><strong>{m.status === "scheduled" || m.status === "future" ? "–" : m.homeScore}</strong></p><p className="mt-1 flex justify-between gap-2"><span>{teams.find((t) => t.id === m.awayId)?.shortName ?? "?"}</span><strong>{m.status === "scheduled" || m.status === "future" ? "–" : m.awayScore}</strong></p><p className="mt-2 border-t border-[#333] pt-1 text-[10px] text-[#777]">{sports.find((s) => s.id === m.sportId)?.name} · {m.round}</p></div>) : <p className="text-xs text-[#777]">Nenhum confronto definido.</p>}</div>)}
      </div>
    </section>
    <BracketManager open={manage} onClose={() => setManage(false)}/>
  </div>;
}
