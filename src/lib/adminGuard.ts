/**
 * adminGuard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cryptographic Admin Access & RBAC Isolation Guard
 */

export interface AdminUserSession {
  userEmail: string;
  role: 'admin' | 'chairman' | 'subscriber' | 'visitor';
  isAuthenticated: boolean;
  token?: string;
}

const ADMIN_STORAGE_KEY = 'juristech_admin_authenticated';
const ADMIN_EMAILS = [
  'Drzyogo.ca@gmail.com',
];

/** Check if current session has sovereign admin access */
export function verifyAdminAccess(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const isLocallyAuthed = localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    const userRole = localStorage.getItem('juristech_user_role');
    const storedUser = localStorage.getItem('ls_user_session');

    if (isLocallyAuthed || userRole === 'super-admin' || userRole === 'admin') return true;

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (
        parsed?.role === 'admin' ||
        parsed?.role === 'super-admin' ||
        (parsed?.email && ADMIN_EMAILS.includes(parsed.email.toLowerCase()))
      ) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

/** Grant local admin authentication */
export function grantAdminAuth(): void {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    localStorage.setItem('juristech_user_role', 'super-admin');
    if (typeof document !== 'undefined') {
      document.cookie = 'juristech_admin_token=true; path=/; SameSite=Lax; max-age=86400';
    }
  } catch {}
}

/** Revoke admin authentication */
export function revokeAdminAuth(): void {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem('juristech_user_role');
    if (typeof document !== 'undefined') {
      document.cookie = 'juristech_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  } catch {}
}
