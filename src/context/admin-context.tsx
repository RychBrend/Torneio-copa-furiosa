"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEMO_MODE, isAdmin } from "@/lib/access";

interface AdminContextValue {
  isAdmin: boolean;
  demoMode: boolean;
  loginDemo: () => void;
  logoutDemo: () => void;
}
const AdminContext = createContext<AdminContextValue | null>(null);
const KEY = "maxmzr-admin-demo";
export function AdminProvider({ children, sessionAdmin }: {
  children: React.ReactNode;
  sessionAdmin: boolean;
}) {
  const [demoAdmin, setDemoAdmin] = useState(isAdmin);
  useEffect(() => {
    if (!DEMO_MODE) return;
    const v = window.localStorage.getItem(KEY);
    if (v !== null) setDemoAdmin(v === "true");
  }, []);
  const change = (value: boolean) => {
    setDemoAdmin(value);
    try { window.localStorage.setItem(KEY, String(value)); } catch { /* ignore */ }
  };
  return <AdminContext.Provider value={{
    isAdmin: DEMO_MODE ? demoAdmin : sessionAdmin,
    demoMode: DEMO_MODE,
    loginDemo: () => change(true),
    logoutDemo: () => change(false),
  }}>{children}</AdminContext.Provider>;
}
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin requer AdminProvider");
  return ctx;
}
