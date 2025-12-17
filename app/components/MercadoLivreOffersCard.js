"use client";

export default function MercadoLivreOffersCard({
  title = "Ofertas Mercado Livre",
  subtitle = "Links de afiliado • comprando por aqui você apoia o Classilagos",
  offers = [],
}) {
  if (!offers?.length) return null;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-extrabold text-slate-900">{title}</p>
          <p className="mt-1 text-[11px] text-slate-600">{subtitle}</p>
        </div>

        <span className="shrink-0 inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-800 border border-amber-200">
          Afiliado
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {offers.map((o, idx) => (
          <a
            key={idx}
            href={o.url}
            target="_blank"
            rel="noreferrer"
            className="group block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-white hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-900 truncate">
                  {o.emoji ? <span className="mr-2">{o.emoji}</span> : null}
                  {o.title}
                </p>

                {(o.note || o.price) && (
                  <p className="text-[11px] text-slate-600 truncate">
                    {o.price ? <span className="font-semibold">{o.price}</span> : null}
                    {o.price && o.note ? <span> • </span> : null}
                    {o.note || ""}
                  </p>
                )}
              </div>

              <span className="shrink-0 text-[11px] font-semibold text-cyan-700 group-hover:text-cyan-900">
                Ver →
              </span>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-slate-500">
        *Links de afiliado. Podemos receber comissão sem custo extra pra você.
      </p>
    </div>
  );
}
