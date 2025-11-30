"use client";

export default function AdminBannersPage() {
  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          Administração • Classilagos
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Gerenciar banners comerciais
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Aqui você vai controlar os espaços de banners da plataforma:
          topo, meio de página, rodapé e banners internos nos anúncios.
          Nesta primeira fase é apenas um painel de planejamento. Depois
          podemos integrar com o banco de dados.
        </p>
      </div>

      {/* Aviso de “em breve” */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold">Em breve: sistema completo de banners</p>
        <p className="mt-1">
          O painel de banners ainda não está ligado ao banco de dados. 
          Vamos usá-lo por enquanto como um quadro de controle para 
          planejar os espaços comerciais e os formatos.
        </p>
      </div>

      {/* Quadro de posições de banners */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Coluna 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Posições principais
          </h2>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Banner topo (todas as páginas)</li>
            <li>• Banner meio da home</li>
            <li>• Banner meio dos pilares (Imóveis, Veículos, etc.)</li>
            <li>• Banner rodapé (home e páginas internas)</li>
          </ul>
          <p className="text-[11px] text-slate-500 mt-2">
            No futuro, cada posição poderá ter contrato, período de exibição,
            cliente e link de destino configurados aqui.
          </p>
        </div>

        {/* Coluna 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Banners internos
          </h2>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Banners dentro das páginas de anúncios</li>
            <li>• Banners na área de notícias</li>
            <li>• Banners especiais no Turismo e LagoListas</li>
          </ul>
          <p className="text-[11px] text-slate-500 mt-2">
            Podemos planejar pacotes especiais: destaque em pilar + banners
            internos + presença na home.
          </p>
        </div>
      </div>

      {/* Futuro formulário simples (placeholder) */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
        <p className="text-sm font-semibold text-slate-800">
          Próximo passo
        </p>
        <p className="text-sm text-slate-600 mt-1">
          Quando você quiser, criamos aqui um formulário para cadastrar
          banners (nome do cliente, posição, datas, link, imagem, etc.)
          integrado ao Supabase.
        </p>
      </div>
    </div>
  );
}
