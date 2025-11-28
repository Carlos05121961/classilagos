"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

export default function NoticiaDetalhePage() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Compartilhamento
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Buscar a notícia
  useEffect(() => {
    if (!id) return;

    const fetchNoticia = async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErro("Notícia não encontrada.");
        setLoading(false);
        return;
      }

      setNoticia(data);

      // Buscar relacionadas
      const { data: rel } = await supabase
        .from("noticias")
        .select("id, titulo, cidade, categoria, imagem_capa, resumo")
        .eq("cidade", data.cidade)
        .neq("id", data.id)
        .order("created_at", { ascending: false })
        .limit(4);

      setRelacionadas(rel || []);
      setLoading(false);
    };

    fetchNoticia();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex items-center justify-center">
        <p className="text-sm text-slate-600">Carregando notícia…</p>
      </main>
    );
  }

  if (erro || !noticia) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-slate-700 mb-4">{erro}</p>
        <Link
          href="/noticias"
          className="rounded-full bg-blue-500 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-600"
        >
          Voltar para notícias
        </Link>
      </main>
    );
  }

  // SHARE LINKS
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(noticia.titulo);

  const whatsappShare =
    `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShare =
    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">

      {/* BANNER TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias
          </p>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

        {/* CAPA */}
        {noticia.imagem_capa && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
            <img
              src={noticia.imagem_capa}
              alt={noticia.titulo}
              className="w-full h-[240px] sm:h-[320px] md:h-[380px] object-cover"
            />
          </div>
        )}

        {/* CABEÇALHO */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {noticia.titulo}
          </h1>

          <p className="text-xs text-slate-500">
            {noticia.cidade} • {noticia.categoria} •{" "}
            {new Date(noticia.created_at).toLocaleDateString("pt-BR")}
          </p>

          {/* COMPARTILHAR */}
          <div className="flex items-center gap-2 text-[11px] mt-1">
            <span className="text-slate-500">Compartilhar:</span>

            <a
              href={whatsappShare}
              target="_blank"
              className="inline-flex items-center rounded-full bg-[#25D366] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
            >
              🟢 WhatsApp
            </a>

            <a
              href={facebookShare}
              target="_blank"
              className="inline-flex items-center rounded-full bg-[#1877F2] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
            >
              📘 Facebook
            </a>
          </div>
        </div>

        {/* TEXTO PRINCIPAL */}
        <article className="bg-white rounded-3xl border border-slate-200 px-5 py-6 shadow-sm">
          <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {noticia.texto}
          </p>
        </article>

        {/* RELACIONADAS */}
        <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Notícias relacionadas em {noticia.cidade}
          </h2>

          {relacionadas.length === 0 && (
            <p className="text-xs text-slate-500">
              Nenhuma notícia relacionada por enquanto.
            </p>
          )}

          {relacionadas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relacionadas.map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.id}`}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                >
                  {n.imagem_capa && (
                    <div className="w-full h-28 overflow-hidden">
                      <img
                        src={n.imagem_capa}
                        alt={n.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}

                  <div className="px-3 py-2 space-y-1">
                    <p className="text-[13px] font-semibold line-clamp-2">
                      {n.titulo}
                    </p>
                    <p className="text-[11px] text-slate-600">{n.resumo}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* BOTÃO VOLTAR (MOBILE) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/noticias"
            className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Voltar
          </Link>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="mt-8 text-center text-[11px] text-slate-500 space-y-1">
        <p>Classilagos • O seu guia de notícias da Região dos Lagos</p>
      </footer>
    </main>
  );
}
