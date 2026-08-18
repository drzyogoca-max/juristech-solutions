import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export type UserRole = 'client' | 'admin' | 'super-admin';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  user: any;
  loading: boolean;
  twoFactorEnabled: boolean;
  enableTwoFactor: () => void;
  disableTwoFactor: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: 'client',
  setRole: () => {},
  isAdmin: false,
  user: null,
  loading: true,
  twoFactorEnabled: false,
  enableTwoFactor: () => {},
  disableTwoFactor: () => {},
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

  const isAdmin = role === 'admin' || role === 'super-admin';

  return (
    <AuthContext.Provider value={{ role, setRole, isAdmin, user, loading, twoFactorEnabled, enableTwoFactor, disableTwoFactor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
