"use client";

import Link from "next/link";

const noticiasMock = [
  {
    id: 1,
    titulo: "Show de verão agita a orla de Cabo Frio no fim de semana",
    resumo:
      "Programação musical gratuita reúne artistas locais e visitantes na Praia do Forte.",
    cidade: "Cabo Frio",
    categoria: "Cultura",
    data: "27/11/2025",
    imagem:
      "https://images.pexels.com/photos/2102567/pexels-photo-2102567.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    titulo: "Maricá lança novo calendário de eventos turísticos para 2026",
    resumo:
      "Circuito de shows, feiras e festivais deve movimentar a economia criativa na cidade.",
    cidade: "Maricá",
    categoria: "Turismo",
    data: "26/11/2025",
    imagem:
      "https://images.pexels.com/photos/210205/pexels-photo-210205.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    titulo: "Saquarema recebe etapa especial de surfe com atletas internacionais",
    resumo:
      "Praia de Itaúna volta a ser palco de grandes competições de surfe profissional.",
    cidade: "Saquarema",
    categoria: "Esportes",
    data: "25/11/2025",
    imagem:
      "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    titulo: "Arraial do Cabo reforça ações de preservação nas trilhas e mirantes",
    resumo:
      "Medidas educativas e de fiscalização visam proteger áreas de visitação intensa.",
    cidade: "Arraial do Cabo",
    categoria: "Meio ambiente",
    data: "24/11/2025",
    imagem:
      "https://images.pexels.com/photos/2405264/pexels-photo-2405264.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 5,
    titulo: "Búzios prepara festival gastronômico com foco em frutos do mar",
    resumo:
      "Chefs locais e convidados apresentam cardápios especiais em vários bairros da península.",
    cidade: "Armação dos Búzios",
    categoria: "Gastronomia",
    data: "23/11/2025",
    imagem:
      "https://images.pexels.com/photos/109836/pexels-photo-109836.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 6,
    titulo: "Rio das Ostras amplia calendário de eventos na orla para o verão",
    resumo:
      "Shows, esportes e atividades culturais prometem movimentar a alta temporada.",
    cidade: "Rio das Ostras",
    categoria: "Cidade",
    data: "22/11/2025",
    imagem:
      "https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function NoticiasHomePage() {
  const destaques = noticiasMock.slice(0, 3);
  const recentes = noticiasMock.slice(3);

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* HERO TOPO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-3">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold text-sky-700">
              Classilagos Notícias
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              Notícias da Região dos Lagos, em um só lugar.
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              Acompanhe o que acontece em Maricá, Saquarema, Araruama, Iguaba
              Grande, São Pedro da Aldeia, Arraial do Cabo, Cabo Frio, Búzios e
              Rio das Ostras.
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] text-sky-700">
                Turismo &amp; Cultura
              </span>
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">
                Cidade &amp; Serviços
              </span>
              <span className="inline-flex rounded-full bg-yellow-50 px-3 py-1 text-[11px] text-yellow-700">
                Praia, Marés &amp; Trânsito
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/noticias/publicar"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
              >
                Publicar uma notícia
              </Link>
              <Link
                href="/noticias/cameras"
                className="inline-flex items-center rounded-full border border-sky-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-sky-700 hover:bg-sky-50"
              >
                Ver câmeras ao vivo
              </Link>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 lg:w-72">
            <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-[1px] shadow-md">
              <div className="rounded-3xl bg-white/95 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-800">
                  Painel rápido da Região dos Lagos
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-700">
                  <div>
                    <p className="font-semibold text-sky-700">Clima hoje</p>
                    <p>Máx 30º • Mín 22º</p>
                    <p>Céu parcialmente nublado</p>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-700">
                      Tábua de marés
                    </p>
                    <p>Maré alta: 09h40</p>
                    <p>Maré baixa: 15h55</p>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-700">
                      Ondas Saquarema
                    </p>
                    <p>Altura: 1,2 m</p>
                    <p>Boas condições</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Trânsito agora
                    </p>
                    <p>Ponte Rio–Niterói: fluxo intenso</p>
                    <p>Via Lagos: normal</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Em breve estes dados serão carregados automaticamente de
                  fontes oficiais (Climatempo, Marinha, DER-RJ, etc.).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
        {/* COLUNA ESQUERDA: DESTAQUES + RECENTES */}
        <div className="space-y-6">
          {/* DESTAQUES */}
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Destaques de hoje
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {/* destaque principal */}
              {destaques[0] && (
                <Link
                  href={`/noticias/${destaques[0].id}`}
                  className="md:col-span-2 group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col md:flex-row"
                >
                  <div className="md:w-2/3 h-48 md:h-auto overflow-hidden">
                    <img
                      src={destaques[0].imagem}
                      alt={destaques[0].titulo}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                    />
                  </div>
                  <div className="flex-1 p-4 space-y-2 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] text-sky-700 font-semibold uppercase tracking-wide">
                        {destaques[0].cidade} • {destaques[0].categoria}
                      </p>
                      <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2">
                        {destaques[0].titulo}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-3">
                        {destaques[0].resumo}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Publicado em {destaques[0].data}
                    </p>
                  </div>
                </Link>
              )}

              {/* dois destaques menores */}
              {destaques.slice(1).map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.id}`}
                  className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={n.imagem}
                      alt={n.titulo}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition"
                    />
                  </div>
                  <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                        {n.cidade} • {n.categoria}
                      </p>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                        {n.titulo}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {n.data}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* NOTÍCIAS RECENTES */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Últimas notícias
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-500">
                  Filtrar por cidade:
                </span>
                {/* No futuro, este filtro será dinâmico */}
                <div className="flex flex-wrap gap-1">
                  {[
                    "Maricá",
                    "Cabo Frio",
                    "Arraial",
                    "Búzios",
                    "Saquarema",
                    "Rio das Ostras",
                  ].map((cidade) => (
                    <button
                      key={cidade}
                      type="button"
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 hover:border-sky-400 hover:text-sky-700"
                    >
                      {cidade}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recentes.map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.id}`}
                  className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={n.imagem}
                      alt={n.titulo}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition"
                    />
                  </div>
                  <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                        {n.cidade} • {n.categoria}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {n.titulo}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-3">
                        {n.resumo}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {n.data}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* TV CLASSILAGOS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                🎥 TV Classilagos
              </h2>
              <span className="text-[11px] text-slate-500">
                Conteúdos em vídeo sobre a Região dos Lagos
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Canal 1 */}
              <div className="rounded-3xl border border-slate-200 bg-white p-3 flex flex-col gap-2">
                <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center text-white text-xs">
                  <span className="opacity-80">
                    Player TV Classilagos 1 (YouTube)
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-900">
                    TV Classilagos – Canal 1
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Reportagens, bastidores, músicas, eventos e especiais da
                    Região dos Lagos.
                  </p>
                  <Link
                    href="https://www.youtube.com/@tvclassilagos2214"
                    target="_blank"
                    className="inline-flex items-center rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-700"
                  >
                    Assistir no YouTube
                  </Link>
                </div>
              </div>

              {/* Canal 2 */}
              <div className="rounded-3xl border border-slate-200 bg-white p-3 flex flex-col gap-2">
                <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center text-white text-xs">
                  <span className="opacity-80">
                    Player TV Classilagos 2 (YouTube)
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-900">
                    TV Classilagos – Canal 2
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Conteúdos complementares, arquivos históricos e projetos
                    especiais Classilagos.
                  </p>
                  <Link
                    href="https://www.youtube.com/@tvclassilagos6603"
                    target="_blank"
                    className="inline-flex items-center rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-700"
                  >
                    Assistir no YouTube
                  </Link>
                </div>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Em breve, esta seção poderá exibir automaticamente os últimos
              vídeos publicados nos canais da TV Classilagos.
            </p>
          </section>
        </div>

        {/* COLUNA DIREITA: SIDEBAR */}
        <aside className="space-y-4">
          {/* CLIMA / MARÉS / ONDAS / CÂMERAS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Painel rápido da região
            </h2>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sky-700">Clima hoje</p>
                  <p>Máx 30º • Mín 22º</p>
                  <p>Céu parcialmente nublado</p>
                </div>
                <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] text-sky-700">
                  Em breve: dados em tempo real
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold text-emerald-700 text-[11px]">
                    Tábua de marés
                  </p>
                  <p>Alta: 09h40</p>
                  <p>Baixa: 15h55</p>
                  <Link
                    href="#"
                    className="mt-1 inline-block text-[10px] text-emerald-700 underline"
                  >
                    Ver tábua completa
                  </Link>
                </div>
                <div>
                  <p className="font-semibold text-yellow-700 text-[11px]">
                    Ondas em Saquarema
                  </p>
                  <p>Altura: 1,2 m</p>
                  <p>Condição: boa</p>
                  <Link
                    href="#"
                    className="mt-1 inline-block text-[10px] text-yellow-700 underline"
                  >
                    Ver previsão detalhada
                  </Link>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="font-semibold text-slate-900 text-[11px] mb-1">
                  Trânsito e câmeras ao vivo
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/noticias/cameras"
                      className="text-[11px] text-sky-700 underline"
                    >
                      Ponte Rio–Niterói, Via Lagos e RJ-106 (câmeras)
                    </Link>
                  </li>
                  <li>
                    <span className="text-[10px] text-slate-500">
                      Em breve: situação em tempo real integrada ao portal.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* NAVEGAÇÃO POR CIDADE */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Notícias por cidade
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {[
                "Maricá",
                "Saquarema",
                "Araruama",
                "Iguaba Grande",
                "São Pedro da Aldeia",
                "Arraial do Cabo",
                "Cabo Frio",
                "Búzios",
                "Rio das Ostras",
              ].map((cidade) => (
                <Link
                  key={cidade}
                  href="#"
                  className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-sky-400 hover:text-sky-700 text-center"
                >
                  {cidade}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
