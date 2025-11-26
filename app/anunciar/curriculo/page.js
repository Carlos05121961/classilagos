// app/anunciar/curriculo/page.js

import FormularioCurriculo from "../../components/forms/FormularioCurriculo";
import Image from "next/image";

export default function AnunciarCurriculoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      {/* CABEÇALHO */}
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Banco de Currículos da Região dos Lagos
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Cadastre seu currículo gratuitamente
        </h1>

        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
          Preencha o formulário abaixo e faça parte do maior banco de talentos
          da Região dos Lagos. Empresas poderão encontrar seu perfil facilmente
          pelo Classilagos.
        </p>
      </header>

      {/* BLOCO DE DICAS */}
      <section className="bg-slate-50 border rounded-2xl shadow-sm p-5 md:p-7 mb-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Dicas para um bom currículo
        </h2>

        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Seja claro ao descrever suas experiências.</li>
          <li>• Adicione cursos e formações, mesmo que curtos.</li>
          <li>• Upload de foto é opcional, mas ajuda a destacar seu perfil.</li>
          <li>• Você também pode enviar um PDF, se já tiver um currículo pronto.</li>
          <li>• Mantenha seus contatos atualizados.</li>
        </ul>

        <div className="flex justify-center mt-4">
          <Image
            src="/ilustracoes/curriculo.png"
            alt="Ilustração currículo"
            width={200}
            height={200}
            className="opacity-90"
          />
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioCurriculo />
      </section>

    </main>
  );
}
