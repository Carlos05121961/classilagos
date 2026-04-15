"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForAuthenticatedUser() {
  const maxAttempts = 12;
  const delayMs = 500;

  for (let i = 0; i < maxAttempts; i += 1) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) return user;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) return session.user;

    await sleep(delayMs);
  }

  return null;
}

export default function ConfirmarAnuncioPage() {
  const router = useRouter();

  const [status, setStatus] = useState("confirmando");
  const [mensagem, setMensagem] = useState("Confirmando seu cadastro e ativando seu anúncio...");
  const [erroDetalhe, setErroDetalhe] = useState("");

  useEffect(() => {
    let ativo = true;

    async function confirmar() {
      try {
        const params = new URLSearchParams(window.location.search);
        const anuncioId = params.get("anuncio");

        if (!anuncioId) {
          if (!ativo) return;
          setStatus("erro");
          setMensagem("Não encontramos o anúncio para confirmar.");
          setErroDetalhe("O link de confirmação está incompleto ou inválido.");
          return;
        }

        const user = await waitForAuthenticatedUser();

        if (!user) {
          if (!ativo) return;
          setStatus("erro");
          setMensagem("Não foi possível confirmar seu acesso agora.");
          setErroDetalhe(
            "Abra novamente o link recebido por e-mail. Se preferir, faça login primeiro e depois tente de novo."
          );
          return;
        }

        const { data: anuncio, error: anuncioError } = await supabase
          .from("anuncios")
          .select("id, user_id, email, status, email_confirmado")
          .eq("id", anuncioId)
          .single();

        if (anuncioError || !anuncio) {
          console.error("Erro ao buscar anúncio:", anuncioError);
          if (!ativo) return;
          setStatus("erro");
          setMensagem("Não conseguimos localizar o anúncio para ativação.");
          setErroDetalhe("Verifique se o link está correto ou tente novamente em instantes.");
          return;
        }

        const emailDoAnuncio = String(anuncio.email || "").trim().toLowerCase();
        const emailDoUsuario = String(user.email || "").trim().toLowerCase();

        if (emailDoAnuncio && emailDoUsuario && emailDoAnuncio !== emailDoUsuario) {
          if (!ativo) return;
          setStatus("erro");
          setMensagem("Este anúncio está vinculado a outro e-mail.");
          setErroDetalhe(
            "Entre com o mesmo e-mail usado no formulário para confirmar e ativar este anúncio."
          );
          return;
        }

        if (anuncio.user_id && anuncio.user_id !== user.id) {
          if (!ativo) return;
          setStatus("erro");
          setMensagem("Este anúncio já foi associado a outra conta.");
          setErroDetalhe("Se isso não era esperado, pare aqui e me chame antes de mexer em mais alguma coisa.");
          return;
        }

        if (
          anuncio.user_id === user.id &&
          anuncio.email_confirmado === true &&
          anuncio.status === "ativo"
        ) {
          if (!ativo) return;
          setStatus("sucesso");
          setMensagem("Seu anúncio já estava confirmado. Redirecionando para o painel...");
          setTimeout(() => {
            router.replace("/painel/meus-anuncios");
          }, 1200);
          return;
        }

        const { error: updateError } = await supabase
          .from("anuncios")
          .update({
            user_id: user.id,
            status: "ativo",
            email_confirmado: true,
            email_confirmado_em: new Date().toISOString(),
          })
          .eq("id", anuncioId);

        if (updateError) {
          console.error("Erro ao adotar/ativar anúncio:", updateError);
          if (!ativo) return;
          setStatus("erro");
          setMensagem("Seu login foi confirmado, mas o anúncio não pôde ser ativado agora.");
          setErroDetalhe(
            "Isso normalmente acontece quando a policy de UPDATE ainda não permite adotar anúncios pendentes."
          );
          return;
        }

        if (!ativo) return;
        setStatus("sucesso");
        setMensagem("Cadastro confirmado e anúncio ativado com sucesso! Redirecionando para o painel...");

        setTimeout(() => {
          router.replace("/painel/meus-anuncios");
        }, 1200);
      } catch (err) {
        console.error("Erro geral na confirmação do anúncio:", err);
        if (!ativo) return;
        setStatus("erro");
        setMensagem("Ocorreu um erro ao confirmar seu anúncio.");
        setErroDetalhe("Tente novamente em instantes.");
      }
    }

    confirmar();

    return () => {
      ativo = false;
    };
  }, [router]);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                status === "sucesso"
                  ? "bg-emerald-100"
                  : status === "erro"
                  ? "bg-red-100"
                  : "bg-blue-100"
              }`}
            >
              {status === "sucesso" ? "✅" : status === "erro" ? "⚠️" : "⏳"}
            </div>

            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-bold text-slate-900">
                {status === "sucesso"
                  ? "Confirmação concluída"
                  : status === "erro"
                  ? "Não foi possível concluir"
                  : "Confirmando seu anúncio"}
              </h1>

              <p className="mt-2 text-sm text-slate-700">{mensagem}</p>

              {erroDetalhe ? (
                <p className="mt-3 text-sm text-slate-500">{erroDetalhe}</p>
              ) : null}

              {status === "erro" ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Ir para login
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Voltar ao início
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
