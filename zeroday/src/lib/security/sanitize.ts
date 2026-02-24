const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#96;",
};

const HTML_ESCAPE_REGEX = /[&<>"'`/]/g;

export function escapeHtml(str: string): string {
  return str.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char] || char);
}

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
];

export function sanitizeInput(input: string): string {
  let sanitized = input.trim();

  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }

  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  return sanitized;
}

export function sanitizeObject<T>(obj: T, maxDepth = 5): T {
  if (maxDepth <= 0) return obj;

  if (typeof obj === "string") {
    return sanitizeInput(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, maxDepth - 1)) as T;
  }

  if (obj !== null && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const safeKey = sanitizeInput(key);
      sanitized[safeKey] = sanitizeObject(value, maxDepth - 1);
    }
    return sanitized as T;
  }

  return obj;
}

export function isValidUrl(url: string, allowedProtocols = ["http:", "https:"]): boolean {
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

const PRIVATE_IP_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
  /^fd/,
  /^localhost$/i,
];

export function isPrivateAddress(hostname: string): boolean {
  return PRIVATE_IP_RANGES.some((pattern) => pattern.test(hostname));
}

export function validateExternalUrl(url: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, reason: "Invalid protocol" };
    }

    if (isPrivateAddress(parsed.hostname)) {
      return { valid: false, reason: "Private/internal addresses are not allowed" };
    }

    if (parsed.port && !["80", "443", "5000", "8000", "8080"].includes(parsed.port)) {
      return { valid: false, reason: "Non-standard port" };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Malformed URL" };
  }
}
