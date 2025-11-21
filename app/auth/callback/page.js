"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function EmailConfirmado() {
  useEffect(() => {
    console.log("E-mail confirmado pelo Supabase.");
  }, []);

  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">E-mail confirmado!</h1>

      <p className="text-gray-700 mb-6">
        Seu e-mail foi confirmado com sucesso.  
        Agora você já pode entrar na sua conta e começar a anunciar.
      </p>

      <Link
        href="/login"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
      >
        Ir para o Login
      </Link>
    </main>
  );
}
