import Link from "next/link";

export default function EmpregosPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          Empregos na Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Aqui vamos montar um grande banco de empregos da Região dos Lagos, com
          vagas para comércio, serviços, turismo, saúde, educação, construção civil,
          tecnologia e muito mais. Por enquanto, já deixamos pronto o fluxo para
          quem deseja anunciar uma vaga.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/empregos/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar vaga
          </Link>

          <button
            type="button"
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver banco de empregos (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve esta página vai listar vagas com filtros por cidade, área
          profissional, tipo de contrato, modelo de trabalho (presencial, híbrido,
          remoto) e faixa salarial. Por enquanto, use o botão{" "}
          <span className="font-semibold text-slate-800">“Anunciar vaga”</span>{" "}
          para testar o fluxo de cadastro de oportunidades.
        </div>
      </div>
    </main>
  );
}

