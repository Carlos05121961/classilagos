"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [ideias, setIdeias] = useState("");
  const [aceitaRegras, setAceitaRegras] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const canSend =
    nome.trim().length >= 3 &&
    whatsapp.trim().length >= 8 &&
    email.trim().length >= 6 &&
    perfil.trim().length >= 10 &&
    aceitaRegras;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSend || enviando) return;

    setEnviando(true);
    setErro("");

    try {
      const res = await fetch("/api/correspondentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          cidade,
          whatsapp,
          email,
          instagram,
          perfil,
          ideias,
        }),
      });

      if (!res.ok) throw new Error("Erro no envio");

      setSucesso(true);
    } catch (err) {
      setErro("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-2">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Quero ser Correspondente Cultural
          </h1>

          <p className="text-sm text-slate-600">
            Envie sua candidatura. A equipe do Classilagos fará a curadoria
            e entrará em contato.
          </p>

          <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">
              Diretriz editorial
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cultura, turismo, comércio e histórias locais.</li>
              <li>Proibido: violência, sensacionalismo.</li>
              <li>Proibido: política partidária.</li>
              <li>Reportagens especiais podem ser remuneradas.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="max-w-3xl mx-auto px-4 pt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
          {sucesso ? (
            <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
              <p className="font-semibold text-green-800">
                ✅ Candidatura enviada com sucesso!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Em breve entraremos em contato pelo e-mail ou WhatsApp informado.
              </p>

              <Link
                href="/noticias"
                className="inline-block mt-4 rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Ir para Notícias
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                />

                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  {CIDADES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="WhatsApp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                />

                <input
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <input
                placeholder="Instagram (opcional)"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              />

              <textarea
                placeholder="Quem é você e por que quer representar sua cidade?"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              />

              <textarea
                placeholder="Ideias de pautas"
                value={ideias}
                onChange={(e) => setIdeias(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              />

              <label className="flex gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={aceitaRegras}
                  onChange={(e) => setAceitaRegras(e.target.checked)}
                />
                Concordo com a diretriz editorial
              </label>

              {erro && <p className="text-xs text-red-600">{erro}</p>}

              <div className="flex gap-2 flex-wrap">
                <button
                  type="submit"
                  disabled={!canSend || enviando}
                  className={`rounded-full px-6 py-2 text-sm font-semibold text-white ${
                    canSend
                      ? "bg-sky-600 hover:bg-sky-700"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  {enviando ? "Enviando..." : "Enviar candidatura"}
                </button>

                <Link
                  href="/noticias/correspondentes"
                  className="rounded-full border border-slate-200 px-6 py-2 text-sm"
                >
                  Voltar
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
