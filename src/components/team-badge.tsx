/* eslint-disable @next/next/no-img-element -- escudos em data URL e URLs externas na demonstração */
"use client";
import { Shield } from "lucide-react";
import type { Team } from "@/types/tournament";

export function TeamBadge({ team, size = "md" }: { team?: Team; size?: "sm" | "md" | "lg" }) {
  const dim = { sm: "h-11 w-11 text-xs", md: "h-16 w-16 text-base", lg: "h-20 w-20 text-lg" }[size];
  return <span className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#ffcc00]/25 bg-gradient-to-br from-[#3b1111] via-[#171717] to-[#4b3904] font-black tracking-tight text-[#ffcc00] ${dim}`}>
    {team?.badge ? <img src={team.badge} alt={`Escudo de ${team.name}`} className="h-full w-full object-cover" />
      : team ? team.shortName.slice(0, 3).toUpperCase() : <Shield size={22} />}
  </span>;
}
