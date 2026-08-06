/**
 * Autenticación simple para /admin mediante cookie firmada (HMAC-SHA256).
 * Usa Web Crypto → funciona tanto en Node como en el middleware (Edge).
 */

export const ADMIN_COOKIE = "boda_admin";
const PAYLOAD = "admin-ok";

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(sig);
}

/** Genera el valor de cookie de sesión válido. */
export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret";
  return hmac(secret, PAYLOAD);
}

/** Verifica que el valor de la cookie sea una firma válida. */
export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  // Comparación en tiempo constante
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/** Comprueba la contraseña del panel. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "boda2026";
  return input === expected;
}
