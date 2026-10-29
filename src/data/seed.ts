import type { Match, StandingRow, Team, TournamentData } from "@/types/tournament";

export const teams: Team[] = [
  { id: "halterada", name: "Atlética Halterada", shortName: "HAL", badge: "", athletes: [
    { id: "a1", name: "Pedro Henrique", number: 10, position: "Armador", goals: 12 },
    { id: "a2", name: "Lucas Ferreira", number: 7, position: "Ponta", goals: 8 },
    { id: "a3", name: "Rafael Souza", number: 1, position: "Goleiro", goals: 0 },
  ] },
  { id: "mafiosa", name: "Atlética Mafiosa", shortName: "MAF", badge: "", athletes: [
    { id: "b1", name: "Matheus Oliveira", number: 9, position: "Pivô", goals: 10 },
    { id: "b2", name: "João Victor", number: 11, position: "Ponta", goals: 6 },
  ] },
  { id: "titas", name: "Atlética Titãs", shortName: "TIT", badge: "", athletes: [
    { id: "c1", name: "Guilherme Costa", number: 8, position: "Central", goals: 9 },
    { id: "c2", name: "Felipe Lima", number: 6, position: "Lateral", goals: 4 },
  ] },
  { id: "imperio", name: "Atlética Império", shortName: "IMP", badge: "", athletes: [
    { id: "d1", name: "Bruno Alves", number: 10, position: "Ponta", goals: 7 },
  ] },
  { id: "fenix", name: "Atlética Fênix", shortName: "FEN", badge: "", athletes: [
    { id: "e1", name: "André Mendes", number: 5, position: "Central", goals: 3 },
  ] },
  { id: "tropa", name: "Atlética Tropa", shortName: "TRP", badge: "", athletes: [
    { id: "f1", name: "Diego Martins", number: 4, position: "Defensor", goals: 2 },
  ] },
];

export const sports: TournamentData["sports"] = [
  { id: "handebol", name: "Handebol", icon: "handebol" },
  { id: "futsal", name: "Futsal", icon: "futsal" },
  { id: "volei", name: "Vôlei", icon: "volei" },
  { id: "basquete", name: "Basquete", icon: "basquete" },
];

const zeroCards = () => ({ yellow: 0, red: 0 });
export const matches: Match[] = [
  { id: "m1", sportId: "handebol", homeId: "halterada", awayId: "mafiosa", homeScore: 5, awayScore: 1, homeCards: zeroCards(), awayCards: zeroCards(), phase: "Fase de Grupos", round: "1ª rodada", startAt: "2026-10-28T10:00", status: "live" },
  { id: "m2", sportId: "handebol", homeId: "titas", awayId: "imperio", homeScore: 3, awayScore: 2, homeCards: zeroCards(), awayCards: zeroCards(), phase: "Fase de Grupos", round: "1ª rodada", startAt: "2026-10-27T16:00", status: "finished" },
  { id: "m3", sportId: "futsal", homeId: "halterada", awayId: "titas", homeScore: 2, awayScore: 2, homeCards: zeroCards(), awayCards: zeroCards(), phase: "Fase de Grupos", round: "1ª rodada", startAt: "2026-10-26T14:00", status: "finished" },
  { id: "m4", sportId: "handebol", homeId: "fenix", awayId: "tropa", homeScore: 0, awayScore: 0, homeCards: zeroCards(), awayCards: zeroCards(), phase: "Fase de Grupos", round: "2ª rodada", startAt: "2026-10-29T18:00", status: "scheduled" },
  { id: "m5", sportId: "volei", homeId: "mafiosa", awayId: "imperio", homeScore: 0, awayScore: 0, homeCards: zeroCards(), awayCards: zeroCards(), phase: "Quartas", round: "Quartas", startAt: "2026-11-02T15:00", status: "future" },
  { id: "m6", sportId: "basquete", homeId: "tropa", awayId: "titas", homeScore: 0, awayScore: 0, homeCards: zeroCards(), awayCards: zeroCards(), phase: "Semifinal", round: "Semifinal", startAt: "2026-11-04T19:00", status: "future" },
];

export function emptyStanding(teamId: string): StandingRow {
  return { teamId, points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
}

export function addResult(rows: StandingRow[], match: Match): StandingRow[] {
  // Regra de demonstração: vitória=3, empate=1, derrota=0 (ajustável por modalidade).
  return rows.map((row) => {
    if (row.teamId !== match.homeId && row.teamId !== match.awayId) return row;
    const home = row.teamId === match.homeId;
    const own = home ? match.homeScore : match.awayScore;
    const opp = home ? match.awayScore : match.homeScore;
    const won = own > opp;
    const draw = own === opp;
    return {
      ...row,
      points: row.points + (won ? 3 : draw ? 1 : 0),
      wins: row.wins + Number(won),
      draws: row.draws + Number(draw),
      losses: row.losses + Number(own < opp),
      goalsFor: row.goalsFor + own,
      goalsAgainst: row.goalsAgainst + opp,
    };
  });
}

export function makeSeed(): TournamentData {
  const standings: Record<string, StandingRow[]> = {};
  for (const sport of sports) {
    let rows = teams.map((t) => emptyStanding(t.id));
    for (const match of matches.filter((m) => m.sportId === sport.id && m.status === "finished")) {
      rows = addResult(rows, match);
    }
    standings[sport.id] = rows;
  }
  return { teams, sports, matches, standings };
}
