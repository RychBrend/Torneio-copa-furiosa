export type MatchStatus = "live" | "scheduled" | "future" | "finished";
export type Phase = "Fase de Grupos" | "Quartas" | "Semifinal" | "Final";
export const PHASES: Phase[] = ["Fase de Grupos", "Quartas", "Semifinal", "Final"];

export interface Athlete {
  id: string;
  name: string;
  number: number;
  position: string;
  goals: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  athletes: Athlete[];
}

export interface Sport {
  id: string;
  name: string;
  icon: "handebol" | "futsal" | "volei" | "basquete" | "outro";
}

export interface CardCounts { yellow: number; red: number }

export interface Match {
  id: string;
  sportId: string;
  homeId: string;
  awayId: string;
  homeScore: number;
  awayScore: number;
  homeCards: CardCounts;
  awayCards: CardCounts;
  startAt: string; // ISO local sem offset: YYYY-MM-DDTHH:mm
  phase: Phase;
  round: string;
  status: MatchStatus;
}

export interface StandingRow {
  teamId: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface TournamentData {
  teams: Team[];
  sports: Sport[];
  matches: Match[];
  standings: Record<string, StandingRow[]>;
}
