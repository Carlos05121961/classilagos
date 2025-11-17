import Image from "next/image";
import Link from "next/link";

export default function ImovelCasaTeste() {
  // Simulação de dados enviados pelo formulário
  const anuncio = {
    titulo: "Casa 2 quartos com quintal em Itaipuaçu",
    tipo: "Venda",
    preco: "R$ 450.000",
    cidade: "Maricá",
    bairro: "Itaipuaçu",
    descricao:
      "Casa linear com 2 quartos, sala ampla, cozinha americana, banheiro social, área de serviço, quintal grande e garagem. Próxima ao comércio e condução.",
    quartos: 2,
    banheiros: 1,
    vagas: 2,
    area: 75,
    fotos: [
      "/imoveis/casa-teste-01.jpg",
      "/imoveis/casa-teste-02.jpg",
      "/imoveis/casa-teste-03.jpg",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // exemplo
    mapa: "https://maps.google.com", // exemplo
    anunciante: {
      nome: "Carlos Imóveis",
      telefone: "(21) 9 9999-9999",
      email: "contato@classilagos.com",
    },
  };

  return (
    <main className="bg-white pb-12">
      {/* Banner interno */}
      <div className="w-full bg-slate-100 border-b py-3 flex justify-center">
        <div className="max-w-4xl w-full px-4">
          <Image
            src="/banners/anuncio-02.png"
            alt="Classilagos Imóveis"
            width={900}
            height={120}
            className="w-full h-[120px] object-contain rounded-2xl border bg-white shadow"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-10">

        {/* Voltar */}
        <Link href="/imoveis" className="text-blue-600 text-sm underline">
          ← Voltar para Imóveis
        </Link>

        {/* Título + preço */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {anuncio.titulo}
          </h1>
          <p className="text-lg font-semibold text-emerald-600">
            {anuncio.preco}{" "}
            <span className="text-sm text-slate-600 ml-2">
              • {anuncio.tipo}
            </span>
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {anuncio.cidade} • {anuncio.bairro}
          </p>
        </div>

        {/* Carrossel simples de fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {anuncio.fotos.map((foto, index) => (
            <div
              key={index}
              className="relative h-56 rounded-xl overflow-hidden border shadow-sm"
            >
              <Image src={foto} alt="Foto do imóvel" fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* Detalhes rápidos */}
        <div className="grid sm:grid-cols-4 gap-4 text-center bg-slate-50 p-4 rounded-xl border">
          <div>
            <p className="text-xs text-slate-500">Quartos</p>
            <p className="text-lg font-semibold">{anuncio.quartos}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Banheiros</p>
            <p className="text-lg font-semibold">{anuncio.banheiros}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Vagas</p>
            <p className="text-lg font-semibold">{anuncio.vagas}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Área</p>
            <p className="text-lg font-semibold">{anuncio.area} m²</p>
          </div>
        </div>

        {/* Descrição */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Sobre o imóvel
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {anuncio.descricao}
          </p>
        </section>

        {/* Vídeo */}
        {anuncio.video && (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Vídeo do imóvel
            </h2>
            <iframe
              className="w-full h-64 rounded-xl border"
              src={anuncio.video}
              allowFullScreen
            ></iframe>
          </section>
        )}

        {/* Mapa */}
        {anuncio.mapa && (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Localização aproximada
            </h2>
            <iframe
              className="w-full h-64 rounded-xl border"
              src={anuncio.mapa}
            ></iframe>
          </section>
        )}

        {/* Contato */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Contato do anunciante
          </h2>
          <p className="text-sm text-slate-700">{anuncio.anunciante.nome}</p>
          <p className="text-sm text-slate-700">
            WhatsApp: {anuncio.anunciante.telefone}
          </p>
          <p className="text-sm text-slate-700">{anuncio.anunciante.email}</p>

          <a
            href={`https://wa.me/55${anuncio.anunciante.telefone.replace(/\D/g, "")}`}
            target="_blank"
            className="inline-block mt-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-emerald-500"
          >
            Falar no WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}



