"use client";

import { useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useTournament, createEmptyMatch } from "@/context/tournament-context";
import { PHASES, type Match } from "@/types/tournament";
import { Button, Modal } from "@/components/ui";

export function BracketManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { teams, sports, matches, saveMatch, deleteMatch } = useTournament();
  const [draft, setDraft] = useState<Match>(createEmptyMatch);
  const [error, setError] = useState("");
  const update = <K extends keyof Match>(key: K, value: Match[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const reset = () => { setDraft(createEmptyMatch()); setError(""); };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.sportId || !draft.homeId || !draft.awayId || !draft.startAt) { setError("Preencha os campos obrigatórios."); return; }
    if (draft.homeId === draft.awayId) { setError("Selecione duas atléticas diferentes."); return; }
    if (!teams.some((t) => t.id === draft.homeId) || !teams.some((t) => t.id === draft.awayId)) { setError("Atlética inválida."); return; }
    saveMatch({ ...draft, status: new Date(draft.startAt).getTime() > Date.now() + 48 * 60 * 60 * 1000 ? "future" : "scheduled" });
    reset();
  };

  return <Modal open={open} onClose={onClose} title="Gerenciar chaveamento">
    <p className="mb-5 text-sm text-[#a3a3a3]">Defina os confrontos, a fase, a rodada e a data/hora. Partidas iniciadas ou encerradas não podem ser editadas aqui.</p>
    <form onSubmit={submit} className="space-y-4">
      <div><label htmlFor="match-sport" className="field-label">Modalidade *</label><select id="match-sport" className="field" required value={draft.sportId} onChange={(e) => update("sportId", e.target.value)}><option value="">Selecione</option>{sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}</select></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="match-home" className="field-label">Equipe da casa *</label><select id="match-home" className="field" required value={draft.homeId} onChange={(e) => update("homeId", e.target.value)}><option value="">Selecione</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
        <div><label htmlFor="match-away" className="field-label">Equipe visitante *</label><select id="match-away" className="field" required value={draft.awayId} onChange={(e) => update("awayId", e.target.value)}><option value="">Selecione</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="match-phase" className="field-label">Fase *</label><select id="match-phase" className="field" value={draft.phase} onChange={(e) => update("phase", e.target.value as Match["phase"])}>{PHASES.map((phase) => <option key={phase}>{phase}</option>)}</select></div>
        <div><label htmlFor="match-round" className="field-label">Rodada *</label><input id="match-round" className="field" required value={draft.round} maxLength={35} onChange={(e) => update("round",e.target.value)} placeholder="Ex.: 2ª rodada"/></div>
      </div>
      <div><label htmlFor="match-datetime" className="field-label">Data e horário *</label><input id="match-datetime" type="datetime-local" className="field" required value={draft.startAt} onChange={(e) => update("startAt",e.target.value)}/></div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2"><Button variant="gold" type="submit" className="flex-1"><Plus size={17}/>{matches.some((m) => m.id === draft.id) ? "Salvar alterações" : "Adicionar confronto"}</Button>{matches.some((m) => m.id === draft.id) && <Button type="button" onClick={reset}>Cancelar</Button>}</div>
    </form>
    <div className="mt-7 border-t border-[#333] pt-5"><h3 className="mb-3 text-sm font-black uppercase tracking-wide">Confrontos cadastrados ({matches.length})</h3><div className="space-y-2">
      {[...matches].sort((a,b) => a.startAt.localeCompare(b.startAt)).map((m) => <div key={m.id} className="flex items-center justify-between gap-2 rounded-xl border border-[#333] bg-[#0c0c0c] p-3">
        <div className="min-w-0"><p className="truncate text-xs font-bold">{teams.find((t) => t.id === m.homeId)?.shortName ?? "?"} × {teams.find((t) => t.id === m.awayId)?.shortName ?? "?"}</p><p className="mt-1 text-[10px] text-[#888]">{m.phase} · {m.startAt.replace("T"," ")} · {m.status === "scheduled" ? "Agendado" : m.status === "future" ? "Futuro" : m.status === "live" ? "Ao vivo" : "Encerrado"}</p></div>
        {(m.status === "scheduled" || m.status === "future") && <div className="flex shrink-0 gap-1"><button title="Editar confronto" aria-label="Editar confronto" onClick={() => { setDraft({ ...m }); setError(""); }} className="rounded-lg border border-[#444] p-2 text-[#ffcc00]"><Edit3 size={16}/></button><button title="Excluir confronto" aria-label="Excluir confronto" onClick={() => { if(window.confirm("Excluir confronto agendado?")) { deleteMatch(m.id); if(draft.id === m.id) reset(); } }} className="rounded-lg border border-red-900 p-2 text-red-500"><Trash2 size={16}/></button></div>}
      </div>)}
    </div></div>
  </Modal>;
}
