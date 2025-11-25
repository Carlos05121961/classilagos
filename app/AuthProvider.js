"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca usuário atual e escuta mudanças de login/logout
  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Erro ao obter usuário:", error.message);
        }

        if (!ignore) {
          setUser(user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro inesperado ao obter usuário:", err);
        if (!ignore) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    loadUser();

    // Escuta login / logout / atualização de sessão
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  // Logout
  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }

  const value = {
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar em qualquer componente (ex: SiteHeader)
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
