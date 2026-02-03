"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabaseClient";
import FormularioEventos from "../../../components/forms/FormularioEventos";

function isPerfilCompleto(user) {
  const meta = user?.user_metadata || {};
  const nome = String(meta.nome || "").trim();
  const cidade = String(meta.cidade || "").trim();
  const whatsapp = String(meta.whatsapp || "").trim();
  return Boolean(nome && cidade && whatsapp);
}

function getSrcFromUrl() {
  try {
    const qs = new URLSearchParams(window.location.search);
    return (qs.get("src") || "").toLowerCase();
  } catch {
    return "";
  }
}

export default function AnunciarEventosPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isLand, setIsLand] = useState(false);

  const nextDest = useMemo(() => {
    return isLand ? "/anunciar/servicos/eventos?src=land" : "/anunciar/servicos/eventos";
  }, [isLand]);

  useEffect(() => {
    setIsLand(getSrcFromUrl() === "land");
  }, []);

  useEffect(() => {
    let alive = true;

    async function guard() {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (isLand) {
          if (!alive) return;
          setReady(true);
          return;
        }

        if (!user) {
          router.replace(`/cadastro?next=${encodeURIComponent(nextDest)}`);
          return;
        }

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
  }, [router, isLand, nextDest]);

  if (!ready) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">Preparando seu acesso…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-fuchsia-50 px-3 py-1 text-[11px] font-semibold text-fuchsia-700 border border-fuchsia-200">
            Festas &amp; eventos {isLand ? "• Modo campanha" : ""}
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar serviço para festas e eventos
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Buffets, bolos, doces, decoração, DJ, som, luz, foto, vídeo, espaços para festas
            e tudo o que seu evento precisa na Região dos Lagos.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
          <FormularioEventos />
        </div>
      </section>
    </main>
  );
}
