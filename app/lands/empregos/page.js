"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import PremiumButton from "../../components/PremiumButton";

const NEXT_CURRICULO = "/anunciar/curriculo";
const NEXT_VAGA = "/anunciar/empregos";

export default function LandEmpregos() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const { data } = await supabase.auth.getSession();
        const ok = !!data?.session;
        if (!mounted) return;
        setIsLogged(ok);
      } catch {
        // se der erro, mantém como não logado (não trava a landing)
        if (!mounted) return;
        setIsLogged(false);
      } finally {
        if (!mounted) return;
        setCheckingAuth(false);
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, []);

  function go(nextPath) {
    // Se está logado, vai direto pro form.
    // Se não, manda pro cadastro com ?next=
    if (isLogged) {
      router.push(nextPath);
      return;
    }
    router.push(`/cadastro?next=${encodeURIComponent(nextPath)}`);
  }

  return (
    <main className="min-h-[70vh] px-4 py-10 bg-slate-50">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          {/* selo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Empregos • 100% grátis
          </div>

          {/* título */}
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            Seu primeiro emprego
            <br />
            começa aqui.
          </h1>

          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-2xl">
            Cadastre seu currículo ou anuncie uma vaga na Região dos Lagos.
            <span className="font-semibold text-slate-800"> É gratuito.</span>
          </p>

          {/* cards de confiança */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Sem cobrança</p>
              <p className="mt-1 text-xs text-slate-600">Publicação 100% gratuita.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Contato direto</p>
              <p className="mt-1 text-xs text-slate-600">Fale com empresa/candidato.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Região dos Lagos</p>
              <p className="mt-1 text-xs text-slate-600">Vagas e currículos locais.</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <PremiumButton
              onClick={() => go(NEXT_CURRICULO)}
              variant="primary"
              disabled={checkingAuth}
            >
              Começar meu currículo →
            </PremiumButton>

            <PremiumButton
              onClick={() => go(NEXT_VAGA)}
              variant="secondary"
              disabled={checkingAuth}
            >
              Anunciar uma vaga
            </PremiumButton>

            <p className="pt-2 text-xs text-slate-500">
              Plataforma 100% gratuita para currículos e vagas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
