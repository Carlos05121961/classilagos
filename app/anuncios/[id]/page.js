// app/anuncios/[id]/page.js  (SERVER)
import AnuncioDetalheClient from "./AnuncioDetalheClient";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://classilagos.shop";

function toAbsUrl(url) {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `${SITE}${u.startsWith("/") ? "" : "/"}${u}`;
}

function pickOgImage(anuncio) {
  const arr = Array.isArray(anuncio?.imagens) ? anuncio.imagens : [];
  const first = arr.find((x) => typeof x === "string" && x.trim());
  return toAbsUrl(first) || ""; // se não tiver imagem, volta vazio (Facebook cai no fallback do site)
}

function buildDesc(anuncio) {
  const base =
    (anuncio?.descricao || "").toString().replace(/\s+/g, " ").trim() ||
    "Veja este anúncio no Classilagos.";
  return base.length > 180 ? `${base.slice(0, 177)}...` : base;
}

export async function generateMetadata({ params }) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  const url = `${SITE}/anuncios/${params.id}`;

  // Fallback seguro (se faltar env vars ou der erro)
  const fallback = {
    metadataBase: new URL(SITE),
    title: "Anúncio | Classilagos",
    description: "Veja este anúncio no Classilagos.",
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Classilagos",
      title: "Anúncio | Classilagos",
      description: "Veja este anúncio no Classilagos.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Anúncio | Classilagos",
      description: "Veja este anúncio no Classilagos.",
    },
  };

  try {
    if (!supabaseUrl || !supabaseKey) return fallback;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("anuncios")
      .select("id,titulo,descricao,imagens,cidade,bairro,categoria")
      .eq("id", params.id)
      .single();

    if (error || !data) return fallback;

    const titulo = data.titulo ? `${data.titulo} | Classilagos` : fallback.title;
    const description = buildDesc(data);
    const ogImage = pickOgImage(data);

    return {
      metadataBase: new URL(SITE),
      title: titulo,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        url,
        siteName: "Classilagos",
        title: titulo,
        description,
        ...(ogImage
          ? { images: [{ url: ogImage, width: 1200, height: 630, alt: data.titulo || "Classilagos" }] }
          : {}),
      },
      twitter: {
        card: ogImage ? "summary_large_image" : "summary",
        title: titulo,
        description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  } catch {
    return fallback;
  }
}

export default function Page({ params }) {
  return <AnuncioDetalheClient id={params.id} />;
}
