"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addResult, emptyStanding, makeSeed } from "@/data/seed";
import { newId } from "@/lib/format";
import type { Match, Sport, Team, TournamentData } from "@/types/tournament";

const KEY = "maxmzr-torneios-demo-v1";
type Side = "home" | "away";
type CardColor = "yellow" | "red";

interface TournamentStore extends TournamentData {
  saveTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  saveSport: (sport: Sport) => void;
  resetStandings: (sportId: string) => void;
  saveMatch: (match: Match) => void;
  deleteMatch: (id: string) => void;
  changeScore: (id: string, side: Side, by: number) => void;
  changeCard: (id: string, side: Side, color: CardColor, by: number) => void;
  startMatch: (id: string) => void;
  finishMatch: (id: string) => void;
  changeAthleteGoals: (teamId: string, athleteId: string, by: number) => void;
  restoreDemo: () => void;
}
const Context = createContext<TournamentStore | null>(null);

function isSavedData(x: unknown): x is TournamentData {
  if (!x || typeof x !== "object") return false;
  const d = x as Partial<TournamentData>;
  return Array.isArray(d.teams) && Array.isArray(d.sports) &&
    Array.isArray(d.matches) && !!d.standings && typeof d.standings === "object";
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<TournamentData>(makeSeed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isSavedData(parsed)) setData(parsed);
      }
    } catch { /* localStorage indisponível: dados em memória */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(data)); }
    catch { /* ex.: limite de armazenamento atingido */ }
  }, [data, hydrated]);

  const store = useMemo<TournamentStore>(() => ({
    ...data,
    saveTeam(team) {
      setData((d) => {
        const exists = d.teams.some((t) => t.id === team.id);
        return {
          ...d,
          teams: exists ? d.teams.map((t) => t.id === team.id ? team : t) : [...d.teams, team],
          standings: exists ? d.standings : Object.fromEntries(
            Object.entries(d.standings).map(([sportId, rows]) =>
              [sportId, [...rows, emptyStanding(team.id)]])
          ),
        };
      });
    },
    deleteTeam(id) {
      setData((d) => ({
        ...d,
        teams: d.teams.filter((t) => t.id !== id),
        matches: d.matches.filter((m) => m.homeId !== id && m.awayId !== id),
        standings: Object.fromEntries(Object.entries(d.standings).map(([sportId, rows]) =>
          [sportId, rows.filter((r) => r.teamId !== id)])),
      }));
    },
    saveSport(sport) {
      setData((d) => ({
        ...d,
        sports: [...d.sports, sport],
        standings: { ...d.standings, [sport.id]: d.teams.map((t) => emptyStanding(t.id)) },
      }));
    },
    resetStandings(sportId) {
      setData((d) => ({ ...d, standings: {
        ...d.standings, [sportId]: d.teams.map((t) => emptyStanding(t.id)),
      } }));
    },
    saveMatch(match) {
      setData((d) => ({ ...d, matches: d.matches.some((m) => m.id === match.id)
        ? d.matches.map((m) => m.id === match.id ? match : m)
        : [...d.matches, match] }));
    },
    deleteMatch(id) {
      setData((d) => ({ ...d, matches: d.matches.filter((m) => m.id !== id) }));
    },
    changeScore(id, side, by) {
      setData((d) => ({ ...d, matches: d.matches.map((m) => {
        if (m.id !== id || m.status !== "live") return m;
        return side === "home"
          ? { ...m, homeScore: Math.max(0, m.homeScore + by) }
          : { ...m, awayScore: Math.max(0, m.awayScore + by) };
      }) }));
    },
    changeCard(id, side, color, by) {
      setData((d) => ({ ...d, matches: d.matches.map((m) => {
        if (m.id !== id || m.status !== "live") return m;
        const field = side === "home" ? "homeCards" : "awayCards";
        return { ...m, [field]: { ...m[field], [color]: Math.max(0, m[field][color] + by) } };
      }) }));
    },
    startMatch(id) {
      setData((d) => ({ ...d, matches: d.matches.map((m) =>
        m.id === id && (m.status === "scheduled" || m.status === "future") ? { ...m, status: "live" } : m
      ) }));
    },
    finishMatch(id) {
      setData((d) => {
        const match = d.matches.find((m) => m.id === id && m.status === "live");
        if (!match) return d;
        return {
          ...d,
          matches: d.matches.map((m) => m.id === id ? { ...m, status: "finished" } : m),
          standings: {
            ...d.standings,
            [match.sportId]: addResult(
              d.standings[match.sportId] ?? d.teams.map((t) => emptyStanding(t.id)), match
            ),
          },
        };
      });
    },
    changeAthleteGoals(teamId, athleteId, by) {
      setData((d) => ({ ...d, teams: d.teams.map((team) => team.id !== teamId ? team : {
        ...team, athletes: team.athletes.map((a) => a.id !== athleteId ? a :
          { ...a, goals: Math.max(0, a.goals + by) }),
      }) }));
    },
    restoreDemo() { setData(makeSeed()); },
  }), [data]);

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useTournament() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useTournament requer TournamentProvider");
  return ctx;
}
export function createEmptyMatch(): Match {
  return {
    id: newId(), sportId: "", homeId: "", awayId: "", homeScore: 0, awayScore: 0,
    homeCards: { yellow: 0, red: 0 }, awayCards: { yellow: 0, red: 0 },
    status: "scheduled", phase: "Fase de Grupos", round: "1ª rodada", startAt: "",
  };
}
