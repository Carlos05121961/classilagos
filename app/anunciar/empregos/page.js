"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormularioEmpregos from "../../components/forms/FormularioEmpregos";
import { supabase } from "../../supabaseClient";

function isPerfilCompleto(user) {
  const meta = user?.user_metadata || {};
  const nome = String(meta.nome || "").trim();
  const cidade = String(meta.cidade || "").trim();
  const whatsapp = String(meta.whatsapp || "").trim();
  return Boolean(nome && cidade && whatsapp);
}

export default function AnunciarEmpregosPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function guard() {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        // 1) Sem sessão -> vai pro cadastro (mantém o destino)
        if (!user) {
          router.replace("/cadastro?next=/anunciar/empregos");
          return;
        }

        // 2) Sessão ok, mas perfil incompleto -> vai pro perfil (mantém o destino)
        if (!isPerfilCompleto(user)) {
          router.replace("/perfil?next=/anunciar/empregos");
          return;
        }

        // 3) Tudo ok -> libera
        if (!alive) return;
        setReady(true);
      } catch (e) {
        console.error(e);
        router.replace("/cadastro?next=/anunciar/empregos");
      }
    }

    guard();

    return () => {
      alive = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">Preparando seu acesso…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie gratuitamente
        </p>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Publicar vaga de emprego
        </h1>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl">
          Preencha os dados da vaga e publique gratuitamente no Classilagos.
        </p>
      </header>

      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioEmpregos />
      </section>
    </main>
  );
}

