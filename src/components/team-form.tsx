"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import { useTournament } from "@/context/tournament-context";
import { newId } from "@/lib/format";
import type { Athlete, Team } from "@/types/tournament";
import { Button, Modal } from "@/components/ui";
import { TeamBadge } from "@/components/team-badge";

export function TeamForm({ open, onClose, initial }: { open: boolean; onClose: () => void; initial: Team | null }) {
  const { teams, saveTeam } = useTournament();
  const [name, setName] = useState(initial?.name ?? "");
  const [shortName, setShortName] = useState(initial?.shortName ?? "");
  const [badge, setBadge] = useState(initial?.badge ?? "");
  const [athletes, setAthletes] = useState<Athlete[]>(initial?.athletes ?? []);
  const [athleteName, setAthleteName] = useState("");
  const [number, setNumber] = useState("1");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Escolha um arquivo de imagem."); return; }
    if (file.size > 300 * 1024) { setError("Para a demonstração, use uma imagem com até 300 KB."); return; }
    const reader = new FileReader();
    reader.onload = () => { setBadge(String(reader.result)); setError(""); };
    reader.onerror = () => setError("Falha ao carregar a imagem.");
    reader.readAsDataURL(file);
  };
  const addAthlete = () => {
    if (!athleteName.trim()) { setError("Informe o nome do atleta."); return; }
    setAthletes((list) => [...list, { id: newId(), name: athleteName.trim(), number: Math.max(0, Number(number) || 0), position: position.trim() || "Atleta", goals: 0 }]);
    setAthleteName(""); setNumber("1"); setPosition(""); setError("");
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (teams.some((t) => t.id !== initial?.id && t.name.toLowerCase() === name.trim().toLowerCase())) { setError("Já existe uma atlética com esse nome."); return; }
    saveTeam({ id: initial?.id ?? newId(), name: name.trim(), shortName: (shortName.trim() || name.trim().slice(0,3)).toUpperCase().slice(0,5), badge: badge.trim(), athletes });
    onClose();
  };
  return <Modal open={open} onClose={onClose} title={initial ? "Editar atlética" : "Cadastrar atlética"}>
    <form onSubmit={submit} className="space-y-5">
      <div><label className="field-label" htmlFor="team-name">Nome da atlética *</label><input id="team-name" className="field" required maxLength={70} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Atlética Leões"/></div>
      <div><label className="field-label" htmlFor="team-short">Sigla no placar</label><input id="team-short" className="field" maxLength={5} value={shortName} onChange={(e) => setShortName(e.target.value)} placeholder="Ex.: LEO"/></div>
      <div className="space-y-3"><label className="field-label">Identidade visual / escudo</label><div className="flex items-center gap-4"><TeamBadge team={{ id: "preview", name: name || "Atlética", shortName: shortName || "ESC", badge, athletes }} size="lg"/><label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#666] bg-[#1c1c1c] p-4 text-xs font-bold text-[#ffcc00]"><UploadCloud size={18}/>Enviar imagem<input className="sr-only" aria-label="Enviar escudo" type="file" accept="image/*" onChange={upload}/></label></div>
      <div><label className="field-label" htmlFor="team-url">Ou URL pública da imagem</label><input id="team-url" className="field" type="url" placeholder="https://exemplo.com/escudo.png" value={badge.startsWith("data:") ? "" : badge} onChange={(e) => setBadge(e.target.value)}/>{badge.startsWith("data:") && <button type="button" className="mt-2 text-xs text-red-400" onClick={() => setBadge("")}>Remover imagem enviada</button>}</div><p className="text-xs text-[#888]">Imagens ficam no navegador nesta versão. Para produção, use Vercel Blob ou Supabase Storage.</p></div>
      <div className="border-t border-[#333] pt-5"><h3 className="mb-4 font-black uppercase">Elenco / atletas ({athletes.length})</h3><div className="space-y-2">{athletes.map((a) => <div key={a.id} className="flex items-center justify-between gap-2 rounded-xl bg-[#242424] px-3 py-2"><div className="min-w-0"><p className="truncate text-sm font-bold">#{a.number} · {a.name}</p><p className="text-xs text-[#888]">{a.position}</p></div><button type="button" aria-label={`Remover ${a.name}`} onClick={() => setAthletes((list) => list.filter((x) => x.id !== a.id))} className="p-2 text-red-400"><Trash2 size={17}/></button></div>)}</div>
      <div className="mt-4 space-y-2 rounded-xl border border-[#3d3d3d] bg-[#101010] p-3"><p className="text-[11px] font-black uppercase tracking-wide text-[#ffcc00]">Vincular atleta</p><input className="field" aria-label="Nome do atleta" placeholder="Nome completo" maxLength={70} value={athleteName} onChange={(e) => setAthleteName(e.target.value)}/><div className="grid grid-cols-[90px_1fr] gap-2"><input className="field" aria-label="Número do atleta" type="number" min="0" max="999" value={number} onChange={(e) => setNumber(e.target.value)}/><input className="field" aria-label="Posição do atleta" placeholder="Posição (ex.: Goleiro)" maxLength={40} value={position} onChange={(e) => setPosition(e.target.value)}/></div><Button type="button" className="w-full" size="sm" onClick={addAthlete}><Plus size={16}/>Incluir no elenco</Button></div>
      </div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <Button variant="gold" type="submit" className="w-full">{initial ? "Salvar atlética" : "Cadastrar atlética"}</Button>
    </form>
  </Modal>;
}
