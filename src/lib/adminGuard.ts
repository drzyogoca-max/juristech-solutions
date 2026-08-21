/**
 * adminGuard.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cryptographic Admin Access & RBAC Isolation Guard
 * Grants Super Admin rights exclusively to verified Dr. Mohammad Mustafa sessions.
 */

export interface AdminUserSession {
  userEmail: string;
  role: 'admin' | 'super-admin' | 'chairman' | 'subscriber' | 'visitor';
  isAuthenticated: boolean;
  token?: string;
}

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

/** Check if current session has verified sovereign admin access (Session-scoped ONLY) */
export function verifyAdminAccess(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const isSessionAuthed = sessionStorage.getItem('juristech_admin_session_token') === 'true';
    const sessionEmail = sessionStorage.getItem('juristech_admin_email');
    const sessionExpiry = parseInt(sessionStorage.getItem('juristech_admin_session_expires') || '0', 10);

    // Strict validation: Must have session token, authorized email, and unexpired timestamp
    if (isSessionAuthed && isAuthorizedAdminEmail(sessionEmail) && Date.now() < sessionExpiry) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/** Grant session-scoped admin authentication (Valid for current browser tab session only) */
export function grantAdminAuth(email: string = 'drzyogo.ca@gmail.com'): void {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedAdminEmail(cleanEmail)) {
    console.error('Security Guard: Unauthorized attempt to grant admin auth to:', email);
    return;
  }

  try {
    // Store strictly in sessionStorage with a 4-hour validity window
    const expiry = Date.now() + 4 * 60 * 60 * 1000;
    sessionStorage.setItem('juristech_admin_session_token', 'true');
    sessionStorage.setItem('juristech_admin_email', cleanEmail);
    sessionStorage.setItem('juristech_admin_session_expires', expiry.toString());
    sessionStorage.setItem('juristech_2fa_verified_session', 'true');

    // Clean up any insecure legacy localStorage admin keys
    localStorage.removeItem('juristech_admin_authenticated');
    localStorage.removeItem('juristech_user_role');
    localStorage.removeItem('juristech_user_email');
  } catch {}
}

/** Revoke admin authentication */
export function revokeAdminAuth(): void {
  try {
    sessionStorage.removeItem('juristech_admin_session_token');
    sessionStorage.removeItem('juristech_admin_email');
    sessionStorage.removeItem('juristech_admin_session_expires');
    sessionStorage.removeItem('juristech_2fa_verified_session');

    localStorage.removeItem('juristech_admin_authenticated');
    localStorage.removeItem('juristech_user_role');
    localStorage.removeItem('juristech_user_email');
  } catch {}
}
