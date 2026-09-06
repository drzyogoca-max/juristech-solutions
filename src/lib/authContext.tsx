import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { isAuthorizedAdminEmail, verifyAdminAccess, grantAdminAuth, revokeAdminAuth } from './adminGuard';

export type UserRole = 'client' | 'admin' | 'super-admin' | 'Super Admin' | 'Admin' | 'Lawyer' | 'Client / Viewer';

export interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isLawyer: boolean;
  user: any;
  session: any;
  isAuthenticated: boolean;
  loading: boolean;
  twoFactorEnabled: boolean;
  is2FAVerified: boolean;
  enableTwoFactor: () => void;
  disableTwoFactor: () => void;
  verify2FATokenSession: (token: string) => Promise<boolean>;
  logoutAdmin: () => void;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  role: 'client',
  setRole: () => {},
  isAdmin: false,
  isLawyer: false,
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  twoFactorEnabled: false,
  is2FAVerified: false,
  enableTwoFactor: () => {},
  disableTwoFactor: () => {},
  verify2FATokenSession: async () => false,
  logoutAdmin: () => {},
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  logout: async () => ({ error: null }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Baseline: 100% of unauthenticated visitors/guests start as 'client'
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return 'client';
    const isSessionAuthed = verifyAdminAccess();
    if (isSessionAuthed) {
      return 'super-admin';
    }
    return 'client';
  });

  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);

  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('juristech_2fa_verified_session') === 'true' && verifyAdminAccess();
    } catch {
      return false;
    }
  });

  function enableTwoFactor() {
    setTwoFactorEnabled(true);
  }

  function disableTwoFactor() {
    setTwoFactorEnabled(false);
  }

  function logoutAdmin() {
    revokeAdminAuth();
    setIs2FAVerified(false);
    setRoleState('client');
    setUser(null);
    setSession(null);
    try {
      supabase.auth.signOut();
    } catch {}
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
      }
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  async function signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || '',
          },
        },
      });
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
      }
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      if (!verifyAdminAccess()) {
        setRoleState('client');
        setIs2FAVerified(false);
      }
      return { error: error || null };
    } catch (err: any) {
      setUser(null);
      setSession(null);
      return { error: err };
    }
  }

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          const email = session.user.email?.toLowerCase();
          
          if (isAuthorizedAdminEmail(email)) {
            setRoleState('super-admin');
          } else {
            // Check role from profiles table in Supabase if table exists
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

              if (!error && (profile?.role === 'admin' || profile?.role === 'super-admin')) {
                setRoleState(profile.role as UserRole);
              } else {
                setRoleState('client');
              }
            } catch {
              setRoleState('client');
            }
          }
        } else {
          setSession(null);
          // Unauthenticated: Verify if active session token exists in sessionStorage
          if (verifyAdminAccess()) {
            setRoleState('super-admin');
            setIs2FAVerified(true);
          } else {
            setRoleState('client');
            setIs2FAVerified(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('AuthContext check:', err);
        setRoleState('client');
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        const email = session.user.email?.toLowerCase();
        
        if (isAuthorizedAdminEmail(email)) {
          setRoleState('super-admin');
        } else {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (!error && (profile?.role === 'admin' || profile?.role === 'super-admin')) {
              setRoleState(profile.role as UserRole);
            } else {
              setRoleState('client');
            }
          } catch {
            setRoleState('client');
          }
        }
      } else {
        setSession(null);
        if (!verifyAdminAccess()) {
          setUser(null);
          setRoleState('client');
          setIs2FAVerified(false);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  function setRole(newRole: UserRole) {
    const isSessionAuthed = verifyAdminAccess();
    const isUserAdmin = user && isAuthorizedAdminEmail(user.email);

    if ((newRole === 'super-admin' || newRole === 'admin') && !isUserAdmin && !isSessionAuthed) {
      console.warn('Security Guard: Blocked unauthorized role privilege escalation attempt.');
      setRoleState('client');
      return;
    }

    setRoleState(newRole);
  }

  async function verify2FATokenSession(token: string): Promise<boolean> {
    const targetEmail = user?.email || sessionStorage.getItem('juristech_admin_email') || 'drzyogo.ca@gmail.com';
    if (!isAuthorizedAdminEmail(targetEmail)) {
      return false;
    }
    const secret = localStorage.getItem(`ls_2fa_secret_${targetEmail}`);
    if (!secret) {
      console.warn('2FA verification attempted with unconfigured secret.');
      return false;
    }
    const isValid = await import('./twoFactorEngine').then(m => m.verify2FAToken(token, secret));
    if (isValid) {
      setIs2FAVerified(true);
      grantAdminAuth(targetEmail);
      setRoleState('super-admin');
    }
    return isValid;
  }

  // Strict Evaluation: User is ADMIN ONLY IF actively authenticated with authorized email OR valid session token
  const isSessionAdmin = verifyAdminAccess();
  const isSupabaseAdmin = user !== null && isAuthorizedAdminEmail(user?.email) && (role === 'super-admin' || role === 'admin');
  const isAdmin = isSessionAdmin || isSupabaseAdmin;
  const isLawyer = role === 'Lawyer' || isAdmin;
  const isAuthenticated = user !== null || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        isAdmin,
        isLawyer,
        user,
        session,
        isAuthenticated,
        loading,
        twoFactorEnabled,
        is2FAVerified,
        enableTwoFactor,
        disableTwoFactor,
        verify2FATokenSession,
        logoutAdmin,
        signIn,
        signUp,
        signOut,
        logout: signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
