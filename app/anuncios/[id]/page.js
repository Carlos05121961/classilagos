// app/anuncios/[id]/page.js  (SERVER)
import AnuncioDetalheClient from "./AnuncioDetalheClient";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE = "https://classilagos.shop";

// fallback bonito (se o anúncio não tiver imagem)
const FALLBACK_IMAGE = `${SITE}/og/classilagos-og.jpg`; // crie esse arquivo depois, se não existir

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
  return toAbsUrl(first) || FALLBACK_IMAGE;
}

function buildDesc(anuncio) {
  const base =
    (anuncio?.descricao || "").toString().replace(/\s+/g, " ").trim() ||
    "Veja este anúncio no Classilagos.";
  return base.length > 180 ? `${base.slice(0, 177)}...` : base;
}

export async function generateMetadata({ params }) {
  const url = `${SITE}/anuncios/${params.id}`;

  // ✅ IMPORTANTE: usar Service Role (server-only) pra não depender de RLS
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
      images: [{ url: FALLBACK_IMAGE, width: 1200, height: 630, alt: "Classilagos" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Anúncio | Classilagos",
      description: "Veja este anúncio no Classilagos.",
      images: [FALLBACK_IMAGE],
    },
  };

  try {
    if (!supabaseUrl || !serviceRole) return fallback;

    const supabase = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("anuncios")
      .select("id,titulo,descricao,imagens,cidade,bairro,categoria")
      .eq("id", params.id)
      .single();

    if (error || !data) return fallback;

    const titulo = data.titulo ? `${data.titulo} | Classilagos` : "Anúncio | Classilagos";
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
        images: [{ url: ogImage, width: 1200, height: 630, alt: data.titulo || "Classilagos" }],
      },
      twitter: {
        card: "summary_large_image",
        title: titulo,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return fallback;
  }
}

export default function Page({ params }) {
  return <AnuncioDetalheClient id={params.id} />;
}

