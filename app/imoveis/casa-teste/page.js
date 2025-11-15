import Image from "next/image";
import Link from "next/link";

const images = [
  "/imoveis/casa-teste-01.jpg",
  "/imoveis/casa-teste-02.jpg",
  "/imoveis/casa-teste-03.jpg",
];

export default function CasaTestePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6">

        <div className="mb-4">
          <Link
            href="/imoveis"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Voltar para Imóveis
          </Link>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Casa em Maricá – 2 quartos, quintal e garagem
          </h1>
          <p className="text-sm text-slate-700">
            Este anúncio é apenas um teste para você visualizar como ficará uma
            página de imóvel real no Classilagos.
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              🛏️ 2 quartos
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              🚿 1 banheiro
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              🚗 Garagem
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              📍 Maricá – Bairro de exemplo
            </span>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <div className="relative w-full h-[260px] md:h-[320px] rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={images[0]}
                alt="Foto principal da casa"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-3">
            {images.slice(1).map((src) => (
              <div
                key={src}
                className="relative w-full h-[120px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
              >
                <Image
                  src={src}
                  alt="Foto da casa"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Detalhes do imóvel
            </h2>
            <p className="text-sm text-slate-700 mb-3">
              Aqui você poderá colocar a descrição completa da sua casa: terreno,
              metragem construída, salas, quartos, acabamentos, área externa e
              tudo que quiser destacar.
            </p>
            <p className="text-sm text-slate-700">
              Esta é apenas uma página de exemplo. Depois vamos transformar isso
              numa página automática para qualquer imóvel cadastrado.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Contato do anunciante
            </h2>

            <div className="space-y-2 text-sm text-slate-800 mb-4">
              <p><strong>Nome:</strong> Seu nome aqui</p>
              <p><strong>WhatsApp:</strong> (21) 99999-9999</p>
              <p><strong>E-mail:</strong> seuemail@exemplo.com</p>
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-blue-600 text-white text-sm font-semibold py-2 hover:bg-blue-700"
            >
              Falar com o anunciante (modelo)
            </button>

            <p className="text-[11px] text-slate-500 mt-3">
              Estes dados serão automáticos quando o sistema de cadastro estiver ativo.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
