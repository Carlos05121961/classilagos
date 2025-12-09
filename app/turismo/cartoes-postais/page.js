"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function CartoesPostaisPage() {
  const [postais, setPostais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("postais")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setPostais(data || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <main className="bg-white min-h-screen pb-10">
      {/* HERO SIMPLES */}
      <section className="relative w-full h-[200px] bg-sky-600 flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-3xl font-extrabold drop-shadow">Cartões Postais</h1>
          <p className="text-sm mt-2 opacity-90">
            Envie cartões digitais da Região dos Lagos para quem você ama.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <p className="text-sm text-slate-600 mb-4">
          Escolha um cartão postal e compartilhe pelo WhatsApp, e-mail ou redes sociais.
        </p>

        {loading ? (
          <p className="text-sm text-slate-500">Carregando cartões…</p>
        ) : postais.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum cartão postal cadastrado ainda. Em breve teremos vários modelos maravilhosos!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {postais.map((card) => (
              <div
                key={card.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col"
              >
                {/* IMAGEM */}
                <div className="h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={card.imagem}
                    alt={card.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTEÚDO */}
                <div className="p-3 flex-1 flex flex-col justify-between text-center">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {card.titulo}
                  </h3>

                  <div className="mt-3 flex flex-col gap-2">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(card.link)}`}
                      target="_blank"
                      className="rounded-full bg-green-600 text-white text-xs px-4 py-1.5 font-semibold hover:bg-green-700"
                    >
                      Enviar pelo WhatsApp
                    </a>

                    {/* Tamanho grande */}
                    <a
                      href={card.link}
                      target="_blank"
                      className="rounded-full bg-blue-600 text-white text-xs px-4 py-1.5 font-semibold hover:bg-blue-700"
                    >
                      Ver em tamanho grande
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
