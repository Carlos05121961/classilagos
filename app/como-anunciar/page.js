export default function ComoAnunciarPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
            Anunciantes
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Como anunciar no Classilagos
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
            Divulgue seus imóveis, veículos, serviços, comércio, vagas de
            emprego, pousadas e muito mais em toda a Região dos Lagos.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(0,0,0,0.7)]">
          <h2 className="text-lg font-semibold text-slate-50 mb-4">
            Anunciar é simples, rápido e gratuito
          </h2>

          <p className="text-sm md:text-base text-slate-200 mb-4">
            Você pode anunciar em diversas categorias:{" "}
            <strong>Imóveis, Veículos, Náutica, Pets, Empregos, Serviços,
            LagoListas (comércio local), Turismo</strong> e muito mais.
          </p>

          <ol className="space-y-3 text-sm md:text-base text-slate-200 mb-6 list-decimal list-inside">
            <li>
              Clique em <strong>"Anuncie Grátis"</strong> no topo do site.
            </li>
            <li>
              Escolha a categoria que melhor representa o seu anúncio
              (imóvel, veículo, serviço, vaga, comércio, pousada etc.).
            </li>
            <li>
              Preencha o formulário com as informações principais: título,
              descrição, cidade, contatos e outros detalhes.
            </li>
            <li>
              Envie fotos ou imagens de boa qualidade (quando for o caso).
            </li>
            <li>
              Clique em <strong>Salvar</strong> e pronto: seu anúncio será
              publicado no portal.
            </li>
          </ol>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4">
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Anúncios gratuitos
              </h3>
              <p className="text-xs text-slate-300">
                Todos podem anunciar gratuitamente por tempo limitado, em
                diversas categorias, ajudando a movimentar o comércio e as
                oportunidades da nossa região.
              </p>
            </div>

            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4">
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Anúncios em destaque
              </h3>
              <p className="text-xs text-slate-300 mb-1">
                A modalidade <strong>Destaque</strong> posiciona o seu anúncio
                em áreas privilegiadas do site, como:
              </p>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Primeiras posições na categoria</li>
                <li>Blocos especiais na página inicial</li>
                <li>Maior visibilidade e mais contatos</li>
              </ul>
              <p className="text-xs text-slate-400 mt-2">
                Em breve, você encontrará aqui a tabela de planos e formas de
                pagamento.
              </p>
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-300">
            <p>
              Dúvidas sobre anúncios? Entre em contato pelo{" "}
              <strong>Fale Conosco</strong> para suporte personalizado.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
