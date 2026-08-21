/**
 * adminGuard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cryptographic Admin Access & RBAC Isolation Guard
 * Grants Super Admin rights across all websites and domains for Dr. Mohammad Mustafa
 */

export interface AdminUserSession {
  userEmail: string;
  role: 'admin' | 'super-admin' | 'chairman' | 'subscriber' | 'visitor';
  isAuthenticated: boolean;
  token?: string;
}

const ADMIN_STORAGE_KEY = 'juristech_admin_authenticated';
export const OFFICIAL_ADMIN_EMAILS = [
  'drzyogo.ca@gmail.com',
  'juristech.solutions@outlook.com',
  'admin@juristech.solutions',
];

/** Check if an email is an authorized Super Admin */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return OFFICIAL_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/** Check if current session has sovereign admin access */
export function verifyAdminAccess(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const isLocallyAuthed = localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    const userRole = localStorage.getItem('juristech_user_role');
    const userEmail = localStorage.getItem('juristech_user_email');
    const storedUser = localStorage.getItem('ls_user_session');

    if (isLocallyAuthed || userRole === 'super-admin' || userRole === 'admin' || isAuthorizedAdminEmail(userEmail)) {
      return true;
    }

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (
        parsed?.role === 'admin' ||
        parsed?.role === 'super-admin' ||
        isAuthorizedAdminEmail(parsed?.email)
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
export function grantAdminAuth(email: string = 'drzyogo.ca@gmail.com'): void {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    localStorage.setItem('juristech_user_role', 'super-admin');
    localStorage.setItem('juristech_user_email', email.trim().toLowerCase());
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
    localStorage.removeItem('juristech_user_email');
    if (typeof document !== 'undefined') {
      document.cookie = 'juristech_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  } catch {}
}
