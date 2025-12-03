"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function PainelPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function checarAdmin() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Erro ao buscar usuário no painel:", error);
          setIsAdmin(false);
          return;
        }

        const user = data?.user;
        if (!user) {
          setIsAdmin(false);
          return;
        }

        // salva email só para exibir um "nome" simples no painel
        if (user.email) {
          setUserEmail(user.email);
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profileError && profile?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error("Erro ao checar perfil admin:", e);
        setIsAdmin(false);
      }
    }

    checarAdmin();
  }, []);

  // nome simples: parte antes do @, só pra dar um "Olá, Carlos"
  const displayName = userEmail ? userEmail.split("@")[0] : "bem-vindo(a)";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER MODERNO DO PAINEL */}
        <section className="rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-500 px-6 py-5 text-white shadow-md border border-white/10">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/90">
            Painel Classilagos
          </p>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            Olá, {displayName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-cyan-50/90 mt-1 max-w-xl">
            Aqui você gerencia seus anúncios
            {isAdmin
              ? ", acompanha notícias importadas e outras áreas administrativas do portal."
              : " no Classilagos de forma rápida e organizada."}
          </p>
        </section>

        {/* ÁREA DO USUÁRIO */}
        <section>
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Área do usuário
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Meus anúncios */}
            <Link
              href="/painel/meus-anuncios"
              className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Meus anúncios
                </h3>
                <span className="text-lg" aria-hidden="true">
                  📋
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Veja e gerencie todos os anúncios que você já publicou no
                Classilagos.
              </p>
              <span className="inline-flex text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                Abrir painel de anúncios
              </span>
            </Link>

            {/* Criar novo anúncio */}
            <Link
              href="/anunciar"
              className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Criar novo anúncio
                </h3>
                <span className="text-lg" aria-hidden="true">
                  ➕
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Anuncie imóveis, veículos, serviços, turismo e muito mais em
                poucos minutos.
              </p>
              <span className="inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                Anunciar grátis
              </span>
            </Link>

            {/* LagoListas / Guia Comercial */}
            <Link
              href="/lagolistas"
              className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  LagoListas – Guia Comercial
                </h3>
                <span className="text-lg" aria-hidden="true">
                  🏬
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Acesse o guia comercial da região e veja como seu negócio
                aparece para o público.
              </p>
              <span className="inline-flex text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">
                Abrir LagoListas
              </span>
            </Link>
          </div>
        </section>

        {/* ÁREA ADMINISTRATIVA – só para admins */}
        {isAdmin && (
          <section className="pt-2">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Área administrativa do portal
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Importar notícias */}
              <Link
                href="/painel/importar-noticias"
                className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Importar notícias
                  </h3>
                  <span className="text-lg" aria-hidden="true">
                    📰
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Busque automaticamente notícias do G1 Região dos Lagos e RC24h
                  para o banco de dados.
                </p>
                <span className="inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                  Abrir importador de notícias
                </span>
              </Link>

              {/* Notícias importadas */}
              <Link
                href="/painel/noticias-importadas"
                className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Notícias importadas
                  </h3>
                  <span className="text-lg" aria-hidden="true">
                    ✅
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Veja as notícias trazidas das fontes externas, publique, refine
                  ou exclua o que não for interessante.
                </p>
                <span className="inline-flex text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
                  Gerenciar notícias importadas
                </span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

