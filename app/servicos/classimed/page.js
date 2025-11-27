import Link from "next/link";

export default function ClassimedPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Classimed – Saúde e bem-estar
        </h1>
        <p className="text-sm text-slate-700 mb-6">
          Em breve, você poderá encontrar aqui profissionais e clínicas de saúde
          da Região dos Lagos: médicos, dentistas, psicólogos, fisioterapeutas,
          terapeutas, academias e muito mais.
        </p>
        <p className="text-sm text-slate-700 mb-6">
          Enquanto isso, você já pode cadastrar seu serviço no Classilagos
          acessando a área de anúncios.
        </p>
        <Link
          href="/anunciar"
          className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Anunciar meu serviço de saúde
        </Link>
      </section>
    </main>
  );
}
