// app/anuncios/[id]/page.js
import AnuncioDetalheClient from "./AnuncioDetalheClient";
import { supabase } from "../../supabaseClient"; // se der erro aqui por ser client-only, te explico abaixo como ajustar

export async function generateMetadata({ params }) {
  const id = params?.id;

  // Busca mínima só para metadata (rápida)
  const { data, error } = await supabase
    .from("anuncios")
    .select("id, titulo, descricao, cidade, bairro, imagens, categoria")
    .eq("id", id)
    .single();

  const site = "https://classilagos.shop";

  const titulo = data?.titulo
    ? `${data.titulo} | Classilagos`
    : "Anúncio | Classilagos";

  const descricaoBase = (data?.descricao || "").toString().trim();
  const descricao = descricaoBase
    ? descricaoBase.slice(0, 180)
    : "Veja este anúncio no Classilagos.";

  // Pega a 1ª imagem válida
  const img =
    Array.isArray(data?.imagens)
      ? data.imagens.find((u) => typeof u === "string" && u.trim() !== "")
      : null;

  // Fallback bonito (crie depois um og premium em /public/og/classilagos-og.jpg)
  const fallback = `${site}/og/classilagos-og.jpg`;

  // Facebook gosta de URL absoluta
  const ogImage = img?.startsWith("http") ? img : fallback;

  const url = `${site}/anuncios/${id}`;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      url,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: data?.titulo || "Classilagos",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [ogImage],
    },
  };
}

export default function Page({ params }) {
  return <AnuncioDetalheClient id={params.id} />;
}
