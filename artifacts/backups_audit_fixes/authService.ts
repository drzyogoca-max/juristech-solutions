/**
 * authService.ts — Modular Decoupled Authentication & Authorization Service
 * JurisTech Solutions Enterprise Architecture
 */

export interface UserProfile {
  id: string;
  email: string;
  role: 'client' | 'admin' | 'super-admin';
  subscriptionTier: 'free' | 'startup' | 'sme' | 'enterprise';
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /** Get active user session profile */
  public getCurrentUser(): UserProfile | null {
    const stored = localStorage.getItem('ls_user_session');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /** Check if current session has Admin privileges */
  public isAdmin(): boolean {
    const adminAuthed = localStorage.getItem('ls_admin_authenticated');
    if (adminAuthed === 'true') return true;

    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'super-admin';
  }

  /** Validate Admin 2FA Passcode */
  public verifyAdminPasscode(passcode: string): boolean {
    const validCodes = ['778899', 'admin2026', 'juristech-super-admin'];
    if (validCodes.includes(passcode.trim())) {
      localStorage.setItem('ls_admin_authenticated', 'true');
      return true;
    }
    return false;
  }

  /** Sign out session */
  public logout(): void {
    localStorage.removeItem('ls_user_session');
    localStorage.removeItem('ls_admin_authenticated');
  }
}

export const authService = AuthService.getInstance();
