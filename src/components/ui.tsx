"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-[#fe0000] text-white hover:bg-[#dd0000] border-[#fe0000]",
  gold: "bg-[#ffcc00] text-black hover:bg-[#e9ba00] border-[#ffcc00]",
  secondary: "bg-[#222] text-white hover:bg-[#2c2c2c] border-[#444]",
  ghost: "bg-transparent text-[#bbb] hover:bg-[#222] border-transparent",
  danger: "bg-[#400909] text-red-200 hover:bg-[#5b0b0b] border-[#6b1515]",
} as const;
export function Button({ variant = "secondary", size = "md", className = "", children, ...props }:
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants; size?: "sm" | "md" | "lg";
  }) {
  const dims = { sm: "min-h-9 px-3 text-xs", md: "min-h-11 px-4 text-sm", lg: "min-h-12 px-5 text-sm" };
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-xl border font-extrabold transition-colors disabled:opacity-35 ${dims[size]} ${variants[variant]} ${className}`}>{children}</button>;
}
export function Tag({ children, kind = "neutral" }: { children: ReactNode; kind?: "neutral" | "live" | "gold" | "red" }) {
  const style = { neutral: "bg-[#252525] text-[#aaa] border-[#333]", live: "bg-red-950 text-[#ff5d5d] border-red-900", gold: "bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/30", red: "bg-[#fe0000]/10 text-[#ff6363] border-[#fe0000]/30" };
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-black tracking-wider uppercase ${style[kind]}`}>{children}</span>;
}
export function PageTitle({ eyebrow, title, subtitle, actions }: { eyebrow: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return <header className="mb-6 space-y-3">
    <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#ffcc00]">{eyebrow}</p>
    <div className="flex items-start justify-between gap-3"><div>
      <h1 className="text-3xl font-black uppercase tracking-tighter text-white sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-[#9ca3af]">{subtitle}</p>}
    </div>{actions}</div>
  </header>;
}
export function Empty({ title, text }: { title: string; text: string }) {
  return <div className="panel px-5 py-12 text-center"><p className="font-bold">{title}</p><p className="mt-2 text-sm text-[#8d8d8d]">{text}</p></div>;
}
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/85 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-xl overflow-hidden rounded-t-3xl border border-[#444] bg-[#141414] shadow-2xl sm:rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-[#333] px-5 py-4">
        <h2 className="text-lg font-black uppercase tracking-tight">{title}</h2>
        <button aria-label="Fechar" onClick={onClose} className="rounded-full border border-[#444] p-2 text-[#aaa] hover:text-white"><X size={18}/></button>
      </div>
      <div className="max-h-[min(78dvh,700px)] overflow-y-auto px-5 py-5">{children}</div>
    </section>
  </div>;
}
