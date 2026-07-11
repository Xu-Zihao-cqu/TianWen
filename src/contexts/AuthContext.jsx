import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient.js';

export const AuthContext = createContext({
  session: null,
  user: null,
  profile: null,
  role: null,
  loading: true,
  error: '',
  notice: '',
  configReady: false,
  isAuthenticated: false,
  loginWithEmail: () => {},
  loginWithGitHub: () => {},
  loginAsGuest: () => {},
  logout: () => {},
  clearMessages: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const clearMessages = useCallback(() => {
    setError('');
    setNotice('');
  }, []);

  const inferProvider = useCallback((user) => {
    if (!user) return 'unknown';
    if (user.is_anonymous) return 'guest';
    const provider = user.app_metadata?.provider;
    if (provider === 'github') return 'github';
    const email = user.email?.toLowerCase() || '';
    if (email.endsWith('@qq.com')) return 'qq_email';
    if (email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')) return 'gmail_email';
    return provider || 'unknown';
  }, []);

  const loadProfile = useCallback(async (user) => {
    if (!supabase || !user) {
      setProfile(null);
      return null;
    }

    const provider = inferProvider(user);
    const profilePatch = {
      email: user.email || null,
      display_name:
        user.user_metadata?.full_name ||
        user.user_metadata?.user_name ||
        user.email ||
        (user.is_anonymous ? 'Guest' : null),
      login_provider: provider,
      is_online: true,
      last_seen_at: new Date().toISOString(),
    };

    await supabase
      .from('profiles')
      .update(profilePatch)
      .eq('id', user.id);

    let { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setProfile(null);
      return null;
    }

    if (!data) {
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          ...profilePatch,
          role: user.is_anonymous ? 'Guest' : 'User',
        })
        .select('*')
        .maybeSingle();

      if (insertError) {
        setError(insertError.message);
        setProfile(null);
        return null;
      }

      data = insertedProfile;
    }

    setProfile(data);
    return data;
  }, [inferProvider]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        await loadProfile(data.session.user);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        window.setTimeout(() => {
          loadProfile(nextSession.user);
        }, 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  useEffect(() => {
    if (!supabase || !session?.user) return undefined;

    const heartbeat = window.setInterval(() => {
      supabase
        .from('profiles')
        .update({ is_online: true, last_seen_at: new Date().toISOString() })
        .eq('id', session.user.id);
    }, 60000);

    return () => window.clearInterval(heartbeat);
  }, [session]);

  const loginWithEmail = useCallback(async (email) => {
    clearMessages();
    if (!supabase) {
      setError('Supabase is not configured.');
      return { error: new Error('Supabase is not configured.') };
    }

    const normalized = email.trim().toLowerCase();
    const isAllowedEmail =
      normalized.endsWith('@qq.com') ||
      normalized.endsWith('@gmail.com') ||
      normalized.endsWith('@googlemail.com');

    if (!isAllowedEmail) {
      const message = '当前仅支持 QQ 邮箱和 Gmail 邮箱。';
      setError(message);
      return { error: new Error(message) };
    }

    const loginProvider = normalized.endsWith('@qq.com') ? 'qq_email' : 'gmail_email';
    const { error: loginError } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        emailRedirectTo: window.location.origin,
        data: { login_provider: loginProvider },
      },
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      setNotice('登录链接已发送，请打开邮箱完成登录。');
    }

    return { error: loginError };
  }, [clearMessages]);

  const loginWithGitHub = useCallback(async () => {
    clearMessages();
    if (!supabase) {
      setError('Supabase is not configured.');
      return { error: new Error('Supabase is not configured.') };
    }

    const { error: loginError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
        scopes: 'read:user user:email',
      },
    });

    if (loginError) setError(loginError.message);
    return { error: loginError };
  }, [clearMessages]);

  const loginAsGuest = useCallback(async () => {
    clearMessages();
    if (!supabase) {
      setError('Supabase is not configured.');
      return { error: new Error('Supabase is not configured.') };
    }

    const { error: loginError } = await supabase.auth.signInAnonymously({
      options: {
        data: { login_provider: 'guest' },
      },
    });

    if (loginError) {
      setError(loginError.message);
    }

    return { error: loginError };
  }, [clearMessages]);

  const logout = useCallback(async () => {
    clearMessages();
    if (!supabase) return;

    const currentUserId = session?.user?.id;
    if (currentUserId) {
      await supabase
        .from('profiles')
        .update({ is_online: false, last_seen_at: new Date().toISOString() })
        .eq('id', currentUserId);
    }

    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setError(logoutError.message);
  }, [clearMessages, session]);

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    profile,
    role: profile?.role || null,
    loading,
    error,
    notice,
    configReady: isSupabaseConfigured,
    isAuthenticated: Boolean(session?.user),
    loginWithEmail,
    loginWithGitHub,
    loginAsGuest,
    logout,
    clearMessages,
  }), [
    session,
    profile,
    loading,
    error,
    notice,
    loginWithEmail,
    loginWithGitHub,
    loginAsGuest,
    logout,
    clearMessages,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
