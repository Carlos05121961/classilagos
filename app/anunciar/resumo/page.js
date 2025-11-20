import Link from "next/link";

export default function ResumoAnuncioPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Cabeçalho */}
        <header className="mb-8">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            Novo anúncio
          </p>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
            Resumo do seu anúncio
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Confira os dados antes de publicar. Nesta etapa tudo ainda é{" "}
            <span className="font-semibold">DEMO</span>, mas o fluxo já está
            pronto para futuramente salvar no banco de dados.
          </p>
        </header>

        {/* Cartão principal de resumo */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          {/* Info topo: tipo e status */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Categoria (exemplo)
              </p>
              <p className="text-sm md:text-base font-semibold text-slate-900">
                Imóveis – Casa 2 qts com varanda em Maricá
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
              Status: rascunho (DEMO)
            </span>
          </div>

          {/* Bloco: descrição principal */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Descrição do anúncio
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Casinha branca de varanda com 2 qts, sala, cozinha, banheiro,
              garagem, piscina, deck e varanda. Localizada em Jacaroá, Maricá,
              próxima à lagoa e ao comércio local. Ambiente arejado, rua calma
              e fácil acesso ao Centro.
            </p>
          </div>

          {/* Grade de detalhes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Cidade
              </p>
              <p className="text-slate-900">Maricá</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Bairro / Região
              </p>
              <p className="text-slate-900">Jacaroá</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Telefone / Contato
              </p>
              <p className="text-slate-900">(21) 96746-3576</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                WhatsApp
              </p>
              <p className="text-slate-900">(21) 96746-3576</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Valor (R$)
              </p>
              <p className="text-slate-900">450.000,00</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tipo de anúncio
              </p>
              <p className="text-slate-900">Venda</p>
            </div>
          </div>

          {/* Aviso demo */}
          <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-600">
            <p>
              <strong>Atenção:</strong> este resumo é apenas um{" "}
              <strong>exemplo fixo</strong>. Em breve, os dados virão
              automaticamente do formulário preenchido por você.
            </p>
          </div>
        </section>

        {/* Ações finais */}
        <section className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/anunciar/formulario?tipo=imoveis"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Editar anúncio
            </Link>

            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white opacity-70 cursor-not-allowed"
            >
              Confirmar e publicar (em breve)
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Depois vamos ligar este passo ao banco de dados e ao seu painel de
            anúncios.
          </p>
        </section>
      </div>
    </main>
  );
}

