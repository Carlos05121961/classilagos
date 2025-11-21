// app/cadastro/sucesso/page.js
import Link from "next/link";

export default function CadastroSucessoPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Faixa superior */}
        <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/40">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
              Classilagos
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Cadastro realizado com sucesso!
            </h1>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-7 space-y-4">
          <p className="text-sm text-slate-700">
            Seja bem-vindo(a) ao{" "}
            <span className="font-semibold">Classilagos</span>, o seu guia de
            compras e serviços na Região dos Lagos. 🙌
          </p>

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold mb-1">O que você pode fazer agora?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Acessar o seu painel e completar seu perfil.</li>
              <li>Criar anúncios de imóveis, veículos, serviços e muito mais.</li>
              <li>Explorar oportunidades na sua cidade e região.</li>
            </ul>
          </div>

          <p className="text-xs text-slate-500">
            Dica: guarde seus dados de acesso com cuidado. Você poderá alterar
            informações do seu cadastro e anúncios a qualquer momento pelo
            painel do usuário.
          </p>

          {/* Botões */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/painel"
              className="flex-1 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
            >
              Ir para o meu painel
            </Link>

            <Link
              href="/anunciar"
              className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Criar meu primeiro anúncio
            </Link>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
          <p className="text-[11px] text-slate-500 text-center">
            Classilagos • Aqui a sua vitrine é a Região dos Lagos inteira.
          </p>
        </div>
      </div>
    </div>
  );
}
