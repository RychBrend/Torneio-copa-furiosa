"use client";

import { useState } from "react";
import { ArrowRight, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { useTournament } from "@/context/tournament-context";
import { TeamBadge } from "@/components/team-badge";
import { TeamForm } from "@/components/team-form";
import { Button, Modal, PageTitle, Tag } from "@/components/ui";
import type { Team } from "@/types/tournament";

export default function TeamsPage() {
  const { teams, deleteTeam } = useTournament();
  const { isAdmin } = useAdmin();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Team | null | undefined>(undefined); // undefined = modal fechado
  const selected = teams.find((t) => t.id === selectedId);
  return <div>
    <PageTitle eyebrow="Atléticas participantes" title="Equipes" subtitle={`${teams.length} atléticas inscritas no campeonato`} actions={isAdmin ? <Button variant="gold" size="sm" onClick={() => setEditing(null)}><Plus size={16}/><span className="hidden sm:inline">Cadastrar</span></Button> : undefined}/>
    <div className="grid grid-cols-2 gap-3">{teams.map((team) => <button key={team.id} onClick={() => setSelectedId(team.id)} className="panel flex min-h-48 flex-col items-center justify-center gap-3 p-4 text-center transition-colors hover:border-[#ffcc00]"><TeamBadge team={team} size="lg"/><p className="line-clamp-2 text-sm font-black uppercase">{team.name}</p><span className="flex items-center gap-1 text-[11px] font-bold text-[#ffcc00]">Ver elenco <ArrowRight size={13}/></span></button>)}</div>
    <Modal open={!!selected} onClose={() => setSelectedId(null)} title={selected?.name ?? "Atlética"}>
      {selected && <div>
        <div className="mb-6 flex items-center gap-4"><TeamBadge team={selected} size="lg"/><div><Tag kind="gold">{selected.shortName}</Tag><p className="mt-2 text-sm text-[#aaa]">{selected.athletes.length} atletas vinculados</p></div></div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase"><Users size={17} className="text-[#fe0000]"/>Elenco de atletas</h3>
        <div className="space-y-2">{selected.athletes.length ? selected.athletes.map((a) => <div key={a.id} className="flex items-center gap-3 rounded-xl border border-[#333] bg-[#0d0d0d] p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#332906] font-black text-[#ffcc00]">{a.number}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{a.name}</p><p className="text-xs text-[#888]">{a.position}</p></div><Tag kind="gold">{a.goals} gols</Tag></div>) : <p className="text-sm text-[#999]">Elenco ainda não cadastrado.</p>}</div>
        {isAdmin && <div className="mt-5 flex gap-2"><Button variant="gold" className="flex-1" onClick={() => { setEditing(selected); setSelectedId(null); }}><Pencil size={16}/>Editar / atletas</Button><Button variant="danger" aria-label="Excluir atlética" onClick={() => { if(window.confirm(`Excluir ${selected.name} e todos os seus confrontos? Esta ação não pode ser desfeita.`)) { deleteTeam(selected.id);setSelectedId(null); } }}><Trash2 size={17}/></Button></div>}
      </div>}
    </Modal>
    {editing !== undefined && <TeamForm key={editing?.id ?? "new"} open initial={editing} onClose={() => setEditing(undefined)}/>}
  </div>;
}
