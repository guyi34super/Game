import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

const isProduction = process.env.NODE_ENV === "production";

const DEV_SECRET = "zeroday-dev-secret-do-not-use-in-production";

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (isProduction && process.env.NEXT_PHASE !== "phase-production-build") {
      throw new Error("NEXTAUTH_SECRET environment variable is required in production");
    }
    return DEV_SECRET;
  }
  return secret;
}

const secureCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  secure: isProduction,
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID ?? "",
      clientSecret: process.env.APPLE_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const guestId = crypto.randomBytes(16).toString("hex");
        return {
          id: `guest-${guestId}`,
          name: "Operator",
          email: null,
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: secureCookieOptions,
    },
    callbackUrl: {
      name: isProduction ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: secureCookieOptions,
    },
    csrfToken: {
      name: isProduction ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "strict" as const,
        path: "/",
        secure: isProduction,
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider ?? "guest";
        token.issuedAt = Math.floor(Date.now() / 1000);
        token.isGuest = account?.provider === "guest" || !account;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as Record<string, unknown>;
        sessionUser.id = token.id;
        sessionUser.provider = token.provider;
        sessionUser.isGuest = token.isGuest;
      }
      return session;
    },
    async signIn({ account }) {
      if (!account) return false;
      const validProviders = ["google", "apple", "github", "guest"];
      if (!validProviders.includes(account.provider)) return false;
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        const safePaths = ["/", "/game", "/how-to-play", "/auth/signin"];
        const isAllowed = safePaths.some((p) => url === p || url.startsWith(p + "?"));
        return isAllowed ? `${baseUrl}${url}` : baseUrl;
      }
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        /* invalid URL */
      }
      return baseUrl;
    },
  },
  events: {
    async signIn({ account }) {
      console.log(`[AUTH] Sign-in via ${account?.provider ?? "unknown"}`);
    },
    async signOut() {
      console.log("[AUTH] Sign-out");
    },
  },
  secret: getSecret(),
  debug: false,
};
