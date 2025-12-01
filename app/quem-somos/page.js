export default function QuemSomosPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-50">
      {/* HERO / TÍTULO */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
            Institucional
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Quem somos
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
            Classilagos – o seu guia de compras, serviços, turismo e
            oportunidades em toda a Região dos Lagos.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(0,0,0,0.7)]">
          <p className="text-sm md:text-base text-slate-200 mb-4">
            O <strong>Classilagos</strong> é um portal moderno que reúne{" "}
            <strong>compras, serviços, turismo, empregos, comércio local e
            oportunidades</strong> de toda a Região dos Lagos, conectando
            moradores, visitantes e empreendedores em um único lugar.
          </p>

          <p className="text-sm md:text-base text-slate-200 mb-4">
            Nossa proposta é facilitar a vida das pessoas, oferecendo um espaço
            confiável para divulgar negócios, encontrar serviços, buscar
            hospedagem, anunciar vagas de emprego, cadastrar currículos,
            conhecer novidades e explorar o melhor da nossa região.
          </p>

          <p className="text-sm md:text-base text-slate-200 mb-6">
            Tecnologia atualizada, cuidado com o design e foco na{" "}
            <strong>Região dos Lagos</strong>: o Classilagos nasce para ser um
            grande hub digital regional, valorizando cada cidade, cada bairro e
            cada história que faz parte desse litoral único.
          </p>

          <div className="grid gap-6 md:grid-cols-3 mt-4">
            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-50 mb-2">
                Nossa missão
              </h2>
              <p className="text-xs text-slate-300">
                Promover conexões reais entre quem oferece e quem procura,
                fortalecendo o comércio local, o turismo e as oportunidades de
                trabalho na Região dos Lagos.
              </p>
            </div>

            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-50 mb-2">
                Nossa visão
              </h2>
              <p className="text-xs text-slate-300">
                Ser referência regional em classificados, guia comercial,
                turismo e informação, com uma plataforma moderna, atualizada e
                próxima do público.
              </p>
            </div>

            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-50 mb-2">
                Nossos valores
              </h2>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Transparência e responsabilidade</li>
                <li>Apoio ao comércio local</li>
                <li>Inovação e qualidade</li>
                <li>Respeito às pessoas</li>
                <li>Valorização da cultura e do turismo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
