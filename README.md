# Torneios — Copa Furiosa 2026

Aplicativo **mobile-first**, em português, de acompanhamento e gestão visual de torneios esportivos. Inspirado no fluxo da referência visual enviada, mas com identidade **preto (#080808), vermelho (#fe0000) e amarelo (#ffcc00)**.

## Stack

- Next.js 16 (compatível com a exigência Next.js 14+), App Router e TypeScript estrito
- React 19, Tailwind CSS 4 e `lucide-react`
- Auth.js / NextAuth v5 (modo real opcional, com provedor `credentials`)
- `localStorage` para a demonstração de CRUD no mesmo navegador
- Estrutura preparada para deploy no Vercel

## Executar localmente

Requisitos: **Node.js 20.9+** e npm.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` em um navegador ou no modo de dispositivo do DevTools.

Comandos úteis:

```bash
npm run typecheck
npm run lint
npm run build
```

> Nota de validação: os arquivos TS/TSX passaram por uma verificação de sintaxe com TypeScript. Não foi possível instalar dependências nem executar `next build` no ambiente em que o pacote foi gerado; rode os comandos acima antes de publicar.

## Ativar/desativar ferramentas ADM

Edite **`src/lib/access.ts`**:

```ts
export const DEMO_MODE = true;
export const isAdmin = true; // troque para false para iniciar em modo público
```

- `DEMO_MODE=true`: as funções administrativas são simuladas. O rodapé permite **Sair**, e a rota `/login` permite **Entrar como ADM (demo)**. Isso altera somente o navegador, não aplica segurança.
- `isAdmin=false`: inicia em modo público (caso não haja preferência anterior armazenada). Para aplicar imediatamente após alternar esse valor, limpe no navegador a chave `maxmzr-admin-demo` em Local Storage, ou use **Sair**.
- `DEMO_MODE=false`: habilita a sessão real do Auth.js para exibir os controles somente quando o administrador estiver autenticado. Configure `.env.local` a partir de `.env.example` e gere `AUTH_SECRET` via `npx auth secret`.

**IMPORTANTE**: a autenticação real fornece a sessão, mas **este projeto é um frontend de demonstração**. As alterações de estado ainda são locais. Para produção, migre as ações para API Routes/Server Actions com `await auth()` e autorização do papel `admin` **no servidor**. Nunca confie apenas em botões ocultos ou no `isAdmin` do cliente.

### Credenciais de demonstração no modo Auth.js

O arquivo `auth.ts` contém um único administrador configurado pelas variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` no servidor. Esse verificador de senha em variável de ambiente é destinado a testes de integração, não a produção. Em produção, use hashing de senha, rate limiting, usuários persistidos e proteção contra abuso; alternativamente, OAuth.

## Funcionalidades

| Rota | Público | Administrador (demonstração) |
| --- | --- | --- |
| `/` e `/ao-vivo` | Placar ao vivo e próximo jogo | +/− placar, cartões A/V, encerrar jogo, restaurar dados demo |
| `/jogos` | Lista cronológica; filtros por data, fase e rodada; chaveamento | Modal de confrontos, cadastro/edição/exclusão de partidas agendadas, iniciar partida |
| `/modalidades` | Cards de esportes; tabela PTS/V/D/SG | Adicionar esporte, zerar tabela |
| `/equipes` | Lista com escudos e elenco | Cadastrar/editar/excluir atlética, enviar escudo, gerenciar atletas |
| `/artilharia` | Ranking por gols | +/− gols de atletas |
| `/login` | Login opcional | Entrar como ADM (demo) ou Credentials (Auth.js) |

### Estado e regras da demonstração

- Dados de exemplo ficam em `src/data/seed.ts`. O jogo Halterada x Mafiosa começa em 5–1, para demonstrar o painel.
- Todas as telas compartilham o contexto em `src/context/tournament-context.tsx`. As alterações persistem no **localStorage deste navegador**.
- Uma partida encerrada lança um resultado na tabela; o exemplo usa **3 pontos por vitória, 1 por empate e 0 por derrota**. A regra precisa ser ajustada para cada modalidade real.
- O ranking dos atletas é editado de forma independente do placar da equipe; a associação gol–atleta deve ser feita com eventos de partida no backend definitivo.
- O botão “Zerar” limpa as estatísticas atuais de uma modalidade, sem apagar as partidas realizadas.
- No cadastro de atléticas, o upload usa `FileReader` e armazena Data URL (máximo 300 KB por imagem). URLs públicas de imagem também funcionam. Em produção, substitua por Vercel Blob/Supabase Storage e persista apenas o caminho/URL.
- Excluir uma atlética também remove seus confrontos. Os pontos históricos das equipes remanescentes **não são recalculados** nessa ação de demonstração: em produção, utilize recomputação transacional.
- A alteração fica visível apenas **neste navegador**. Não há transmissão em rede, push, sockets nem sincronização real entre visitantes.

## Estrutura de diretórios

```text
maxmzr-torneios/
├── auth.ts                        # Auth.js Credentials e sessão com role
├── .env.example                   # Variáveis do ambiente real
├── next-env.d.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── src/
    ├── app/
    │   ├── layout.tsx              # Shell + Providers + rodapé fixo
    │   ├── page.tsx                # Ao vivo (home)
    │   ├── ao-vivo/page.tsx        # Alias da home
    │   ├── jogos/page.tsx
    │   ├── modalidades/page.tsx
    │   ├── equipes/page.tsx
    │   ├── artilharia/page.tsx
    │   ├── login/page.tsx
    │   ├── api/auth/[...nextauth]/route.ts
    │   └── globals.css
    ├── components/
    │   ├── app-shell.tsx           # Topo e bottom nav
    │   ├── match-card.tsx          # Placar e controles ADM
    │   ├── bracket-manager.tsx     # Modal de chaveamento
    │   ├── team-form.tsx           # Escudo e elenco
    │   ├── team-badge.tsx
    │   ├── sport-icon.tsx
    │   ├── ui.tsx                   # Button / Tag / Modal / PageTitle
    │   └── providers.tsx
    ├── context/
    │   ├── admin-context.tsx       # Role de demonstração/sessão
    │   └── tournament-context.tsx  # Ações CRUD e dados locais
    ├── data/seed.ts
    ├── lib/access.ts
    ├── lib/format.ts
    └── types/
        ├── tournament.ts
        └── next-auth.d.ts
```

## Vercel

1. Suba a pasta `maxmzr-torneios` para um repositório Git e importe-o no Vercel.
2. Framework: Next.js (detectado automaticamente); Build Command: `npm run build`.
3. Para publicar o **protótipo visual**, mantenha `DEMO_MODE=true`, compreendendo que o CRUD ainda é local. Não trate esse ambiente como painel administrativo seguro.
4. Para utilizar login verdadeiro, altere `DEMO_MODE=false` e configure `AUTH_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` como **Environment Variables** no Vercel (não versionar valores secretos).
5. Antes de operar um torneio real, migre a gravação para o banco (Vercel Postgres, Neon ou Supabase Postgres), armazenamento de escudos para Blob/Storage, atualização em tempo real por WebSockets/Realtime/SSE, autorização server-side e trilha de auditoria.

## Arquitetura futura sugerida

`Client Components → Server Actions/API protegidas por auth() → PostgreSQL/ORM → canal Realtime → todos os espectadores`; escudos enviados diretamente ao Storage com token assinado e validações no servidor.
