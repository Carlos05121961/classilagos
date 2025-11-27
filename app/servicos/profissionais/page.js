import Link from "next/link";

export default function ProfissionaisLiberaisPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Profissionais Liberais e Serviços
        </h1>
        <p className="text-sm text-slate-700 mb-6">
          Em breve, esta página vai reunir profissionais liberais e autônomos
          da Região dos Lagos: eletricistas, encanadores, diaristas, professores,
          consultores, designers, técnicos e muito mais.
        </p>
        <p className="text-sm text-slate-700 mb-6">
          Você já pode cadastrar seu serviço no Classilagos para aparecer nas
          próximas atualizações.
        </p>
        <Link
          href="/anunciar"
          className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Anunciar meu serviço
        </Link>
      </section>
    </main>
  );
}
