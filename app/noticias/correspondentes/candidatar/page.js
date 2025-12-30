"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// ✅ Coloque aqui o e-mail oficial para receber candidaturas
const EMAIL_EDITORIA = "correspondentes@classilagos.shop";

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

function onlyText(v) {
  return typeof v === "string" ? v : "";
}

export default function CandidatarCorrespondentePage() {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [ideias, setIdeias] = useState("");
  const [aceitaRegras, setAceitaRegras] = useState(false);

  const assunto = useMemo(() => {
    const n = onlyText(nome).trim() || "Sem nome";
    const c = onlyText(cidade).trim() || "Sem cidade";
    return `Candidatura Correspondente Cultural — ${c} — ${n}`;
  }, [nome, cidade]);

  const corpo = useMemo(() => {
    const n = onlyText(nome).trim();
    const c = onlyText(cidade).trim();
    const w = onlyText(whatsapp).trim();
    const ig = onlyText(instagram).trim();
    const em = onlyText(email).trim();
    const p = onlyText(perfil).trim();
    const i = onlyText(ideias).trim();

    return `
CANDIDATURA – CORRESPONDENTE CULTURAL CLASSILAGOS

Nome: ${n}
Cidade: ${c}
WhatsApp: ${w}
E-mail: ${em}
Instagram: ${ig}

Perfil / Experiência (quem é você e por que quer representar sua cidade):
${p}

Ideias de pautas (cultura, comércio, turismo, história):
${i}

Aceita diretriz editorial (sem violência e sem política partidária): ${
      aceitaRegras ? "SIM" : "NÃO"
    }

ANEXOS (IMPORTANTE):
- Envie 2 a 5 fotos (se tiver), ou links de trabalhos (drive/instagram/portfólio).
- Se tiver, inclua 1 vídeo curto (opcional).
`.trim();
  }, [nome, cidade, instagram, whatsapp, email, perfil, ideias, aceitaRegras]);

  const canSend =
    nome.trim().length >= 3 &&
    whatsapp.trim().length >= 8 &&
    email.trim().length >= 6 &&
    perfil.trim().length >= 10 &&
    aceitaRegras;

  // ✅ mailto (abre o e-mail do usuário)
  const mailtoHref = `mailto:${encodeURIComponent(
    EMAIL_EDITORIA
  )}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(corpo);
      alert("Texto da candidatura copiado. Cole no e-mail, se precisar.");
    } catch {
      alert("Não consegui copiar automaticamente. Selecione e copie manualmente.");
    }
  };

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
            Preencha os dados e envie sua candidatura por e-mail. O Classilagos faz curadoria e
            entra em contato para aprovação.
          </p>

          <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">Diretriz editorial</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conteúdo positivo: cultura, turismo, comércio tradicional, histórias.</li>
              <li>Proibido: violência, policial, sensacionalismo.</li>
              <li>Proibido: política partidária.</li>
              <li>Reportagens comemorativas podem ser remuneradas (comissão 70/30).</li>
            </ul>
            <p className="mt-2 text-[10px] text-slate-500">
              Envio de fotos: anexe no e-mail (2 a 5 fotos). Pode mandar link do Drive/Instagram também.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700">Seu nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700">Cidade</label>
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
              <label className="text-[11px] font-semibold text-slate-700">Seu WhatsApp</label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                placeholder="Ex: (22) 99999-9999"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700">Seu e-mail</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                placeholder="Ex: seuemail@gmail.com"
              />
            </div>

            <div className="md:col-span-2">
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
              href={canSend ? mailtoHref : "#"}
              onClick={(e) => {
                if (!canSend) e.preventDefault();
              }}
              className={`inline-flex items-center rounded-full px-5 py-2 text-xs md:text-sm font-semibold text-white ${
                canSend ? "bg-sky-600 hover:bg-sky-700" : "bg-slate-300 cursor-not-allowed"
              }`}
              title={`Enviar para ${EMAIL_EDITORIA}`}
            >
              Enviar candidatura por e-mail
            </a>

            <button
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Copiar texto
            </button>

            <Link
              href="/noticias/correspondentes"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </Link>
          </div>

          {!canSend && (
            <p className="text-[11px] text-slate-500">
              Preencha nome, WhatsApp, e-mail, descrição do perfil e aceite a diretriz editorial para enviar.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
