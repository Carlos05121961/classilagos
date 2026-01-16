import Image from "next/image";
import Link from "next/link";

const pilares = [
  {
    key: "noticias",
    title: "Notícias institucionais (Secom) e Agenda Cultural",
    href: "/noticias",
    img: "/parcerias/poder-publico/noticias.webp",
    badge: "Prioridade",
    desc:
      "Além de informar a população, o Classilagos pode funcionar como canal complementar para notícias institucionais da Secom e para divulgação da agenda cultural da cidade (eventos, ações, comunicados, utilidade pública).",
    comoParticipar: [
      "Secom envia comunicados oficiais (texto + links + imagem quando houver).",
      "Secretarias e Cultura enviam agenda (datas, locais, horários, ingressos/inscrições, contatos).",
      "Conteúdo publicado com identificação clara da origem e da cidade.",
    ],
  },
  {
    key: "empregos",
    title: "Empregos, Currículos e Cursos (Casa do Trabalhador / SINE / Parceiros)",
    href: "/empregos",
    img: "/parcerias/poder-publico/empregos.webp",
    desc:
      "Banco de vagas e currículos para apoiar o trabalhador e organizar oportunidades da cidade. Também serve para divulgar cursos e capacitações oferecidos pela Prefeitura e suas secretarias, além de programas e iniciativas locais.",
    comoParticipar: [
      "Casa do Trabalhador / SINE envia vagas e critérios (cargo, local, requisitos, contato).",
      "Prefeitura divulga cursos, oficinas e capacitações (datas, inscrições, links oficiais).",
      "Empresas parceiras podem inserir vagas e fortalecer o ecossistema local.",
    ],
  },
  {
    key: "pets",
    title: "Bem-estar animal (Adoção e Campanhas)",
    href: "/pets",
    img: "/parcerias/poder-publico/pets.webp",
    desc:
      "Vitrine regional para adoção e ações de bem-estar animal: campanhas de castração, vacinação, feiras, orientações e avisos. Ajuda a dar visibilidade e ampliar o alcance de iniciativas públicas e comunitárias.",
    comoParticipar: [
      "Secretaria/Coordenação envia campanhas e comunicados (datas, locais, documentos, contatos).",
      "Centro de zoonoses e protetores/ONGs divulgam animais para adoção com fotos e dados básicos.",
      "Canal de utilidade pública para avisos e orientações ao cidadão.",
    ],
  },
  {
    key: "turismo",
    title: "Turismo e Cultura (Atrativos, Roteiros e Economia Local)",
    href: "/turismo",
    img: "/parcerias/poder-publico/turismo.webp",
    desc:
      "Divulgação de atrativos e equipamentos públicos (parques, museus, casa de cultura, roteiros, cartões postais) e integração com serviços turísticos. Isso fortalece o destino, movimenta a economia e incentiva empresas privadas (pousadas, bares, restaurantes, passeios) a participarem junto.",
    comoParticipar: [
      "Turismo/Cultura envia lista de atrativos e equipamentos (horários, endereço, regras, contatos).",
      "Divulgação de eventos e programações, com links oficiais quando existirem.",
      "Onde houver, orientar o cidadão para agendamento/ingressos/inscrições via canais oficiais.",
    ],
  },
];

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[11px] font-semibold text-slate-200">
      {children}
    </span>
  );
}

function SectionTitle({ kicker, title, subtitle }) {
  return (
    <div className="mb-6">
      {kicker ? (
        <p className="text-xs font-semibold tracking-widest text-slate-300/80 uppercase">
          {kicker}
        </p>
      ) : null}
      <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-2">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function CardPilar({ p }) {
  return (
    <Link
      href={p.href}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-sm hover:border-slate-700 transition"
      aria-label={`Abrir página real: ${p.title}`}
    >
      <div className="relative aspect-[16/9] bg-white">
        <Image
          src={p.img}
          alt={p.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={p.badge === "Prioridade"}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-white font-semibold">{p.title}</p>
            <p className="text-xs text-slate-300 mt-1">
              Clique para abrir a página real no classilagos.shop
            </p>
          </div>

          {p.badge ? (
            <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/20">
              {p.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mt-3">{p.desc}</p>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs font-semibold tracking-widest text-slate-300/80 uppercase">
            Como a Prefeitura participa
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {p.comoParticipar.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}

export default function PoderPublicoPage() {
  return (
    <main className="bg-slate-950 text-slate-50 min-h-screen">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-wrap gap-2">
            <Pill>classilagos.shop</Pill>
            <Pill>Região dos Lagos • RJ</Pill>
            <Pill>Parceria institucional</Pill>
            <Pill>Utilidade pública</Pill>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold mt-4 leading-tight">
            Classilagos & Poder Público
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mt-3 max-w-3xl">
            Um canal digital regional de utilidade pública, conectando a população da Região dos
            Lagos a informações, serviços e oportunidades.
          </p>

          {/* CARD HOME (imagem grande + texto institucional na tarja) */}
          <div className="mt-8 rounded-3xl overflow-hidden border border-slate-800 bg-white shadow-sm">
            <div className="px-4 sm:px-6 py-6">
              <div className="relative mx-auto w-full max-w-5xl aspect-[21/9] bg-white">
                <Image
                  src="/parcerias/poder-publico/home.webp"
                  alt="Classilagos.shop - 30 anos conectando a Região dos Lagos"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>

              {/* TEXTO INSTITUCIONAL (centralizado) */}
             <div className="mt-3 text-center">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Classilagos.shop — um canal digital regional de utilidade pública
                </h2>

                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl mx-auto">
                  A internet existe para aproximar pessoas e fortalecer comunidades. O{" "}
                  <strong>Classilagos nasce com esse propósito</strong>: integrar a Região dos
                  Lagos em um único ambiente digital, reunindo informação, oportunidades, serviços,
                  turismo e ações de interesse público.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            Observação: o Classilagos.shop não substitui canais oficiais (site, diário oficial ou
            redes sociais). Atua como canal complementar de utilidade pública.
          </p>
        </div>
      </section>

      {/* PILARES */}
      <section id="pilares" className="max-w-6xl mx-auto px-4 py-12">
        <SectionTitle
          kicker="Pilares"
          title="Pilares prontos para parceria"
          subtitle="Os prints abaixo são clicáveis e levam à página real do classilagos.shop."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {pilares.map((p) => (
            <CardPilar key={p.key} p={p} />
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="border-t border-slate-800 bg-slate-900/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <SectionTitle
            kicker="Operação"
            title="Como funciona (simples e sem burocracia)"
            subtitle="Fluxo leve para Secoms e Secretarias, com organização e padronização."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-white font-semibold">A Prefeitura fornece</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Um ponto focal por secretaria (contato)</li>
                <li>• Textos oficiais, links e orientações</li>
                <li>• Imagens/arte quando houver (opcional)</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-white font-semibold">O Classilagos organiza</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Publicação e padronização visual</li>
                <li>• Organização por cidade e tema</li>
                <li>• Busca e compartilhamento fácil</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-white font-semibold">Regras de confiança</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Sem propaganda política/partidária</li>
                <li>• Conteúdo institucional e serviço ao cidadão</li>
                <li>• Identificação clara da origem</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/40 to-slate-900/10 p-6">
            <p className="text-white font-semibold">Sugestão de piloto (30 dias)</p>
            <p className="text-sm text-slate-300 mt-2">
              Começar com 4 frentes: <b>Notícias</b>, <b>Empregos</b>, <b>Pets</b> e{" "}
              <b>Turismo/Cultura</b>. Ao final, avaliar e expandir.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                href="/fale-conosco"
                className="inline-flex items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-100 px-5 py-3 text-sm font-semibold hover:bg-sky-500/20 transition"
              >
                Falar com o Classilagos
              </Link>

              <a
                href="#pilares"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-5 py-3 text-sm font-semibold hover:border-slate-700 transition"
              >
                Ver pilares
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-8">
            classilagos.shop • Parcerias institucionais
          </p>
        </div>
      </section>
    </main>
  );
}
