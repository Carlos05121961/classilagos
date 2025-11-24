"use client";

export default function ContatoAnuncio({
  telefone,
  whatsapp,
  email,
  imobiliaria,
  corretor,
  creci,
}) {
  // Limpa o número de WhatsApp
  const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const hasWhatsapp = !!cleanWhatsapp;

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-4">
        Fale com o anunciante
      </h2>

      {/* Botão WhatsApp */}
      {hasWhatsapp && (
        <a
          href={`https://wa.me/55${cleanWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          📱 Falar pelo WhatsApp
        </a>
      )}

      {/* Informações de contato em texto */}
      <div className="mt-4 space-y-1 text-xs text-slate-700">
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

      {/* Dados da imobiliária / corretor */}
      {(imobiliaria || corretor || creci) && (
        <div className="mt-4 pt-3 border-t border-slate-300 text-xs text-slate-700 space-y-1">
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

      {/* Avis*
