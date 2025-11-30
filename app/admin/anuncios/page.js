export default function AdminAnunciosPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-slate-900">Gerenciar anúncios</h1>
      <p className="text-sm text-slate-600">
        Aqui você poderá visualizar, editar, aprovar, destacar e remover anúncios
        de todas as categorias do Classilagos.
      </p>
      <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-500">
        Em breve: tabela com todos os anúncios (filtros por categoria, cidade,
        status, usuário, data, etc.).
      </div>
    </div>
  );
}
