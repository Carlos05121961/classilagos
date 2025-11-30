import FormularioImoveis from "../../components/forms/FormularioImoveis";
import FormularioVeiculos from "../../components/forms/FormularioVeiculos";
import FormularioNautica from "../../components/forms/FormularioNautica";
import FormularioPets from "../../components/forms/FormularioPets";

// ⬇️ NADA de "use client" aqui em cima
// ⬇️ NADA de useSearchParams, só usamos searchParams da função

export default function AnunciarFormularioPage({ searchParams }) {
  const tipo = searchParams?.tipo; // vem da URL ?tipo=imoveis

  function renderFormulario() {
    switch (tipo) {
      case "imoveis":
        return <FormularioImoveis />;
      case "veiculos":
        return <FormularioVeiculos />;
      case "nautica":
        return <FormularioNautica />;
      case "pets":
        return <FormularioPets />;
      default:
        return (
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Escolha uma categoria válida
            </h1>
            <p className="text-sm text-slate-600 mb-2">
              Esta página recebe a categoria pela URL, por exemplo:
            </p>
            <p className="text-xs text-slate-500 mb-4">
              <code className="bg-slate-100 px-2 py-1 rounded">
                /anunciar/formulario?tipo=imoveis
              </code>
            </p>
            <p className="text-sm text-slate-600">
              Volte à página <strong>Anuncie grátis</strong> e escolha uma
              seção (Imóveis, Veículos, Náutica ou Pets) para continuar.
            </p>
          </div>
        );
    }
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        {renderFormulario()}
      </section>
    </main>
  );
}

