import { Suspense } from "react";
import FormularioAnuncio from "./formularioanuncio";

export const metadata = {
  title: "Criar anúncio - Classilagos",
  description: "Publique gratuitamente o seu anúncio no Classilagos.",
};

export default function FormularioAnuncioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-slate-600">
          Carregando formulário de anúncio...
        </div>
      }
    >
      <FormularioAnuncio />
    </Suspense>
  );
}
