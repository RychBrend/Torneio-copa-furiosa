"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Trophy } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { useTournament } from "@/context/tournament-context";
import { SportIcon } from "@/components/sport-icon";
import { TeamBadge } from "@/components/team-badge";
import { Button, Empty, Modal, PageTitle } from "@/components/ui";
import { newId } from "@/lib/format";
import type { Sport } from "@/types/tournament";

export default function SportsPage() {
  const { sports, teams, standings, saveSport, resetStandings } = useTournament();
  const { isAdmin } = useAdmin();
  const [selectedId, setSelectedId] = useState("handebol");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<Sport["icon"]>("outro");
  const [error, setError] = useState("");
  const selected = sports.find((s) => s.id === selectedId) ?? sports[0];
  const rows = useMemo(() => [...(standings[selected?.id] ?? [])].sort((a,b) =>
    b.points - a.points || (b.goalsFor-b.goalsAgainst) - (a.goalsFor-a.goalsAgainst) || b.goalsFor-a.goalsFor
  ), [standings, selected?.id]);

  const add = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (sports.some((s) => s.name.toLowerCase() === name.trim().toLowerCase())) { setError("Esta modalidade já existe."); return; }
    const id = newId();
    saveSport({ id, name: name.trim(), icon });
    setSelectedId(id); setName(""); setIcon("outro"); setError(""); setOpen(false);
  };
  return <div>
    <PageTitle eyebrow="Esportes do torneio" title="Modalidades" subtitle="Escolha um esporte para ver a classificação" actions={isAdmin ? <Button variant="gold" size="sm" onClick={() => setOpen(true)} aria-label="Adicionar modalidade"><Plus size={17}/><span className="hidden sm:inline">Adicionar</span></Button> : undefined}/>
    <div className="mb-7 grid grid-cols-2 gap-3">{sports.map((sport) => <button key={sport.id} onClick={() => setSelectedId(sport.id)} className={`min-h-32 rounded-2xl border p-4 text-left transition-colors ${sport.id === selected?.id ? "border-[#ffcc00] bg-[#302407]" : "border-[#333] bg-[#151515] hover:border-[#777]"}`}>
      <span className={sport.id === selected?.id ? "text-[#ffcc00]" : "text-[#fe0000]"}><SportIcon icon={sport.icon} size={30}/></span>
      <p className="mt-4 text-sm font-black uppercase tracking-wide">{sport.name}</p>
      <span className="mt-1 block text-[10px] uppercase tracking-widest text-[#999]">Ver classificação</span>
    </button>)}</div>
    {selected ? <section>
      <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-widest text-[#ffcc00]">Tabela de classificação</p><h2 className="mt-1 text-lg font-black uppercase">{selected.name}</h2></div>{isAdmin && <Button size="sm" variant="danger" onClick={() => { if(window.confirm(`Zerar toda a classificação de ${selected.name}? Os jogos já realizados serão mantidos.`)) resetStandings(selected.id); }}><RotateCcw size={14}/>Zerar</Button>}</div>
      <div className="overflow-x-auto rounded-xl border border-[#333]"><table className="w-full min-w-[390px] text-left text-xs"><thead className="bg-[#232323] text-[10px] uppercase tracking-wider text-[#999]"><tr><th className="px-2 py-3">#</th><th className="py-3">Atlética</th><th className="px-2 py-3 text-center text-[#ffcc00]">PTS</th><th className="px-2 py-3 text-center">V</th><th className="px-2 py-3 text-center">D</th><th className="px-2 py-3 text-center">SG</th></tr></thead>
      <tbody>{rows.map((row, i) => { const team = teams.find((t) => t.id === row.teamId);return <tr key={row.teamId} className="border-t border-[#292929] bg-[#111]"><td className="px-2 py-3 font-black text-[#888]">{i+1}</td><td className="py-2"><div className="flex items-center gap-2"><TeamBadge size="sm" team={team}/><span className="max-w-32 truncate font-bold">{team?.name ?? "Equipe removida"}</span></div></td><td className="px-2 py-3 text-center text-base font-black text-[#ffcc00]">{row.points}</td><td className="px-2 py-3 text-center">{row.wins}</td><td className="px-2 py-3 text-center">{row.losses}</td><td className="px-2 py-3 text-center">{row.goalsFor-row.goalsAgainst > 0 ? "+" : ""}{row.goalsFor-row.goalsAgainst}</td></tr>; })}</tbody></table></div>
      <p className="mt-3 text-xs text-[#888]">PTS: pontos · V: vitórias · D: derrotas · SG: saldo. Regra da demonstração: 3 pontos por vitória e 1 por empate.</p>
    </section> : <Empty title="Nenhuma modalidade" text="O administrador pode cadastrar a primeira modalidade."/>}
    <Modal title="Nova modalidade" open={open} onClose={() => setOpen(false)}><form onSubmit={add} className="space-y-4"><div><label className="field-label" htmlFor="sport-name">Nome do esporte *</label><input className="field" id="sport-name" required maxLength={40} placeholder="Ex.: Atletismo" value={name} onChange={(e) => setName(e.target.value)}/></div><div><label htmlFor="sport-icon" className="field-label">Ícone</label><select id="sport-icon" className="field" value={icon} onChange={(e) => setIcon(e.target.value as Sport["icon"])}><option value="outro">Troféu</option><option value="handebol">Handebol</option><option value="futsal">Futsal</option><option value="volei">Vôlei</option><option value="basquete">Basquete</option></select></div>{error && <p role="alert" className="text-sm text-red-400">{error}</p>}<Button type="submit" variant="gold" className="w-full"><Plus size={17}/>Cadastrar modalidade</Button></form></Modal>
  </div>;
}
