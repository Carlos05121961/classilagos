"use client";

import Link from "next/link";
import Image from "next/image";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700">
      {children}
    </span>
  );
}

function NewsExampleCard({ cidade, imagem, titulo, linhaFina, texto, autor, href = "#" }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-44 sm:h-52">
        <Image
          src={imagem}
          alt={titulo}
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-sky-700 uppercase tracking-wide">
            {cidade}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700">
            Exemplo ilustrativo
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h2 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
          {titulo}
        </h2>

        <p className="text-sm text-slate-600">{linhaFina}</p>

        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          {texto.split("\n\n").map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500">
            Por <strong className="text-slate-700">{autor}</strong> • Correspondente Cultural Classilagos
          </p>

          {/* Se você quiser futuramente apontar para uma notícia real, use href válido */}
          <Link
            href={href}
            className="text-[11px] font-semibold text-sky-700 hover:underline"
          >
            Ver estrutura de notícia →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ExemplosCorrespondentesPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-3">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Exemplos de matérias com créditos
              </h1>
              <p className="text-sm text-slate-600 max-w-3xl">
                Esta página mostra exemplos ilustrativos de como as matérias dos Correspondentes Culturais
                aparecem no Classilagos: <strong>título</strong>, <strong>linha fina</strong>, <strong>texto</strong> e
                <strong> crédito do autor</strong>.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Link
                href="/noticias/correspondentes"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Voltar para Correspondentes
              </Link>

              <Link
                href="/noticias/correspondentes/candidatar"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
              >
                Quero ser correspondente
              </Link>
            </div>
          </div>

          <div className="mt-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Formato leve</Badge>
              <Badge>Conteúdo positivo</Badge>
              <Badge>Curadoria editorial</Badge>
              <Badge>Crédito com cidade</Badge>
              <Badge>Sem política partidária</Badge>
            </div>

            <p className="mt-3 text-[11px] text-slate-600">
              Dica: não precisa começar com uma matéria longa. Uma boa história local, bem contada e verdadeira,
              já é um excelente primeiro passo.
            </p>
          </div>
        </div>
      </section>

      {/* LISTA DE EXEMPLOS */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <NewsExampleCard
            cidade="Saquarema"
            imagem="/noticias/correspondentes/exemplos/saquarema-surf.jpg"
            titulo="Festival de Surf movimenta Saquarema, a Capital Brasileira do Surf"
            linhaFina="Evento reúne atletas, moradores e visitantes, fortalecendo a identidade cultural e esportiva da cidade."
            texto={
              "Saquarema voltou a respirar o clima do surf com a realização de um festival que movimentou atletas, moradores e visitantes.\n\nAlém das baterias no mar, o evento gerou impacto no turismo e no comércio local, reforçando a vocação da cidade como referência nacional do surf."
            }
            autor="Nome do Correspondente – Saquarema"
            href="#"
          />

          <NewsExampleCard
            cidade="Búzios"
            imagem="/noticias/correspondentes/exemplos/buzios-gastro.jpg"
            titulo="Festival Gastronômico anima a Rua das Pedras e celebra sabores de Búzios"
            linhaFina="Culinária, música e experiências ao ar livre valorizam restaurantes, chefs e a economia criativa."
            texto={
              "A Rua das Pedras virou um corredor gastronômico a céu aberto, reunindo moradores e turistas em uma celebração de sabores.\n\nO festival reforça Búzios como destino cultural e turístico, valorizando empreendedores locais e experiências que vão além das praias."
            }
            autor="Nome do Correspondente – Búzios"
            href="#"
          />

          <NewsExampleCard
            cidade="Arraial do Cabo"
            imagem="/noticias/correspondentes/exemplos/arraial-tintas.jpg"
            titulo="Loja de Tintas do Serjão comemora 40 anos de bons serviços em Arraial do Cabo"
            linhaFina="Comércio tradicional e história local: quatro décadas de atendimento e confiança na comunidade."
            texto={
              "A Loja de Tintas do Serjão celebra 40 anos em Arraial do Cabo, consolidando-se como referência em atendimento e orientação ao cliente.\n\nHistórias como essa valorizam o comércio tradicional e ajudam a preservar a memória afetiva da cidade."
            }
            autor="Nome do Correspondente – Arraial do Cabo"
            href="#"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900">Como fica o crédito na matéria</h3>
          <p className="text-sm text-slate-600 mt-1">
            O padrão de assinatura segue sempre este formato:
          </p>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <strong>Por Nome do Correspondente</strong>
              <br />
              Correspondente Cultural Classilagos – Cidade
            </p>
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Observação: os exemplos acima são ilustrativos. Publicações reais passam por curadoria editorial.
          </p>
        </div>
      </section>
    </main>
  );
}
