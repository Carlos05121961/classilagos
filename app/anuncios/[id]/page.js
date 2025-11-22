"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

const CATEGORIA_LABELS = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  nautica: "Náutica",
  pets: "Pets",
  empregos: "Empregos",
  servicos: "Serviços",
  turismo: "Turismo",
  lagolistas: "LagoListas",
};

export default function AnuncioDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      if (!id) return;
      setErro("");
      setLoading(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error(error);
        setErro("Não foi possível carregar este anúncio.");
        setAnuncio(null);
      } else {
        setAnuncio(data);
      }

      setLoading(false);
    }

    carregar();
  }, [id]);

  // monta link de mapa simples a partir da cidade
  const mapaUrl =
    anuncio?.cidade &&
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      anuncio.cidade
    )}`;

  // monta link de WhatsApp a partir do contato (Brasil)
  let whatsappUrl = null;
  if (anuncio?.contato) {
    const digits = anuncio.contato.replace(/\D/g, "");
    if (digits.length >= 10) {
      const num =
        digits.startsWith("55") || digits.length > 11 ? digits : `55${digits}`;
      whatsappUrl = `https://wa.me/${num}`;
    }
  }

  const categoria = anuncio?.categoria || "imoveis";
  const categoriaLabel = CATEGORIA_LABELS[categoria] || "Anúncio";

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-600">Carregando anúncio...</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="mb-4 text-red-600">{erro || "Anúncio não encontrado."}</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Voltar para a página inicial
        </button>
      </main>
    );
  }

  const imagens = anuncio.imagens || [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Voltar */}
      <button
        onClick={() =>
          router.push(
            categoria === "imoveis" ? "/imoveis" : `/${categoria || ""}`
          )
        }
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        ← Voltar para {categoriaLabel}
      </button>

      {/* Cabeçalho */}
      <header className="space-y-2">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {categoriaLabel}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {anuncio.titulo}
        </h1>
        <p className="text-sm text-gray-600">
          {anuncio.cidade && <span>{anuncio.cidade}</span>}
          {anuncio.created_at && (
            <>
              {" "}
              • publicado em{" "}
              {new Date(anuncio.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </>
          )}
        </p>
      </header>

      {/* Galeria de fotos */}
      {imagens.length > 0 && (
        <section className="space-y-3">
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={imagens[0]}
              alt={anuncio.titulo}
              fill
              className="object-cover"
            />
          </div>
          {imagens.length > 1 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {imagens.slice(1).map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    // abre a imagem em nova aba/janela
                    window.open(url, "_blank");
                  }}
                  className="relative h-20 rounded-xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={url}
                    alt={`Foto ${idx + 2} do anúncio`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Descrição */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Descrição</h2>
        <p className="whitespace-pre-line text-sm text-gray-800">
          {anuncio.descricao}
        </p>
      </section>

      {/* Informações de contato / ações */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Informações de contato
          </h3>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Telefone / WhatsApp: </span>
            {anuncio.contato}
          </p>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
            >
              💬 Falar pelo WhatsApp
            </a>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Localização e vídeo
          </h3>

          {mapaUrl && (
            <a
              href={mapaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
            >
              📍 Ver no mapa (Google Maps)
            </a>
          )}

          {anuncio.video_url && (
            <a
              href={anuncio.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs font-semibold text-red-600 hover:underline"
            >
              ▶ Ver vídeo do imóvel no YouTube
            </a>
          )}
        </div>
      </section>

      {/* Rodapé simples */}
      <section className="pt-4 border-t border-gray-200 text-xs text-gray-500">
        ID do anúncio: {anuncio.id}
      </section>
    </main>
  );
}
