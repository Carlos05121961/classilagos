"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const WHATSAPP_OWNER = "55SEUNUMEROAQUI"; // ex: "5521999999999"

const CIDADES = [
  "Maricá",
  "Saquarema",
  "Araruama",
  "Iguaba Grande",
  "São Pedro da Aldeia",
  "Arraial do Cabo",
  "Cabo Frio",
  "Búzios",
  "Rio das Ostras",
];

export default function CandidatarCorrespondentePage() {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [perfil, setPerfil] = useState(""); // quem é / experiência
  const [ideias, setIdeias] = useState(""); // pautas
  const [aceitaRegras, setAceitaRegras] = useState(false);

  const msg = useMemo(() => {
    return `
CANDIDATURA – CORRESPONDENTE CULTURAL CLASSILAGOS

Nome: ${nome}
Cidade: ${cidade}
WhatsApp: ${whatsapp}
Instagram: ${instagram}

Perfil / Experiência:
${perfil}

Ideias de pautas (cultura, comércio, turismo, história):
${ideias}

Aceita diretriz editorial (sem violência e sem política partidária): ${aceitaRegras ? "SIM" : "NÃO"}
`.trim();
  }, [nome, cidade, instagram, whatsapp, perfil, ideias, aceitaRegras]);

  const canSend =
    nome.trim().length >= 3 &&
    whatsapp.trim().length >= 8 &&
    perfil.trim().length >= 10 &&
    aceitaRegras;

  const waLink = `https://wa.me/${WHATSAPP_OWNER}?text=${encodeURIComponent(msg)}`;

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-2">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Quero ser Correspondente Cultural
          </h1>
          <p className="text-sm text-slate-600">
            Preencha os dados e envie sua candidatura. O Classilagos fará curadoria
            e contato para aprovação.
          </p>

          <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">Diretriz editorial</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conteúdo positivo: cultura, turismo, comércio tradicional, histórias.</li>
              <li>Proibido: violência, policial, sensacionalismo.</li>
              <li>Proibido: política partidária.</li>
              <li>Reportagens comemorativas podem ser remuneradas (comissão 70/30).</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700">
                Seu nome
              </label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700">
                Cidade
              </label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
              >
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700">
                Seu WhatsApp
              </label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                placeholder="Ex: (22) 99999-9999"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700">
                Instagram (opcional)
              </label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700">
              Quem é você e por que quer representar sua cidade?
            </label>
            <textarea
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
              placeholder="Conte um pouco da sua história, experiência com fotos, eventos, cultura, turismo, etc."
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700">
              Ideias de pautas (o que você faria como correspondente)
            </label>
            <textarea
              value={ideias}
              onChange={(e) => setIdeias(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
              placeholder="Ex: comércio com 30 anos, festas tradicionais, personagens locais, trilhas, cultura..."
            />
          </div>

          <label className="flex items-start gap-2 text-[11px] text-slate-700">
            <input
              type="checkbox"
              checked={aceitaRegras}
              onChange={(e) => setAceitaRegras(e.target.checked)}
              className="mt-1"
            />
            Eu concordo com a diretriz editorial (sem violência e sem política partidária).
          </label>

          <div className="flex gap-2 flex-wrap">
            <a
              href={canSend ? waLink : "#"}
              onClick={(e) => {
                if (!canSend) e.preventDefault();
              }}
              className={`inline-flex items-center rounded-full px-5 py-2 text-xs md:text-sm font-semibold text-white ${
                canSend ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Enviar candidatura por WhatsApp
            </a>

            <Link
              href="/noticias/correspondentes"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </Link>
          </div>

          {!canSend && (
            <p className="text-[11px] text-slate-500">
              Preencha nome, WhatsApp, descrição do perfil e aceite a diretriz editorial para enviar.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
