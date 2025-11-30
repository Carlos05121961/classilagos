"use client";

export default function AdminConfigPage() {
  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          Administração • Classilagos
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Configurações do portal
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Área reservada para ajustes gerais do Classilagos: textos padrão,
          contatos, cidades atendidas, mensagens do rodapé e outros detalhes
          administrativos.
        </p>
      </div>

      {/* Aviso “em construção” */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        <p className="font-semibold">Painel de configurações em construção</p>
        <p className="mt-1">
          Por enquanto, esta página funciona como um painel de planejamento.
          À medida que o projeto evoluir, vamos trazer para cá as opções mais
          importantes para você controlar sem precisar mexer em código.
        </p>
      </div>

      {/* Blocos de futuras configurações */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bloco 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Informações gerais do portal
          </h2>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Nome curto: Classilagos</li>
            <li>• Slogan: O seu guia de compras e serviços na Região dos Lagos</li>
            <li>• E-mail de contato principal</li>
            <li>• Telefone / WhatsApp comercial</li>
          </ul>
          <p className="text-[11px] text-slate-500 mt-2">
            Esses dados podem aparecer no rodapé, página &quot;Quem somos&quot; 
            e em e-mails automáticos.
          </p>
        </div>

        {/* Bloco 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Regiões e cidades atendidas
          </h2>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Maricá</li>
            <li>• Saquarema, Araruama, Iguaba, São Pedro</li>
            <li>• Arraial do Cabo, Cabo Frio, Búzios, Rio das Ostras</li>
            <li>• Outras cidades que você quiser adicionar</li>
          </ul>
          <p className="text-[11px] text-slate-500 mt-2">
            No futuro, podemos manter essa lista no banco de dados e usar
            em todos os formulários de anúncios e buscas.
          </p>
        </div>
      </div>

      {/* Bloco 3 – Textos padrão */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        <h2 className="text-sm font-semibold text-slate-800">
          Textos padrão do site
        </h2>
        <p className="text-sm text-slate-600">
          Aqui poderemos centralizar textos como:
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Mensagem do topo da Home (chamada principal)</li>
          <li>• Texto &quot;Quem somos&quot;</li>
          <li>• Texto sobre anúncios grátis e planos de destaque</li>
          <li>• Avisos legais, termos de uso e política de privacidade</li>
        </ul>
        <p className="text-[11px] text-slate-500 mt-2">
          A ideia é que você possa ajustar tudo isso por aqui sem precisar
          mexer em código.
        </p>
      </div>
    </div>
  );
}
