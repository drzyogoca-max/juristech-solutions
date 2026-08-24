/**
 * src/services/rbacService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Executive Role-Based Access Control (RBAC) & 2FA Management Service
 * JurisTech Solutions Enterprise Architecture
 *
 * Implements:
 *  1. Database Schema Mappings (`role`, `two_factor_secret`, `is_two_factor_enabled`)
 *  2. API Route Handlers (PATCH /api/admin/users/:userId/role, POST /api/auth/2fa/enable, POST /api/auth/2fa/verify)
 *  3. Security Middleware Enforcement (`secureAccess`)
 */

import { supabase } from '../lib/supabaseClient';
import { generate2FASecret, verify2FAToken } from '../lib/twoFactorEngine';

export type UserRole = 'Super Admin' | 'Admin' | 'Lawyer' | 'Client / Viewer';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  is_two_factor_enabled: boolean;
  two_factor_secret?: string | null;
  lastLogin: string;
  createdAt: string;
}

const STORAGE_USERS_KEY = 'juristech_rbac_users_db_v1';

// Initial System Users Seed
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_super_admin_01',
    email: 'drzyogo.ca@gmail.com',
    fullName: 'Dr. Mohammed Mostafa (CEO / CFO)',
    role: 'Super Admin',
    isActive: true,
    is_two_factor_enabled: false,
    two_factor_secret: null,
    lastLogin: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr_lawyer_02',
    email: 'juristech.solutions@outlook.com',
    fullName: 'Senior Legal Counsel & Advisor',
    role: 'Lawyer',
    isActive: true,
    is_two_factor_enabled: false,
    two_factor_secret: null,
    lastLogin: new Date().toISOString(),
    createdAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 'usr_client_03',
    email: 'executive@apex-energycorp.com',
    fullName: 'Alexander Vance (Apex Energy)',
    role: 'Client / Viewer',
    isActive: true,
    is_two_factor_enabled: false,
    two_factor_secret: null,
    lastLogin: new Date().toISOString(),
    createdAt: '2026-08-19T00:00:00.000Z',
  },
];

export class RbacService {
  private static instance: RbacService;

  private constructor() {}

  public static getInstance(): RbacService {
    if (!RbacService.instance) {
      RbacService.instance = new RbacService();
    }
    return RbacService.instance;
  }

  /** Load User Roster from Storage or Supabase */
  public getUsers(): UserAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }

  /** Save User Roster */
  public saveUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {}
  }

  // ─── 1. Endpoint: PATCH /api/admin/users/:userId/role ──────────────────────
  public async updateUserRole(userId: string, newRole: UserRole): Promise<{ success: boolean; user?: UserAccount; message: string }> {
    const users = this.getUsers();
    const targetIndex = users.findIndex(u => u.id === userId || u.email === userId);

    if (targetIndex === -1) {
      return { success: false, message: 'User not found in system directory.' };
    }

    users[targetIndex].role = newRole;
    this.saveUsers(users);

    // Sync with Supabase profiles table
    try {
      await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    } catch {}

    return {
      success: true,
      user: users[targetIndex],
      message: `User role updated successfully to ${newRole}.`,
    };
  }

  // ─── 2. Endpoint: POST /api/auth/2fa/enable ─────────────────────────────────
  public async enable2FA(userIdOrEmail: string): Promise<{
    success: boolean;
    secret?: string;
    otpauth_url?: string;
    message: string;
  }> {
    const users = this.getUsers();
    const user = users.find(u => u.id === userIdOrEmail || u.email === userIdOrEmail);

    const email = user ? user.email : userIdOrEmail;
    const secretObj = generate2FASecret('JurisTech Solutions', email);

    if (user) {
      user.two_factor_secret = secretObj.base32;
      user.is_two_factor_enabled = true;
      this.saveUsers(users);
    }

    try {
      localStorage.setItem(`ls_2fa_secret_${email}`, secretObj.base32);
      localStorage.setItem(`ls_2fa_enabled_${email}`, 'true');
    } catch {}

    return {
      success: true,
      secret: secretObj.base32,
      otpauth_url: secretObj.otpauth_url,
      message: '2FA secret generated successfully. Please scan QR Code or input secret in Authenticator app.',
    };
  }

  // ─── 3. Endpoint: POST /api/auth/2fa/verify ────────────────────────────────
  public async verify2FA(userIdOrEmail: string, token: string): Promise<{ success: boolean; is2FAVerified: boolean; message: string }> {
    const users = this.getUsers();
    const user = users.find(u => u.id === userIdOrEmail || u.email === userIdOrEmail);

    const secret = user?.two_factor_secret || localStorage.getItem(`ls_2fa_secret_${userIdOrEmail}`);
    if (!secret) {
      return { success: false, is2FAVerified: false, message: '2FA is not yet configured for this account.' };
    }

    const isValid = await verify2FAToken(token, secret);

    if (isValid) {
      if (user) {
        user.is_two_factor_enabled = true;
        this.saveUsers(users);
      }
      try {
        sessionStorage.setItem('juristech_2fa_verified_session', 'true');
      } catch {}
      return { success: true, is2FAVerified: true, message: '2FA OTP token verified successfully.' };
    }

    return { success: false, is2FAVerified: false, message: 'Invalid 2FA OTP code. Please check your authenticator app.' };
  }

  // ─── 4. Endpoint: POST /api/auth/2fa/disable ───────────────────────────────
  public async disable2FA(userIdOrEmail: string): Promise<{ success: boolean; message: string }> {
    const users = this.getUsers();
    const user = users.find(u => u.id === userIdOrEmail || u.email === userIdOrEmail);

    if (user) {
      user.is_two_factor_enabled = false;
      user.two_factor_secret = null;
      this.saveUsers(users);
    }

    try {
      localStorage.setItem(`ls_2fa_enabled_${userIdOrEmail}`, 'false');
      sessionStorage.removeItem('juristech_2fa_verified_session');
    } catch {}

    return { success: true, message: 'Two-Factor Authentication disabled.' };
  }

  // ─── 5. Middleware Implementation: secureAccess ─────────────────────────────
  public secureAccess(req: {
    user: { id: string; email: string; isActive: boolean; is_two_factor_enabled: boolean; role: UserRole };
    session: { is2FAVerified: boolean };
  }): { allowed: boolean; statusCode: number; error?: string } {
    if (!req.user.isActive) {
      return { allowed: false, statusCode: 401, error: 'Unauthorized: User account is inactive.' };
    }

    if (req.user.is_two_factor_enabled && !req.session.is2FAVerified) {
      return { allowed: false, statusCode: 403, error: '2FA Required: Please complete two-factor authentication.' };
    }

    return { allowed: true, statusCode: 200 };
  }
}

export const rbacService = RbacService.getInstance();
