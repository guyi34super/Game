type EnvVar = {
  name: string;
  required: boolean;
  sensitive: boolean;
  validator?: (value: string) => boolean;
  description: string;
};

const ENV_SCHEMA: EnvVar[] = [
  {
    name: "NEXTAUTH_SECRET",
    required: true,
    sensitive: true,
    validator: (val) => val.length >= 32,
    description: "JWT signing secret (min 32 chars)",
  },
  {
    name: "NEXTAUTH_URL",
    required: false,
    sensitive: false,
    validator: (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    description: "Canonical app URL for NextAuth callbacks",
  },
  {
    name: "GOOGLE_CLIENT_ID",
    required: false,
    sensitive: false,
    description: "Google OAuth client ID",
  },
  {
    name: "GOOGLE_CLIENT_SECRET",
    required: false,
    sensitive: true,
    description: "Google OAuth client secret",
  },
  {
    name: "APPLE_ID",
    required: false,
    sensitive: false,
    description: "Apple Sign In service ID",
  },
  {
    name: "APPLE_SECRET",
    required: false,
    sensitive: true,
    description: "Apple Sign In client secret",
  },
  {
    name: "GITHUB_ID",
    required: false,
    sensitive: false,
    description: "GitHub OAuth app ID",
  },
  {
    name: "GITHUB_SECRET",
    required: false,
    sensitive: true,
    description: "GitHub OAuth app secret",
  },
  {
    name: "AI_SERVICE_URL",
    required: false,
    sensitive: false,
    validator: (val) => {
      try {
        const url = new URL(val);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    },
    description: "AI analysis service endpoint URL",
  },
];

export type EnvCheckResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function validateEnvironment(): EnvCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === "production";

  for (const envVar of ENV_SCHEMA) {
    const value = process.env[envVar.name];

    if (!value || value.length === 0) {
      if (envVar.required && isProduction) {
        errors.push(`Missing required env var: ${envVar.name} - ${envVar.description}`);
      } else if (envVar.required) {
        warnings.push(`Missing recommended env var: ${envVar.name} - ${envVar.description}`);
      }
      continue;
    }

    if (envVar.validator && !envVar.validator(value)) {
      const severity = isProduction ? "error" : "warning";
      const msg = `Invalid value for ${envVar.name} - ${envVar.description}`;
      if (severity === "error") {
        errors.push(msg);
      } else {
        warnings.push(msg);
      }
    }
  }

  if (isProduction) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (secret === "zeroday-dev-secret-change-in-production") {
      errors.push("NEXTAUTH_SECRET is using the default dev value in production. Set a unique random secret.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function logEnvironmentCheck(): void {
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (isBuildPhase) return;

  const result = validateEnvironment();

  if (result.warnings.length > 0) {
    console.warn("[SECURITY] Environment warnings:");
    result.warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  if (!result.valid) {
    console.error("[SECURITY] Environment validation FAILED:");
    result.errors.forEach((e) => console.error(`  - ${e}`));
  } else {
    console.log("[SECURITY] Environment validation passed");
  }
}
