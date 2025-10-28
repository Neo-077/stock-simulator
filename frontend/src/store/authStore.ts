import { create } from 'zustand';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { type AuthState } from '../types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const missingSupabaseEnv = !supabaseUrl || !supabaseKey;

if (missingSupabaseEnv) {
  console.error(
    '⚠️ Supabase no está configurado. Define REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY en frontend/.env'
  );
}

let supabase: SupabaseClient | null = null;
if (!missingSupabaseEnv) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

interface AuthStore extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      if (missingSupabaseEnv || !supabase) {
        throw new Error('Configuración de Supabase faltante. Revisa tu archivo frontend/.env');
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.user_metadata?.username,
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error: any) {
      const message =
        error?.message?.toLowerCase?.().includes('fetch') || error?.name === 'TypeError'
          ? 'No se pudo conectar con Supabase. Verifica tu conexión y variables de entorno.'
          : error?.message || 'Error al registrar usuario';
      set({ error: message, isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      if (missingSupabaseEnv || !supabase) {
        throw new Error('Configuración de Supabase faltante. Revisa tu archivo frontend/.env');
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.user_metadata?.username,
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error: any) {
      const message =
        error?.message?.toLowerCase?.().includes('fetch') || error?.name === 'TypeError'
          ? 'No se pudo conectar con Supabase. Verifica tu conexión y variables de entorno.'
          : error?.message || 'Error al iniciar sesión';
      set({ error: message, isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      if (missingSupabaseEnv || !supabase) {
        throw new Error('Configuración de Supabase faltante. Revisa tu archivo frontend/.env');
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error.message || 'Error al cerrar sesión', isLoading: false });
    }
  },

  refreshSession: async () => {
    try {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email || '',
            username: user.user_metadata?.username,
          },
        });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    }
  },

  clearError: () => set({ error: null }),
}));

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      useAuthStore.setState({
        user: {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username,
        },
      });
    } else {
      useAuthStore.setState({ user: null });
    }
  });
}
