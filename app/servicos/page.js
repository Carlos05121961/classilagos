import Link from "next/link";

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          Serviços e Profissionais na Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Aqui você vai encontrar e divulgar serviços e profissionais liberais:
          eletricistas, encanadores, diaristas, marido de aluguel, saúde, beleza,
          aulas particulares, tecnologia, reformas, consultorias e muito mais.
          Estamos estruturando a área, mas o fluxo para anunciar já está pronto.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/servicos/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar serviço / profissional
          </Link>

          <button
            type="button"
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver serviços cadastrados (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve esta página vai listar serviços com filtros por cidade, área de
          atuação e tipo de atendimento (domicílio, loja física, online). Por
          enquanto, use o botão{" "}
          <span className="font-semibold text-slate-800">
            “Anunciar serviço / profissional”
          </span>{" "}
          para testar o fluxo de cadastro.
        </div>
      </div>
    </main>
  );
}
