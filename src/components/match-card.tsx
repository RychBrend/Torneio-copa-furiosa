"use client";

import { CalendarDays, Flag, Minus, Plus, Radio } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { useTournament } from "@/context/tournament-context";
import { dateLabel, timeLabel } from "@/lib/format";
import type { Match } from "@/types/tournament";
import { Button, Tag } from "@/components/ui";
import { TeamBadge } from "@/components/team-badge";

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const { teams, sports, changeScore, changeCard, finishMatch, startMatch } = useTournament();
  const { isAdmin } = useAdmin();
  const home = teams.find((team) => team.id === match.homeId);
  const away = teams.find((team) => team.id === match.awayId);
  const sport = sports.find((item) => item.id === match.sportId);
  const live = match.status === "live";
  const finished = match.status === "finished";
  const future = match.status === "future";

  return <article className="panel overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#303030] bg-[#1b1b1b] px-4 py-3">
      <div><p className="text-[10px] font-black uppercase tracking-[.17em] text-[#ffcc00]">{sport?.name ?? "Modalidade"} · {match.phase}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-[#bbb]"><CalendarDays size={13}/>{dateLabel(match.startAt)} · {timeLabel(match.startAt)}</p></div>
      {live ? <Tag kind="live"><Radio size={12}/> Ao vivo</Tag> : finished ? <Tag>Encerrado</Tag> : <Tag kind="gold">{future ? "Futuro" : "Agendado"}</Tag>}
    </div>
    <div className={`px-3 ${compact ? "py-5" : "py-6"}`}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge team={home} size={compact ? "sm" : "lg"}/><p className="min-h-8 text-xs font-black uppercase leading-tight sm:text-sm">{home?.name ?? "Equipe"}</p></div>
        <div className="flex flex-col items-center justify-center gap-2 pt-2">
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && live && <ScoreButtons plus={() => changeScore(match.id,"home",1)} minus={() => changeScore(match.id,"home",-1)} />}
            <strong className={`font-black tabular-nums tracking-tighter text-white ${compact ? "text-4xl" : "text-5xl sm:text-6xl"}`}>{match.status === "scheduled" || future ? "–" : match.homeScore}</strong>
            <span className="-mt-1 text-2xl font-black text-[#fe0000]">:</span>
            <strong className={`font-black tabular-nums tracking-tighter text-white ${compact ? "text-4xl" : "text-5xl sm:text-6xl"}`}>{match.status === "scheduled" || future ? "–" : match.awayScore}</strong>
            {isAdmin && live && <ScoreButtons plus={() => changeScore(match.id,"away",1)} minus={() => changeScore(match.id,"away",-1)} />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#777]">{match.round}</span>
        </div>
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge team={away} size={compact ? "sm" : "lg"}/><p className="min-h-8 text-xs font-black uppercase leading-tight sm:text-sm">{away?.name ?? "Equipe"}</p></div>
      </div>
    </div>
    {(live || isAdmin) && <div className="border-t border-[#333] px-4 py-3">
      {live && <div className="mb-3 flex items-center justify-between text-[11px] text-[#999]"><span>Cartões: <span className="font-bold text-[#ffcc00]">{match.homeCards.yellow}A</span> · <span className="text-red-500">{match.homeCards.red}V</span></span><span>Cartões: <span className="font-bold text-[#ffcc00]">{match.awayCards.yellow}A</span> · <span className="text-red-500">{match.awayCards.red}V</span></span></div>}
      {isAdmin && live && <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <CardEditor label="Casa" matchId={match.id} side="home" onCard={changeCard}/>
          <CardEditor label="Fora" matchId={match.id} side="away" onCard={changeCard}/>
        </div>
        <Button variant="danger" className="w-full" onClick={() => {
          if (window.confirm("Encerrar a partida? O resultado será lançado na classificação.")) finishMatch(match.id);
        }}><Flag size={16}/>Encerrar partida</Button>
      </div>}
      {isAdmin && (match.status === "scheduled" || future) && <Button variant="gold" size="sm" className="w-full" onClick={() => startMatch(match.id)}><Radio size={15}/>Iniciar partida</Button>}
    </div>}
  </article>;
}

function ScoreButtons({ plus, minus }: { plus: () => void; minus: () => void }) {
  return <div className="flex flex-col gap-1.5">
    <button aria-label="Adicionar gol" onClick={plus} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffcc00] text-black"><Plus size={17} strokeWidth={3}/></button>
    <button aria-label="Remover gol" onClick={minus} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#555] bg-[#252525] text-white"><Minus size={17} strokeWidth={3}/></button>
  </div>;
}
function CardEditor({ label, matchId, side, onCard }: {
  label: string; matchId: string; side: "home" | "away";
  onCard: (id: string, side: "home" | "away", color: "yellow" | "red", by: number) => void;
}) {
  return <div className="rounded-xl border border-[#333] bg-[#0d0d0d] p-2">
    <p className="mb-2 text-center text-[10px] font-black uppercase tracking-wider text-[#999]">Cartão · {label}</p>
    <div className="grid grid-cols-2 gap-2">{(["yellow","red"] as const).map((color) =>
      <div key={color} className="flex flex-col items-center gap-1">
        <button aria-label={`Aplicar cartão ${color === "yellow" ? "amarelo" : "vermelho"} à equipe ${label}`} onClick={() => onCard(matchId,side,color,1)} className={`flex h-8 w-full items-center justify-center rounded-md ${color === "yellow" ? "bg-[#ffcc00] text-black" : "bg-[#fe0000] text-white"}`}><span className="h-5 w-3 rounded-[2px] border border-current bg-current opacity-80"/></button>
        <button aria-label={`Desfazer último cartão ${color === "yellow" ? "amarelo" : "vermelho"} da equipe ${label}`} onClick={() => onCard(matchId,side,color,-1)} className="w-full rounded-md border border-[#444] py-0.5 text-xs text-[#aaa]">− desfazer</button>
      </div>
    )}</div>
  </div>;
}
