"use client";

import { useState } from "react";

export default function ContatoAnuncio({
  telefone,
  whatsapp,
  email,
  imobiliaria,
  corretor,
  creci,
}) {
  const [mensagem, setMensagem] = useState(
    "Olá, vi seu anúncio na Classilagos e gostaria de mais informações."
  );

  const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const hasWhatsapp = !!cleanWhatsapp;

  const mensagemFinal =
    mensagem && mensagem.trim().length > 0
      ? mensagem.trim()
      : "Olá, vi seu anúncio na Classilagos e gostaria de mais informações.";

  const whatsappUrl = hasWhatsapp
    ? `https://wa.me/55${cleanWhatsapp}?text=${encodeURIComponent(
        mensagemFinal
      )}`
    : null;

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
      <h2 className="text-base font-semibold text-slate-900">
        Fale com o anunciante
      </h2>

      {(imobiliaria || corretor || creci) && (
        <div className="mt-2 text-xs text-slate-700 space-y-1">
          {imobiliaria && (
            <p>
              <span className="font-semibold">Imobiliária:</span>{" "}
              {imobiliaria}
            </p>
          )}
          {corretor && (
            <p>
              <span className="font-semibold">Corretor:</span> {corretor}
            </p>
          )}
          {creci && (
            <p>
              <span className="font-semibold">CRECI:</span> {creci}
            </p>
          )}
        </div>
      )}

      {hasWhatsapp && (
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Deixe sua mensagem para o anunciante:
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />
        </div>
      )}

      {hasWhatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <span className="text-lg">📱</span>
          <span>Enviar mensagem pelo WhatsApp</span>
        </a>
      )}

      <div className="mt-3 space-y-1 text-xs text-slate-700">
        {telefone && (
          <p>
            <span className="font-semibold">Telefone:</span> {telefone}
          </p>
        )}
        {email && (
          <p>
            <span className="font-semibold">E-mail:</span> {email}
          </p>
        )}
      </div>

      <p className="mt-4 text-[10px] leading-tight text-slate-400">
        A Classilagos apenas divulga anúncios e não intermedeia pagamentos,
        visitas ou negociações. Verifique sempre a identidade do anunciante e a
        documentação antes de fechar negócio.
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        Em breve: página com avisos de segurança e termos de uso.
      </p>
    </section>
  );
}
