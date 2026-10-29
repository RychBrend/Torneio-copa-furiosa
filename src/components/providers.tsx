"use client";
import { AdminProvider } from "@/context/admin-context";
import { TournamentProvider } from "@/context/tournament-context";
export function Providers({ children, sessionAdmin }: {
  children: React.ReactNode;
  sessionAdmin: boolean;
}) {
  return <AdminProvider sessionAdmin={sessionAdmin}>
    <TournamentProvider>{children}</TournamentProvider>
  </AdminProvider>;
}
