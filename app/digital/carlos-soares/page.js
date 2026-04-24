export default function CarlosSoaresPage() {
  return (
    <main className="bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img
          src="/digital/carlos-soares/hero.jpg"
          alt="Carlos Soares tocando violão em Maricá"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
              🎤 Artista • Compositor • Projeto Cultural
            </p>

            <h1 className="mb-5 text-5xl font-black leading-tight md:text-7xl">
              Carlos Soares
            </h1>

            <p className="mb-7 max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl">
              Música, cultura e emoção que nascem das belezas de Maricá.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://wa.me/5521967463576?text=Olá%20Carlos,%20gostaria%20de%20contratar%20um%20show."
                target="_blank"
                className="rounded-full bg-green-500 px-7 py-4 text-center text-lg font-bold text-white shadow-lg transition hover:bg-green-600"
              >
                📲 Contratar Show
              </a>

              <a
                href="#video"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-4 text-center text-lg font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                ▶️ Assistir Vídeo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="bg-[#080808] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
              Sobre o artista
            </p>

            <h2 className="mb-6 text-4xl font-black md:text-5xl">
              Uma trajetória dedicada à música e à cultura
            </h2>

            <div className="space-y-5 text-lg leading-relaxed text-zinc-300">
              <p>
                Carlos Soares é músico, compositor e produtor cultural, com uma
                trajetória marcada pela valorização da cultura popular e pela
                relação profunda com a cidade de Maricá, no estado do Rio de Janeiro.
              </p>

              <p>
                Nascido em Patos, na Paraíba, iniciou sua caminhada musical ainda
                jovem, participando de festivais e eventos culturais. Em busca do
                sonho de seguir carreira artística, passou por São Paulo e Rio de
                Janeiro até chegar a Maricá — cidade que se tornaria sua grande
                fonte de inspiração.
              </p>

              <p>
                Ao longo de décadas, apresentou-se em bares, eventos e espaços
                culturais, levando sua música a diferentes bairros e comunidades,
                sempre com autenticidade, emoção e identidade brasileira.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl">
            <img
              src="/digital/carlos-soares/historia.jpg"
              alt="Carlos Soares em sua trajetória musical"
              className="h-[520px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      {/* MARICÁ EM CANÇÃO */}
      <section className="bg-gradient-to-b from-black to-zinc-950 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
            Projeto cultural
          </p>

          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Maricá em Canção
          </h2>

          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-zinc-300">
            O projeto Maricá em Canção nasce da relação profunda de Carlos Soares
            com a cidade. Por meio da música, transforma paisagens, histórias e
            sentimentos em canções que valorizam a memória, a cultura e a
            identidade do povo maricaense.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-2 text-xl font-bold">🎶 Música</h3>
              <p className="text-zinc-400">
                Canções autorais inspiradas nas belezas e histórias de Maricá.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-2 text-xl font-bold">🏛️ Cultura</h3>
              <p className="text-zinc-400">
                Apresentações para escolas, eventos, projetos e espaços culturais.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-2 text-xl font-bold">🌊 Maricá</h3>
              <p className="text-zinc-400">
                Uma homenagem viva à cidade, sua memória e sua identidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPOTIFY */}
      <section className="bg-[#080808] px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
            Plataforma digital
          </p>

          <h2 className="mb-8 text-4xl font-black">
            Ouça no Spotify
          </h2>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-3 shadow-2xl">
            <iframe
              style={{ borderRadius: "18px" }}
              src="https://open.spotify.com/embed/artist/7rw6v0OErLGc0UfTVAdxsD"
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video" className="bg-black px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
            Vídeo destaque
          </p>

          <h2 className="mb-8 text-4xl font-black">
            Sob o céu, sob o sol de Maricá
          </h2>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-3 shadow-2xl">
            <div className="aspect-video overflow-hidden rounded-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/xZU5vjhiCsQ"
                title="Sob o céu, sob o sol de Maricá"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* DISCO */}
      <section className="bg-zinc-950 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
            Catálogo autoral
          </p>

          <h2 className="mb-6 text-4xl font-black">
            Músicas que contam Maricá
          </h2>

          <p className="mb-10 max-w-4xl text-lg leading-relaxed text-zinc-300">
            Seu primeiro álbum, “Sob o céu, sob o sol de Maricá”, reúne faixas
            autorais e representa uma fase importante da sua trajetória artística.
            Atualmente, Carlos Soares trabalha em novas canções que continuam
            exaltando a cultura, a história e as belezas naturais da cidade.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Sob o céu, sob o sol de Maricá",
              "Maricá Cartão Postal",
              "Lagoa Viva",
              "Pra Maricá Eu Vou",
              "Pra gente sonhar",
              "Cidade Azul",
            ].map((musica) => (
              <div
                key={musica}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-lg font-semibold"
              >
                🎵 {musica}
              </div>
            ))}
          </div>
        </div>
      </section>

{/* GALERIA */}
<section className="bg-black px-6 py-20">
  <div className="mx-auto max-w-6xl">
    <p className="mb-3 text-center text-sm font-bold uppercase tracking-[0.3em] text-green-400">
      Memória visual
    </p>

    <h2 className="mb-10 text-center text-4xl font-black">
      Galeria
    </h2>

    <div className="grid gap-5 md:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((foto) => (
        <div
          key={foto}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl"
        >
          <img
            src={`/digital/carlos-soares/galeria/${foto}.jpg`}
            alt={`Carlos Soares galeria ${foto}`}
            className="h-72 w-full object-cover transition duration-500 hover:scale-105 md:h-80"
          />
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-5 text-4xl font-black md:text-5xl">
            Leve Carlos Soares para o seu evento
          </h2>

          <p className="mb-8 text-xl text-white/90">
            Shows, eventos culturais, apresentações especiais, escolas, projetos
            e ações institucionais.
          </p>

          <a
            href="https://wa.me/5521967463576"
            target="_blank"
            className="inline-flex rounded-full bg-white px-9 py-4 text-xl font-black text-green-700 shadow-xl transition hover:scale-105"
          >
            📲 Falar no WhatsApp
          </a>
        </div>
      </section>
              
{/* RODAPÉ */}
<footer className="bg-[#050505] border-t border-white/10 px-6 py-10">
  <div className="mx-auto max-w-6xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <div>
      <h3 className="text-2xl font-black text-white">
        Carlos Soares
      </h3>

      <p className="mt-2 text-sm text-zinc-400">
        Música, cultura e emoção inspiradas em Maricá.
      </p>
    </div>

    <div className="flex flex-col gap-2 text-sm text-zinc-400 md:text-right">
      <p>
        Projeto artístico: <span className="text-white">Maricá em Canção</span>
      </p>

      <p>
        Contato:{" "}
        <a
          href="https://wa.me/5521967463576"
          target="_blank"
          className="text-green-400 hover:text-green-300"
        >
          WhatsApp
        </a>
      </p>

      <p className="text-zinc-500">
        © {new Date().getFullYear()} Carlos Soares
      </p>

      <p className="text-zinc-600">
        Produzido por Classilagos Digital
      </p>
    </div>
  </div>
</footer>
</main>
);
}

