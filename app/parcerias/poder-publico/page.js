import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    key: "noticias",
    title: "Notícias institucionais (Secom)",
    desc:
      "Canal complementar para comunicados oficiais, avisos rápidos, serviços, defesa civil, trânsito e utilidade pública — com identificação clara da origem.",
    href: "/noticias",
    img: "/parcerias/poder-publico/noticias.webp",
    badge: "Prioridade",
  },
  {
    key: "empregos",
    title: "Empregos e cursos",
    desc:
      "Banco de vagas (empresas + prefeitura + terceirizadas), banco de currículos e divulgação de cursos/capacitações — com filtros e organização por cidade.",
    href: "/empregos",
    img: "/parcerias/poder-publico/empregos.webp",
  },
  {
    key: "pets",
    title: "Bem-estar animal",
    desc:
      "Vitrine de adoção, campanhas (castração, vacinação), achados e perdidos e orientações com contatos oficiais. Um aliado gratuito e permanente em prol dos animais.",
    href: "/pets",
    img: "/parcerias/poder-publico/pets.webp",
  },
  {
    key: "turismo",
    title: "Turismo e cultura",
    desc:
      "Guia “Onde ficar / comer / se divertir / passear”, agenda de eventos oficiais e comunitários, roteiros e atrativos — fortalecendo a economia local.",
    href: "/turismo",
    img: "/parcerias/poder-publico/turismo.webp",
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

function Card({ c }) {
  return (
    <Link
      href={c.href}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-sm hover:border-slate-700 transition"
      aria-label={`Abrir página real: ${c.title}`}
    >
      {/* IMAGEM NÍTIDA (SEM ESCURECER) */}
      <div className="relative aspect-[16/9] bg-white">
        <Image
          src={c.img}
          alt={c.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={c.badge === "Prioridade"}
        />
      </div>

      {/* TEXTO FORA DA IMAGEM */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-white font-semibold">{c.title}</p>
            <p className="text-xs text-slate-300 mt-1">
              Clique para abrir a página real no classilagos.shop
            </p>
          </div>

          {c.badge ? (
            <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/20">
              {c.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mt-3">{c.desc}</p>
      </div>
    </Link>
  );
}

export default function PoderPublicoPage() {
  return (
    <main className="bg-slate-950 text-slate-50 min-h-screen">
      {/* HERO COM PRINT HOME + TARJA BRANCA */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Pill>Região dos Lagos • RJ</Pill>
              <Pill>Parceria institucional</Pill>
              <Pill>Utilidade pública</Pill>
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
              Classilagos & Poder Público
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
              Um modelo simples de parceria para ampliar o acesso da população a
              informações e serviços úteis, com organização, busca e
              compartilhamento comunitário.
            </p>
          </div>

 {/* PRINT DA HOME */}
<div className="mt-8 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/40 shadow-sm">
  <div className="bg-white px-4 py-6">
    <div className="relative mx-auto w-full max-w-7xl aspect-[22/9]">
      <Image
        src="/parcerias/poder-publico/home.webp"
        alt="Classilagos.shop - 30 anos conectando a Região dos Lagos"
        fill
        className="object-contain"
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
      />
    </div>

    <div className="mt-5">
      <h2 className="text-base font-semibold text-slate-900">
        Classilagos.shop
      </h2>
      <p className="mt-1 text-sm text-slate-700">
        Um canal digital regional de utilidade pública, conectando a população da Região dos Lagos a informações, serviços e oportunidades.
      </p>
    </div>
  </div>
</div>




            {/* TARJA BRANCA (TEXTO OFICIAL) */}
            <div className="bg-white text-slate-900">
              <div className="px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-base sm:text-lg font-semibold">
                  Classilagos.shop
                </p>
                <p className="text-sm sm:text-base text-slate-700 mt-1">
                  Um canal digital regional de utilidade pública, conectando a
                  população da Região dos Lagos a informações, serviços e
                  oportunidades.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            Observação: o Classilagos.shop não substitui canais oficiais
            (site/diário oficial/redes). Atua como canal complementar de
            utilidade pública.
          </p>
        </div>
      </section>

      {/* PILARES (4 CARDS) */}
      <section id="pilares" className="max-w-6xl mx-auto px-4 py-12">
        <SectionTitle
          kicker="Demonstração"
          title="Pilares prontos para parceria"
          subtitle="Os prints abaixo são clicáveis e levam à página real do classilagos.shop — para você mostrar na reunião de forma prática."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((c) => (
            <Card key={c.key} c={c} />
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA (CURTO, OBJETIVO) */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 pb-16">
        <SectionTitle
          kicker="Operação simples"
          title="Como funciona (sem burocracia)"
          subtitle="Uma parceria institucional, neutra e focada em interesse coletivo."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-white font-semibold">A Prefeitura envia</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Um ponto focal (contato) por secretaria</li>
              <li>• Textos oficiais + links</li>
              <li>• Imagens/arte quando houver (opcional)</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-white font-semibold">O Classilagos organiza</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Publicação e padronização visual Premium</li>
              <li>• Organização por cidade/categoria</li>
              <li>• Busca e compartilhamento fácil</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-white font-semibold">Regras de confiança</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Sem propaganda política/partidária</li>
              <li>• Conteúdo institucional e de serviço ao cidadão</li>
              <li>• Transparência e identificação da origem</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/40 to-slate-900/10 p-6">
          <p className="text-white font-semibold">
            Sugestão de piloto (30 dias)
          </p>
          <p className="text-sm text-slate-300 mt-2">
            Começar com 4 frentes: <b>Notícias</b>, <b>Empregos</b>, <b>Pets</b> e{" "}
            <b>Turismo/Cultura</b>. Ao final, avaliar resultados e expandir.
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
              Ver prints clicáveis
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
