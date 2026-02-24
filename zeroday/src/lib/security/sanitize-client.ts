const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

const HTML_ESCAPE_REGEX = /[&<>"']/g;

export function escapeForDisplay(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char] || char);
}

const ALLOWED_IMAGE_PROTOCOLS = ["https:"];
const ALLOWED_IMAGE_HOSTS = [
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
  "*.googleusercontent.com",
  "*.github.com",
  "*.githubusercontent.com",
];

export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    if (!ALLOWED_IMAGE_PROTOCOLS.includes(parsed.protocol)) {
      return false;
    }

    const hostname = parsed.hostname;
    return ALLOWED_IMAGE_HOSTS.some((pattern) => {
      if (pattern.startsWith("*.")) {
        const domain = pattern.slice(2);
        return hostname === domain || hostname.endsWith("." + domain);
      }
      return hostname === pattern;
    });
  } catch {
    return false;
  }
}
