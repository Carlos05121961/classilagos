// app/auth/check-email/page.js
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-100">
            Classilagos • Região dos Lagos
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            Quase lá! Confirme seu e-mail ✉️
          </h1>
        </div>

        <div className="px-6 py-7 space-y-4">
          <p className="text-sm text-slate-600">
            Seu anúncio foi enviado com sucesso para o{" "}
            <span className="font-semibold">Classilagos</span>.
            Agora só falta confirmar seu e-mail para ativar seu anúncio e vincular
            ele à sua conta.
          </p>

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold mb-1">O que fazer agora?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abra a caixa de entrada do e-mail que você cadastrou.</li>
              <li>
                Procure por uma mensagem do <span className="font-semibold">Classilagos</span>.
              </li>
              <li>
                Clique no botão de confirmação do e-mail.
              </li>
              <li>
                Após confirmar, seu anúncio será ativado e você será redirecionado
                para <span className="font-semibold">Meus anúncios</span>.
              </li>
            </ol>
          </div>

          <p className="text-xs text-slate-500">
            Dica: se não encontrar o e-mail, verifique também as abas{" "}
            <span className="font-semibold">Promoções</span>,{" "}
            <span className="font-semibold">Atualizações</span> ou a pasta{" "}
            <span className="font-semibold">Spam</span>.
          </p>

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
              href="/"
              className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Voltar ao início
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
          <p className="text-[11px] text-slate-500 text-center">
            Classilagos • O seu guia de compras e serviços na Região dos Lagos.
          </p>
        </div>
      </div>
    </div>
  );
}
