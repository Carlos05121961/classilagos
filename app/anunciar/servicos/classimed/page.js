"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabaseClient";
import FormularioClassimed from "../../../components/forms/FormularioClassimed";

function isPerfilCompleto(user) {
  const meta = user?.user_metadata || {};
  const nome = String(meta.nome || "").trim();
  const cidade = String(meta.cidade || "").trim();
  const whatsapp = String(meta.whatsapp || "").trim();
  return Boolean(nome && cidade && whatsapp);
}

function getSrc() {
  try {
    const qs = new URLSearchParams(window.location.search);
    return (qs.get("src") || "").toLowerCase();
  } catch {
    return "";
  }
}

export default function AnunciarClassimedPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isCampanha, setIsCampanha] = useState(false);

  const nextDest = useMemo(() => {
    return isCampanha
      ? "/anunciar/servicos/classimed?src=campanha"
      : "/anunciar/servicos/classimed";
  }, [isCampanha]);

  useEffect(() => {
    let alive = true;

    async function guard() {
      try {
        const src = getSrc();
        const campanhaNow = src === "campanha";
        if (alive) setIsCampanha(campanhaNow);

        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        // ✅ Se não estiver logado: sempre manda pro cadastro com next
        if (!user) {
          router.replace(`/cadastro?src=${campanhaNow ? "campanha" : ""}&next=${encodeURIComponent(nextDest)}`);
          return;
        }

        // ✅ CAMPANHA: libera sem exigir perfil completo
        if (campanhaNow) {
          if (!alive) return;
          setReady(true);
          return;
        }

        // 🔵 NORMAL: exige perfil completo
        if (!isPerfilCompleto(user)) {
          router.replace(`/perfil?next=${encodeURIComponent(nextDest)}`);
          return;
        }

        if (!alive) return;
        setReady(true);
      } catch (e) {
        console.error(e);
        router.replace(`/cadastro?next=${encodeURIComponent(nextDest)}`);
      }
    }

    guard();
    return () => {
      alive = false;
    };
  }, [router, nextDest]);

  if (!ready) {
    return (
      <main className="bg-slate-50 min-h-screen pb-12">
        <section className="max-w-5xl mx-auto px-4 pt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Preparando seu acesso…</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
            Classimed – Saúde &amp; bem-estar {isCampanha ? "• Campanha" : ""}
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar serviço de saúde
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Cadastre seu serviço de saúde, clínica, consultório ou terapia para
            ser encontrado por moradores e visitantes de toda a Região dos Lagos.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
          <FormularioClassimed />
        </div>
      </section>
    </main>
  );
}
