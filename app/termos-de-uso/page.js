export default function TermosDeUsoPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
            Legal
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Termos de uso
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
            Ao utilizar o portal Classilagos, você concorda com as condições
            descritas abaixo.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(0,0,0,0.7)] text-sm md:text-base text-slate-200 space-y-4">
          <p>
            O <strong>Classilagos</strong> é um portal de classificados, guia
            comercial, notícias e turismo voltado para a Região dos Lagos. Ao
            acessar e utilizar o site, o usuário declara estar de acordo com
            estes Termos de Uso.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            1. Responsabilidade pelos anúncios
          </h2>
          <p>
            Todo conteúdo publicado em anúncios (textos, preços, fotos, links,
            contatos e demais informações) é de responsabilidade exclusiva do{" "}
            <strong>anunciante</strong>. O Classilagos não garante, endossa ou
            se responsabiliza por negociações realizadas entre usuários,
            empresas ou terceiros.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            2. Conteúdos proibidos
          </h2>
          <p>Não é permitido o uso do portal para:</p>
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            <li>Publicação de conteúdos falsos, enganosos ou fraudulentos;</li>
            <li>Ofertas que violem leis brasileiras;</li>
            <li>Conteúdo ofensivo, discriminatório, ilegal ou impróprio;</li>
            <li>Divulgação de spam ou esquemas ilícitos.</li>
          </ul>

          <p>
            O Classilagos se reserva o direito de remover anúncios ou conteúdos
            que violem estes termos, sem necessidade de aviso prévio.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            3. Uso do portal
          </h2>
          <p>
            O usuário se compromete a utilizar o site de forma ética e
            responsável, não tentando burlar o sistema, comprometer a
            segurança da plataforma ou prejudicar outros usuários.
          </p>

          <h2 className="text-sm font-semibold text-slate-50 mt-4">
            4. Modificações
          </h2>
          <p>
            Estes Termos de Uso podem ser atualizados a qualquer momento. As
            alterações entram em vigor a partir de sua publicação nesta página.
          </p>

          <p className="text-xs text-slate-400 mt-4">
            Em caso de dúvidas sobre estes termos, entre em contato pelo canal{" "}
            <strong>Fale Conosco</strong>.
          </p>
        </div>
      </section>
    </main>
  );
}
