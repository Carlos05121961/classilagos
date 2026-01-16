import Image from "next/image";
import Link from "next/link";

const shots = [
  {
    title: "Notícias institucionais (Secom)",
    desc:
      "Canal complementar para comunicados oficiais, avisos rápidos, serviços, defesa civil, trânsito e utilidade pública — com identificação clara da origem.",
    href: "/noticias",
    img: "/parcerias/poder-publico/noticias.webp",
    badge: "Prioridade",
  },
  {
    title: "Empregos e cursos",
    desc:
      "Banco de vagas (empresas + prefeitura + terceirizadas), banco de currículos e divulgação de cursos/capacitações. Estrutura pronta e organizada por filtros.",
    href: "/empregos",
    img: "/parcerias/poder-publico/empregos.webp",
  },
  {
    title: "Bem-estar animal",
    desc:
      "Adoção, campanhas (castração, vacinação), feiras, achados e perdidos e orientações com contatos oficiais. Um aliado gratuito e permanente em prol dos animais.",
    href: "/pets",
    img: "/parcerias/poder-publico/pets.webp",
  },
  {
    title: "Turismo e cultura",
    desc:
      "Guia “Onde ficar / comer / se divertir / passear”, agenda de eventos oficiais e comunitários, roteiros e atrativos. Fortalece economia local e identidade do território.",
    href: "/turismo",
    img: "/parcerias/poder-publico/turismo.webp",
  },
  {
    title: "Serviços e comércio local (LagoListas/Serviços)",
    desc:
      "Organização de profissionais, empresas e serviços da região, fortalecendo a economia local e a circulação de informação útil ao cidadão.",
    href: "/servicos",
    img: "/parcerias/poder-publico/servicos.webp",
  },
];

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

function CardShot({ s }) {
  return (
    <Link
      href={s.href}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-sm hover:border-slate-700 transition"
      aria-label={`Abrir página real: ${s.title}`}
    >
      <div className="relative aspect-[16/9] bg-slate-950">
        <Image
          src={s.img}
          alt={s.title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={s.badge === "Prioridade"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{s.title}</p>
            <p className="text-xs text-slate-200/80">
              Clique para acessar a página real
            </p>
          </div>
          {s.badge ? (
            <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/20">
              {s.badge}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-300 leading-relaxed">{s.desc}</p>
      </div>
    </Link>
  );
}

export default function PoderPublicoPage() {
  return (
    <main className="bg-slate-950 text-slate-50 min-h-screen">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-widest text-slate-300/80 uppercase">
            classilagos.shop • Parcerias institucionais
          </p>

          <h1 className="text-3xl sm:text-5xl font-semibold mt-3 leading-tight">
            Classilagos & Poder Público
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-3xl">
            Parceria institucional para ampliar o acesso da população a informações e serviços úteis
            (empregos, adoção, turismo, cultura, saúde, avisos e links oficiais), com foco em alcance orgânico
            e compartilhamento comunitário.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-100 px-5 py-3 text-sm font-semibold hover:bg-sky-500/20 transition"
            >
              Como funciona (sem burocracia)
            </a>

            <a
              href="#pilares"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-5 py-3 text-sm font-semibold hover:border-slate-700 transition"
            >
              Ver pilares prontos (com prints)
            </a>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="relative aspect-[21/9] bg-slate-950">
              <Image
                src="/parcerias/poder-publico/home.webp"
                alt="Classilagos – visão geral (print da home)"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
              <div className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 max-w-xl">
                <p className="text-xs font-semibold tracking-widest text-slate-200/80 uppercase">
                  Região dos Lagos – RJ
                </p>
                <p className="text-xl sm:text-2xl font-semibold mt-2">
                  Um canal digital regional de utilidade pública
                </p>
                <p className="text-sm text-slate-200/80 mt-2">
                  Material demonstrativo e reutilizável para diferentes cidades e secretarias.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Observação: o Classilagos.shop não substitui canais oficiais (site/diário oficial/redes). Atua como canal complementar.
          </p>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <SectionTitle
          kicker="Objetivo"
          title="O que a Prefeitura ganha"
          subtitle="Benefícios diretos para comunicação pública, serviços e transparência."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Mais alcance para campanhas e serviços públicos (compartilhamento fácil e rápido).",
            "Centralização de informações em um canal que a população realmente usa.",
            "Serviço permanente, sem custo alto de estrutura e sem depender só de redes sociais.",
            "Transparência e neutralidade: parceria institucional, sem vínculo político/partidário.",
            "Fortalecimento do turismo, cultura e economia local (comércio, eventos, roteiros, agenda cultural).",
            "Organização por cidade/tema e facilidade de acesso no celular.",
          ].map((t) => (
            <div
              key={t}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
            >
              <p className="text-sm text-slate-200">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PILARES COM PRINTS */}
      <section id="pilares" className="border-t border-slate-800 bg-slate-900/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <SectionTitle
            kicker="Pilares prontos"
            title="Áreas de utilidade pública já estruturadas"
            subtitle="Os prints abaixo são clicáveis e levam à página real do Classilagos.shop."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {shots.map((s) => (
              <CardShot key={s.title} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 py-12">
        <SectionTitle
          kicker="Operação simples"
          title="Como funciona (sem burocracia)"
          subtitle="Fluxo leve para Secoms e Secretarias, com organização e padronização."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold">A Prefeitura fornece</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc pl-5">
              <li>Um ponto focal por secretaria (contato).</li>
              <li>Informações oficiais (texto e links).</li>
              <li>Artes ou imagens quando houver (opcional).</li>
            </ul>
            <p className="text-xs text-slate-400 mt-4">
              Para notícias institucionais, o ideal é o envio direto pela Secom (conteúdo oficial + cidade + secretaria).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold">O Classilagos oferece</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc pl-5">
              <li>Páginas prontas, organização, busca e publicação.</li>
              <li>Padronização visual Premium.</li>
              <li>Estrutura de divulgação e compartilhamento comunitário.</li>
              <li>Relatórios simples (quando aplicável).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* NEUTRALIDADE */}
      <section className="border-t border-slate-800 bg-slate-900/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <SectionTitle
            kicker="Confiança institucional"
            title="Regras de neutralidade"
            subtitle="Parceria focada em utilidade pública e interesse coletivo."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Sem propaganda política.",
              "Sem promoção de candidato/partido.",
              "Conteúdo institucional e serviço ao cidadão.",
              "Publicação baseada em utilidade pública e interesse coletivo.",
            ].map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
              >
                <p className="text-sm text-slate-200">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILOTO 30 DIAS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <SectionTitle
          kicker="Implantação"
          title="Primeiro piloto (30 dias)"
          subtitle="Começar pequeno, medir resultado e ampliar com segurança."
        />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <p className="text-sm text-slate-300">
            Iniciar com 3 frentes: <strong className="text-slate-100">Empregos</strong>{" "}
            (vagas + currículos), <strong className="text-slate-100">Bem-estar animal</strong>{" "}
            (adoções + campanhas) e <strong className="text-slate-100">Turismo/Cultura</strong>{" "}
            (agenda + guia “Onde”). Ao final, avaliar e expandir para Saúde (Classimed) e outros serviços.
          </p>
        </div>
      </section>

      {/* BANNERS (COMO CAMPANHAS) */}
      <section className="border-t border-slate-800 bg-slate-900/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <SectionTitle
            kicker="Campanhas públicas"
            title="Espaços para comunicados e campanhas institucionais"
            subtitle="Na fase atual, o foco é utilidade pública e crescimento orgânico. Espaços visuais podem apoiar campanhas e avisos oficiais."
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="relative aspect-[21/9] bg-slate-950">
              <Image
                src="/parcerias/poder-publico/banners-noticias.webp"
                alt="Exemplo de espaço de banner na página de notícias"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute left-5 bottom-5">
                <p className="text-sm font-semibold">Exemplo: banners na página de notícias</p>
                <p className="text-xs text-slate-200/80">
                  Campanhas, comunicados e utilidade pública (sem caráter político/partidário).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FECHAMENTO */}
      <section className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-sm text-slate-300 max-w-4xl">
            O <strong className="text-slate-100">Classilagos.shop</strong> se propõe a ser um aliado digital permanente
            do poder público na informação, na transparência e no serviço ao cidadão — com responsabilidade,
            neutralidade e foco em utilidade pública.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/noticias"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-4 py-2 text-sm font-semibold hover:border-slate-700 transition"
            >
              Abrir Notícias
            </Link>
            <Link
              href="/empregos"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-100 px-4 py-2 text-sm font-semibold hover:border-slate-700 transition"
            >
              Abrir Empregos
            </Link>
            <a
              href="#pilares"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-100 px-4 py-2 text-sm font-semibold hover:bg-sky-500/20 transition"
            >
              Ver prints clicáveis
            </a>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            classilagos.shop • Parcerias institucionais
          </p>
        </div>
      </section>
    </main>
  );
}
