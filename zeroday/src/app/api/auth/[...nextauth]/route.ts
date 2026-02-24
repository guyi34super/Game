import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { logEnvironmentCheck } from "@/lib/security/env-check";

let envChecked = false;

function ensureEnvCheck() {
  if (!envChecked) {
    logEnvironmentCheck();
    envChecked = true;
  }
}

ensureEnvCheck();

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
