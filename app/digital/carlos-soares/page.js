export default function CarlosSoaresPage() {
  return (
    <main className="bg-black text-white">

      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center text-center">
        <img
          src="/digital/carlos-soares/hero.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Carlos Soares
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Música, cultura e emoção que nascem das belezas de Maricá
          </p>

          <a
            href="https://wa.me/5521967463576"
            target="_blank"
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full text-lg font-semibold"
          >
            📲 Contratar Show
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Sobre o Artista
        </h2>

        <p className="text-gray-300 leading-relaxed text-lg">
          Carlos Soares é músico, compositor e produtor cultural, com mais de 30 anos de trajetória dedicados à valorização da cultura popular e à conexão com a cidade de Maricá.
          <br /><br />
          Sua música transforma paisagens, histórias e sentimentos em canções que emocionam e representam a identidade local.
        </p>
      </section>

      {/* HISTÓRIA */}
      <section className="py-16 bg-zinc-900 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">

          <img
            src="/digital/carlos-soares/historia.jpg"
            className="rounded-2xl shadow-lg"
          />

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Uma vida dedicada à música
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Ao longo de décadas, Carlos Soares levou sua música a diversos palcos, bares e eventos culturais, construindo uma trajetória marcada pela autenticidade e paixão.
              <br /><br />
              Sua história se mistura com a própria história cultural de Maricá.
            </p>
          </div>

        </div>
      </section>

      {/* SPOTIFY */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-8">
            Ouça no Spotify
          </h2>

          <div className="rounded-xl overflow-hidden">
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/artist/7nw6v0OErLGc0UfTVAdxsD"
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>

        </div>
      </section>

      {/* YOUTUBE */}
      <section className="py-16 bg-zinc-900 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-8">
            Vídeo Destaque
          </h2>

          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
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
      </section>

      {/* GALERIA */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-3xl font-bold mb-8 text-center">
            Galeria
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <img src="/digital/carlos-soares/galeria/1.jpg" className="rounded-xl hover:scale-105 transition"/>
            <img src="/digital/carlos-soares/galeria/2.jpg" className="rounded-xl hover:scale-105 transition"/>
            <img src="/digital/carlos-soares/galeria/3.jpg" className="rounded-xl hover:scale-105 transition"/>
            <img src="/digital/carlos-soares/galeria/4.jpg" className="rounded-xl hover:scale-105 transition"/>

          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 text-center bg-black">
        <h2 className="text-4xl font-bold mb-6">
          Leve esse show para o seu evento
        </h2>

        <p className="text-gray-400 mb-6">
          Música ao vivo com identidade, emoção e conexão com o público
        </p>

        <a
          href="https://wa.me/5521967463576"
          target="_blank"
          className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-xl font-semibold"
        >
          📲 Falar no WhatsApp
        </a>
      </section>

    </main>
  );
}
