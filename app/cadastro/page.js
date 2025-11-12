"use client";

export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Cadastre-se no Classilagos
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Ex: João da Silva"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seuemail@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite uma senha"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar senha
            </label>
            <input
              type="password"
              placeholder="Repita a senha"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Cadastrar (demo)
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Já tem uma conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Entrar
          </a>
        </p>
      </section>
    </main>
  );
}
