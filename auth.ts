import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/** Auth.js real: e-mail e senha fornecidos apenas no ambiente do servidor.
 * Para produção, substitua por verificação de hash contra um banco de dados.
 */
export const { handlers, auth } = NextAuth({
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (
          process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD &&
          email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", email, name: "Administrador", role: "admin" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role ?? "user";
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role ?? "user";
      return session;
    },
  },
});
