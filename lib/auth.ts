import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'cns_admin_session';

// Secret for signing session token
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'cns-secret-salt-2026-codenosekai';

export function verifyAdminCredentials(username?: string, password?: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (!username || !password) return false;

  // Constant-time comparison to prevent timing attacks
  const userMatch = crypto.timingSafeEqual(
    Buffer.from(username.padEnd(64, ' ')),
    Buffer.from(expectedUser.padEnd(64, ' '))
  );

  const passMatch = crypto.timingSafeEqual(
    Buffer.from(password.padEnd(64, ' ')),
    Buffer.from(expectedPass.padEnd(64, ' '))
  );

  return userMatch && passMatch;
}

export function generateSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function validateSessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [user, timestampStr, signature] = decoded.split(':');
    if (user !== 'admin' || !timestampStr || !signature) return false;

    // Check expiration (7 days)
    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) return false;

    // Recompute signature
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${user}:${timestampStr}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSig)
    );
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return false;
  return validateSessionToken(sessionCookie.value);
}

export { SESSION_COOKIE_NAME };
