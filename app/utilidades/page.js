import { Suspense } from "react";
import UtilidadesClient from "./UtilidadesClient";

export default function UtilidadesPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-slate-50 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 pt-10">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <p className="text-sm font-semibold text-slate-700">Carregando Utilidades…</p>
              <p className="mt-1 text-xs text-slate-500">Só um instante 🙂</p>
            </div>
          </div>
        </main>
      }
    >
      <UtilidadesClient />
    </Suspense>
  );
}
