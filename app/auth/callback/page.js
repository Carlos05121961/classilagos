import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Confirmação de e-mail</h1>
            <p className="text-sm text-slate-600">Carregando...</p>
          </div>
        </main>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}

