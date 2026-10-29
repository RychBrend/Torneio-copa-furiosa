"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockKeyhole, LogIn } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button, PageTitle } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { isAdmin, demoMode, loginDemo } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Credenciais inválidas."); return; }
      window.location.assign("/"); // Recarrega o Server Component com a sessão do Auth.js.
    } catch { setError("Não foi possível autenticar."); }
    finally { setBusy(false); }
  };
  return <div><PageTitle eyebrow="Área administrativa" title="Login ADM" subtitle="Acompanhar o campeonato é público. Gerenciar exige permissão."/>
    <div className="panel p-5"><div className="mb-5 flex items-center gap-3 text-[#ffcc00]"><LockKeyhole size={25}/><strong className="text-sm">Acesso do organizador</strong></div>
    {isAdmin ? <p className="text-sm text-[#aaa]">Você está no modo de administrador. Use o botão “Sair” na barra inferior para ver o modo público.</p>
      : demoMode ? <div><p className="mb-4 text-sm leading-relaxed text-[#aaa]">Demonstração ativada. O botão abaixo simula o login sem credenciais.</p><Button variant="gold" className="w-full" onClick={() => { loginDemo(); router.push("/"); }}><LogIn size={17}/>Entrar como ADM (demo)</Button></div>
      : <form onSubmit={submit} className="space-y-4"><div><label className="field-label" htmlFor="login-email">E-mail do administrador</label><input className="field" id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required/></div><div><label className="field-label" htmlFor="login-pass">Senha</label><input className="field" id="login-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required/></div>{error && <p role="alert" className="text-sm text-red-400">{error}</p>}<Button variant="gold" type="submit" disabled={busy} className="w-full">{busy ? "Entrando…" : "Entrar"}</Button></form>}
    </div>
  </div>;
}
