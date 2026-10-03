import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'cns_admin_session';

// Secret for signing session token
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.FOUNDER_PASSWORD ||
  process.env.SUPER_ADMIN_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  'cns-secret-salt-2026-codenosekai';

// ONLY TWO ROLES: founder (highest-level / full access) and admin (limited access)
export type AdminRole = 'founder' | 'admin';

export interface AdminSession {
  username: string;
  role: AdminRole;
}

export interface AuthVerificationResult {
  valid: boolean;
  username?: string;
  role?: AdminRole;
}

export function isFounderRole(role?: string): boolean {
  return role === 'founder' || role === 'super_admin';
}

// Backwards-compatible helper
export function isSuperAdminRole(role?: string): boolean {
  return isFounderRole(role);
}

function safeCompare(input: string, expected: string): boolean {
  try {
    const inputBuf = Buffer.from(input.padEnd(128, ' '));
    const expectedBuf = Buffer.from(expected.padEnd(128, ' '));
    return crypto.timingSafeEqual(inputBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function authenticateAdmin(
  username?: string,
  password?: string
): AuthVerificationResult {
  if (!username || !password) {
    return { valid: false };
  }

  // 1. Check Founder credentials (highest privileges)
  const founderUsers = [
    process.env.FOUNDER_USERNAME,
    process.env.SUPER_ADMIN_USERNAME,
  ].filter(Boolean) as string[];
  const founderPasses = [
    process.env.FOUNDER_PASSWORD,
    process.env.SUPER_ADMIN_PASSWORD,
  ].filter(Boolean) as string[];

  if (founderUsers.length === 0) founderUsers.push('admin');
  if (founderPasses.length === 0) founderPasses.push('CNS@Founder123');

  for (const fUser of founderUsers) {
    if (safeCompare(username, fUser)) {
      for (const fPass of founderPasses) {
        if (safeCompare(password, fPass)) {
          return {
            valid: true,
            username: fUser,
            role: 'founder',
          };
        }
      }
    }
  }

  // 2. Check Admin credentials (limited privileges)
  const adminUsers = [
    process.env.ADMIN_USERNAME,
  ].filter(Boolean) as string[];
  const adminPasses = [
    process.env.ADMIN_PASSWORD,
  ].filter(Boolean) as string[];

  if (adminUsers.length === 0) adminUsers.push('admin');
  if (adminPasses.length === 0) adminPasses.push('CNS@Admin123');

  for (const aUser of adminUsers) {
    if (safeCompare(username, aUser)) {
      for (const aPass of adminPasses) {
        if (safeCompare(password, aPass)) {
          return {
            valid: true,
            username: aUser,
            role: 'admin',
          };
        }
      }
    }
  }

  return { valid: false };
}

// Backwards-compatible verify function
export function verifyAdminCredentials(username?: string, password?: string): boolean {
  return authenticateAdmin(username, password).valid;
}

export function generateSessionToken(
  username: string = 'admin',
  role: AdminRole = 'founder'
): string {
  const payload = `${username}:${role}:${Date.now()}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function validateSessionToken(token: string): AdminSession | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');

    // Format 1: Role-aware format (username:role:timestamp:signature)
    if (parts.length === 4) {
      const [username, roleStr, timestampStr, signature] = parts;
      const role: AdminRole = isFounderRole(roleStr) ? 'founder' : 'admin';

      // Check expiration (7 days)
      const timestamp = parseInt(timestampStr, 10);
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > maxAge) return null;

      const payload = `${username}:${roleStr}:${timestampStr}`;
      const expectedSig = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(payload)
        .digest('hex');

      const matches = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSig)
      );

      if (matches) {
        return { username, role };
      }
      return null;
    }

    // Format 2: Legacy format (admin:timestamp:signature)
    if (parts.length === 3) {
      const [user, timestampStr, signature] = parts;
      if (user !== 'admin') return null;

      const timestamp = parseInt(timestampStr, 10);
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > maxAge) return null;

      const expectedSig = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(`${user}:${timestampStr}`)
        .digest('hex');

      const matches = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSig)
      );

      if (matches) {
        return { username: 'admin', role: 'founder' };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return validateSessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

export async function isFounder(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null && isFounderRole(session.role);
}

export async function isSuperAdmin(): Promise<boolean> {
  return isFounder();
}

export async function isAdmin(): Promise<boolean> {
  return isAuthenticated();
}

export { SESSION_COOKIE_NAME };
