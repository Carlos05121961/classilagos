// app/auth/check-email/page.js
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Faixa superior com “marca” */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-100">
            Classilagos • Região dos Lagos
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            Quase lá! Confirme seu cadastro ✉️
          </h1>
        </div>

        {/* Conteúdo principal */}
        <div className="px-6 py-7 space-y-4">
          <p className="text-sm text-slate-600">
            Nós criamos sua conta no <span className="font-semibold">Classilagos</span>.
            Agora só falta você confirmar o e-mail para ativar o acesso e poder
            anunciar seus imóveis, veículos, serviços e muito mais.
          </p>

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold mb-1">O que fazer agora?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abra a caixa de entrada do seu e-mail cadastrado.</li>
              <li>
                Procure por uma mensagem com o assunto{" "}
                <span className="italic">“Confirm Your Signup”</span> ou similar.
              </li>
              <li>
                Clique no botão <span className="font-semibold">“Confirmar seu
                cadastro”</span>.
              </li>
              <li>
                Após confirmar, você será redirecionado para a página de{" "}
                <span className="font-semibold">login</span> e poderá entrar normalmente.
              </li>
            </ol>
          </div>

          <p className="text-xs text-slate-500">
            Dica: se não encontrar o e-mail, veja também as abas{" "}
            <span className="font-semibold">Promoções</span>,{" "}
            <span className="font-semibold">Atualizações</span> ou a pasta{" "}
            <span className="font-semibold">Spam</span>.
          </p>

          {/* Botões de ação */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
            >
              Abrir meu e-mail
            </a>

            <Link
              href="/login"
              className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Já confirmei, ir para o login
            </Link>
          </div>
        </div>

        {/* Rodapé suave */}
        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
          <p className="text-[11px] text-slate-500 text-center">
            Classilagos • O seu guia de compras e serviços na Região dos Lagos.
          </p>
        </div>
      </div>
    </div>
  );
}
