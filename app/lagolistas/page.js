import Link from "next/link";

export default function LagoListasPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        
        <h1 className="text-2xl font-semibold text-slate-900 mb-3">
          LagoListas — Guia Comercial da Região dos Lagos
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          O maior guia de comércio, lojas, empresas, profissionais liberais e
          serviços da Região dos Lagos. Aqui você encontra tudo: mercados, petshops,
          oficinas, clínicas, farmácias, moda, beleza, automotivo, construção,
          cursos, tecnologia e muito mais.  
          <br />
          Clique abaixo para cadastrar seu negócio gratuitamente.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/lagolistas/anunciar"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar no LagoListas
          </Link>

          <button
            disabled
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
          >
            Ver guia completo (em breve)
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Em breve você poderá navegar por mais de 100 categorias comerciais,
          filtros por cidade, mapa de localização, anúncios destacados e
          vitrines digitais de empresas da região.
        </div>

      </div>
    </main>
  );
}
