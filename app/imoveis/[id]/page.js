import Image from "next/image";
import ContatoAnuncio from "@/app/components/ContatoAnuncio";
import { createClient } from "@/utils/supabase/server";

export default async function PaginaDetalhesImovel({ params }) {
  const supabase = createClient();
  const { id } = params;

  // Buscar dados do anúncio pelo ID
  const { data: anuncio, error } = await supabase
    .from("anuncios")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !anuncio) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar o anúncio.
      </div>
    );
  }

  const fotos = anuncio.fotos || [];

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Título */}
      <h1 className="text-2xl font-bold text-slate-900">
        {anuncio.titulo || "Imóvel sem título"}
      </h1>

      {/* Localização */}
      <p className="mt-1 text-sm text-slate-600">
        {anuncio.cidade} • {anuncio.bairro}
      </p>

      {/* Galeria de fotos */}
      <div className="mt-6">
        {fotos.length > 0 && (
          <>
            {/* Foto principal */}
            <div className="relative h-72 w-full overflow-hidden rounded-xl sm:h-96">
              <Image
                src={fotos[0]}
                alt="Foto do imóvel"
                fill
                className="object-cover"
              />
            </div>

            {/* Miniaturas */}
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {fotos.map((foto, index) => (
                <div key={index} className="relative h-20 w-full overflow-hidden rounded-lg cursor-pointer">
                  <Image
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Resumo do imóvel */}
      <section className="mt-8 rounded-xl bg-slate-50 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Resumo do imóvel
        </h2>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3">
          <p><span className="font-semibold">Preço:</span> R$ {anuncio.preco}</p>
          <p><span className="font-semibold">Quartos:</span> {anuncio.quartos}</p>
          <p><span className="font-semibold">Banheiros:</span> {anuncio.banheiros}</p>
          <p><span className="font-semibold">Vagas:</span> {anuncio.vagas}</p>
          <p><span className="font-semibold">Área:</span> {anuncio.area} m²</p>
          <p><span className="font-semibold">Tipo:</span> {anuncio.tipo}</p>
        </div>
      </section>

      {/* Descrição */}
      <section className="mt-8 rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Descrição
        </h2>
        <p className="text-sm text-slate-700 whitespace-pre-line">
          {anuncio.descricao || "Sem descrição detalhada."}
        </p>
      </section>

      {/* Contato — novo componente padrão */}
      <ContatoAnuncio
        telefone={anuncio.telefone}
        whatsapp={anuncio.whatsapp}
        email={anuncio.email}
        imobiliaria={anuncio.imobiliaria}
        corretor={anuncio.corretor}
        creci={anuncio.creci}
      />
    </div>
  );
}
