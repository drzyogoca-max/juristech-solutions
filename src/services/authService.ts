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

import { verifyAdminAccess, isAuthorizedAdminEmail, OFFICIAL_ADMIN_EMAILS } from '../lib/adminGuard';

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
    if (verifyAdminAccess()) return true;

    const user = this.getCurrentUser();
    if (user?.email && isAuthorizedAdminEmail(user.email)) return true;
    return user?.role === 'admin' || user?.role === 'super-admin';
  }

  /** Validate Admin Access via Authorized Admin Whitelist & Session Tokens (Zero Plaintext Secrets) */
  public verifyAdminPasscode(passcode: string): boolean {
    // Plain-text passcodes removed per P0 Security Hardening
    // Requires authenticated admin session or cryptographic admin token verification
    if (verifyAdminAccess()) return true;
    const user = this.getCurrentUser();
    if (user?.email && isAuthorizedAdminEmail(user.email)) {
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
