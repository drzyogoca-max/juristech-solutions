import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export type UserRole = 'client' | 'admin' | 'super-admin' | 'Super Admin' | 'Admin' | 'Lawyer' | 'Client / Viewer';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isLawyer: boolean;
  user: any;
  loading: boolean;
  twoFactorEnabled: boolean;
  is2FAVerified: boolean;
  enableTwoFactor: () => void;
  disableTwoFactor: () => void;
  verify2FATokenSession: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  role: 'client',
  setRole: () => {},
  isAdmin: false,
  isLawyer: false,
  user: null,
  loading: true,
  twoFactorEnabled: false,
  is2FAVerified: false,
  enableTwoFactor: () => {},
  disableTwoFactor: () => {},
  verify2FATokenSession: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return 'client';
    const savedRole = (localStorage.getItem('juristech_user_role') as UserRole) || 'client';
    const savedEmail = localStorage.getItem('juristech_user_email');
    const isAdminAuthed = localStorage.getItem('juristech_admin_authenticated') === 'true';

    if ((savedRole === 'super-admin' || savedRole === 'admin') && savedEmail !== 'drzyogo.ca@gmail.com' && !isAdminAuthed) {
      localStorage.setItem('juristech_user_role', 'client');
      return 'client';
    }
    return savedRole;
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('juristech_2fa_enabled') === 'true';
    } catch {
      return false;
    }
  });

  function enableTwoFactor() {
    setTwoFactorEnabled(true);
    try {
      localStorage.setItem('juristech_2fa_enabled', 'true');
    } catch {
      // ignore
    }
  }

  function disableTwoFactor() {
    setTwoFactorEnabled(false);
    try {
      localStorage.setItem('juristech_2fa_enabled', 'false');
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          if (session.user.email === 'drzyogo.ca@gmail.com') {
            setRoleState('super-admin');
            localStorage.setItem('juristech_user_role', 'super-admin');
            localStorage.setItem('juristech_user_email', session.user.email);
          } else {
            // Check role from profiles table in Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (profile?.role === 'admin' || profile?.role === 'super-admin') {
              setRoleState(profile.role as UserRole);
              localStorage.setItem('juristech_user_role', profile.role);
            } else {
              setRoleState('client');
              localStorage.setItem('juristech_user_role', 'client');
            }
          }
        }
      } catch (err) {
        console.warn('AuthContext profile check error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (session.user.email === 'drzyogo.ca@gmail.com') {
          setRoleState('super-admin');
          localStorage.setItem('juristech_user_role', 'super-admin');
          localStorage.setItem('juristech_user_email', session.user.email);
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'admin' || profile?.role === 'super-admin') {
            setRoleState(profile.role as UserRole);
            localStorage.setItem('juristech_user_role', profile.role);
          } else {
            setRoleState('client');
            localStorage.setItem('juristech_user_role', 'client');
          }
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  function setRole(newRole: UserRole) {
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('juristech_user_email') : null;
    const isAdminAuthed = typeof window !== 'undefined' ? localStorage.getItem('juristech_admin_authenticated') === 'true' : false;

    if ((newRole === 'super-admin' || newRole === 'admin') && savedEmail !== 'drzyogo.ca@gmail.com' && !isAdminAuthed) {
      console.warn('Security Guard: Rejecting unauthorized admin role assignment.');
      setRoleState('client');
      try {
        localStorage.setItem('juristech_user_role', 'client');
      } catch {}
      return;
    }

    setRoleState(newRole);
    try {
      localStorage.setItem('juristech_user_role', newRole);
    } catch {
      // Ignore storage error
    }
  }

  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('juristech_2fa_verified_session') === 'true';
    } catch {
      return false;
    }
  });

  async function verify2FATokenSession(token: string): Promise<boolean> {
    const userEmail = localStorage.getItem('juristech_user_email') || 'drzyogo.ca@gmail.com';
    const secret = localStorage.getItem(`ls_2fa_secret_${userEmail}`) || 'JURISTECHSUPERADMIN2026SECRETKEY';
    const isValid = await import('./twoFactorEngine').then(m => m.verify2FAToken(token, secret));
    if (isValid) {
      setIs2FAVerified(true);
      try {
        sessionStorage.setItem('juristech_2fa_verified_session', 'true');
      } catch {}
    }
    return isValid;
  }

  const isAdmin = role === 'admin' || role === 'super-admin' || role === 'Super Admin' || role === 'Admin';
  const isLawyer = role === 'Lawyer' || role === 'admin' || role === 'super-admin' || role === 'Super Admin' || role === 'Admin';

  return (
    <AuthContext.Provider value={{ role, setRole, isAdmin, isLawyer, user, loading, twoFactorEnabled, is2FAVerified, enableTwoFactor, disableTwoFactor, verify2FATokenSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
