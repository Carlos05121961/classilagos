import { useState } from "react";

export default function AnunciarEmpregoPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    // depois integramos com backend / banco de dados
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Anunciar vaga de emprego
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Preencha os dados da vaga para divulgar sua oportunidade no Classilagos.
          Neste primeiro momento é uma simulação — estamos definindo o modelo de
          formulário que depois será salvo em banco de dados e exibido no nosso
          banco de empregos.
        </p>

        {enviado && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✅ Vaga enviada (simulação). Em breve vamos salvar esses dados de
            verdade e exibir no banco de empregos e nos destaques.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white rounded-2xl border border-slate-200 px-4 py-6 md:px-6 md:py-7"
        >
          {/* TIPO DE VAGA */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Tipo de vaga
            </h2>
            <div className="grid gap-3 md:grid-cols-4 text-xs text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoVaga"
                  value="efetivo"
                  defaultChecked
                />
                Efetivo / CLT
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoVaga" value="temporario" />
                Temporário
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoVaga" value="estagio" />
                Estágio
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="tipoVaga" value="freelancer" />
                Freelancer / Autônomo
              </label>
            </div>
          </section>

          {/* ÁREA / CARGO / MODELO DE TRABALHO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Área e cargo
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="area"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Área profissional
                </option>
                <option>Comércio / Vendas</option>
                <option>Serviços gerais</option>
                <option>Turismo / Hotelaria / Restaurantes</option>
                <option>Saúde</option>
                <option>Educação</option>
                <option>Construção civil</option>
                <option>Administração / Escritório</option>
                <option>Tecnologia / Informática</option>
                <option>Transporte / Logística</option>
                <option>Outras áreas</option>
              </select>

              <input
                name="cargo"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Cargo (ex: Atendente de loja, Garçom, Professor...)"
              />

              <select
                name="modeloTrabalho"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Modelo de trabalho
                </option>
                <option>Presencial</option>
                <option>Híbrido</option>
                <option>Remoto</option>
              </select>
            </div>
          </section>

          {/* LOCALIZAÇÃO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Localização da vaga
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <select
                name="cidade"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                defaultValue=""
              >
                <option value="" disabled>
                  Cidade
                </option>
                <option>Maricá</option>
                <option>Saquarema</option>
                <option>Araruama</option>
                <option>Iguaba Grande</option>
                <option>São Pedro da Aldeia</option>
                <option>Arraial do Cabo</option>
                <option>Cabo Frio</option>
                <option>Búzios</option>
                <option>Rio das Ostras</option>
              </select>

              <input
                name="bairro"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Bairro / região"
              />
            </div>
          </section>

          {/* FAIXA SALARIAL / HORÁRIO */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Condições da vaga
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                name="salario"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Faixa salarial (ex: R$ 1.800 a R$ 2.200)"
              />
              <input
                name="horario"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Horário (ex: 8h às 17h, escala 12x36)"
              />
              <input
                name="contrato"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Informações de contrato (opcional)"
              />
            </div>
          </section>

          {/* DESCRIÇÃO, REQUISITOS, BENEFÍCIOS */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Descrição da vaga
            </h2>
            <textarea
              name="descricao"
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
              placeholder="Descreva as principais atividades da função, perfil desejado, ambiente de trabalho, etc."
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Requisitos e benefícios
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <textarea
                name="requisitos"
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Requisitos (escolaridade, experiência, cursos, habilidades, etc.)"
              />
              <textarea
                name="beneficios"
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Benefícios (vale transporte, alimentação, plano de saúde, comissão, etc.)"
              />
            </div>
          </section>

          {/* CONTATO DA EMPRESA / ANUNCIANTE */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Dados do anunciante
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                name="empresa"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Nome da empresa ou anunciante"
              />
              <input
                name="telefone"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="Telefone / WhatsApp"
              />
              <input
                name="email"
                type="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800"
                placeholder="E-mail para receber currículos"
              />
            </div>

            <label className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
              <input type="checkbox" name="ocultarNome" />
              Não exibir publicamente o nome da empresa (mostrar apenas cidade e
              contato).
            </label>
          </section>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Enviar vaga (simulação)
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

