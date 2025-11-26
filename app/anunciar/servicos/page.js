// app/anunciar/servicos/page.js

import FormularioServicos from "../../components/forms/FormularioServicos";

export default function AnunciarServicosPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* CABEÇALHO */}
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie seus serviços gratuitamente
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Anunciar serviço
        </h1>

        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
          Divulgue o seu trabalho, seja você profissional autônomo, empresa ou
          prestador de serviços. Seu anúncio ficará visível para milhares de
          pessoas em toda a Região dos Lagos.
        </p>
      </header>

      {/* DICAS SIMPLES (SEM IMAGEM) */}
      <section className="bg-slate-50 border rounded-2xl shadow-sm p-5 md:p-7 mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Dicas para fazer um bom anúncio
        </h2>

        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Use um título claro (ex.: Eletricista residencial em Maricá).</li>
          <li>
            • Explique bem o que você faz, onde atende e se vai até o cliente.
          </li>
          <li>
            • Informe formas de contato (WhatsApp, telefone, redes sociais ou
            site).
          </li>
          <li>
            • Se possível, adicione uma foto ou logo para o cliente reconhecer
            sua marca.
          </li>
        </ul>
      </section>

      {/* FORMULÁRIO */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioServicos />
      </section>
    </main>
  );
}
