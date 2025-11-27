import Link from "next/link";

export default function FestasEventosPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Festas e Eventos
        </h1>
        <p className="text-sm text-slate-700 mb-6">
          Em breve, você encontrará aqui buffets, bolos, doces, decoração,
          DJs, som e iluminação, foto e vídeo, espaços para festas e muitos
          outros serviços para eventos em toda a Região dos Lagos.
        </p>
        <p className="text-sm text-slate-700 mb-6">
          Já é possível cadastrar seu serviço na área de anúncios do Classilagos.
        </p>
        <Link
          href="/anunciar"
          className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Anunciar serviço de festas e eventos
        </Link>
      </section>
    </main>
  );
}
