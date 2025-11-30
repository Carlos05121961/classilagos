export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] text-slate-500">Painel Classilagos</p>
        <h1 className="text-xl font-bold text-slate-900">
          Dashboard geral
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Visão geral dos anúncios, usuários e atividades no portal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Anúncios ativos</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">—</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Em breve conectamos com o Supabase para trazer os números reais.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Usuários cadastrados</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">—</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Aqui você verá o total de contas ativas na plataforma.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Anúncios pendentes</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">—</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Espaço para moderação de anúncios, se você quiser aprovar antes.
          </p>
        </div>
      </div>
    </div>
  );
}
