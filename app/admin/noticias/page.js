export default function AdminNoticiasPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-slate-900">Gerenciar notícias</h1>
      <p className="text-sm text-slate-600">
        Controle das notícias importadas e das notícias cadastradas manualmente
        para o portal Classilagos.
      </p>
      <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-500">
        Em breve: listagem de notícias com status, fonte, data e ações (publicar,
        fixar, remover).
      </div>
    </div>
  );
}
