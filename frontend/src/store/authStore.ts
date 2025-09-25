import { create } from 'zustand';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { User, AuthState } from '../types';

// Configuración de Supabase desde variables de entorno
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const missingSupabaseEnv = !supabaseUrl || !supabaseKey;

if (missingSupabaseEnv) {
  // Ayuda en desarrollo para detectar .env no configurado
  // No lanzamos excepción para no romper la app completa; los métodos del store mostrarán un error claro
  // eslint-disable-next-line no-console
  console.error(
    'Supabase no está configurado. Define REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY en frontend/.env'
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
      const { data, error } = await (supabase as SupabaseClient).auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.user_metadata?.username
          },
          isLoading: false
        });
      }
    } catch (error: any) {
      const message =
        error?.message?.toLowerCase?.().includes('fetch') || error?.name === 'TypeError'
          ? 'No se pudo conectar con Supabase. Verifica tu conexión y variables REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY.'
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
      const { data, error } = await (supabase as SupabaseClient).auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.user_metadata?.username
          },
          isLoading: false
        });
      }
    } catch (error: any) {
      const message =
        error?.message?.toLowerCase?.().includes('fetch') || error?.name === 'TypeError'
          ? 'No se pudo conectar con Supabase. Verifica tu conexión y variables REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY.'
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
      const { error } = await (supabase as SupabaseClient).auth.signOut();

      if (error) {
        throw error;
      }

      set({
        user: null,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cerrar sesión',
        isLoading: false
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Escuchar cambios de autenticación
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      useAuthStore.setState({
        user: {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username
        }
      });
    } else {
      useAuthStore.setState({ user: null });
    }
  });
}

