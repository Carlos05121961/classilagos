"use client";

import { useState } from "react";

export default function TamarindosPage() {
  const WHATSAPP_NUMBER = "552126371983";

  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    hospedes: "2",
    acomodacao: "Casal",
    nome: "",
    whatsapp: "",
    email: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function enviarWhatsapp() {
    const mensagem = `Olá! Gostaria de consultar disponibilidade na Pousada Tamarindos.

📅 Check-in: ${form.checkin || "não informado"}

📅 Check-out: ${form.checkout || "não informado"}

👥 Hóspedes: ${form.hospedes}

🛏️ Acomodação: ${form.acomodacao}

🙍 Nome: ${form.nome || "não informado"}

📱 WhatsApp: ${form.whatsapp || "não informado"}

📧 E-mail: ${form.email || "não informado"}`;

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(link, "_blank");
  }

  const estrutura = [
    "48 leitos",
    "Ar-condicionado",
    "TV e frigobar",
    "Wi-Fi",
    "Café da manhã incluso",
    "Área de lazer",
    "Salão para eventos",
    "Churrasqueira",
    "Próximo ao centro",
  ];

  const tarifas = [
    {
      titulo: "Solteiro",
      descricao: "1 cama • Café incluso",
      valor: "R$ 267",
    },
    {
      titulo: "Casal",
      descricao: "1 cama • Café incluso",
      valor: "R$ 315",
    },
    {
      titulo: "Duplo",
      descricao: "2 camas • Café incluso",
      valor: "R$ 356",
    },
    {
      titulo: "Triplo",
      descricao: "3 camas • Café incluso",
      valor: "R$ 460",
    },
  ];

  return (
    <main className="bg-[#f5f1e8] text-slate-900">
      {/* HERO PREMIUM */}
      <section className="relative min-h-[86vh] overflow-hidden bg-black md:min-h-[96vh]">
        <img
          src="/digital/tamarindos/hero-pousada.webp"
          alt="Pousada Tamarindos"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

        <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-7xl flex-col items-center justify-center px-5 py-10 text-center text-white md:min-h-[96vh]">
          {/* LOGO */}
          <div className="mb-5 rounded-[1.7rem] bg-white/88 px-5 py-4 shadow-2xl backdrop-blur-md md:mb-8 md:rounded-[2.2rem] md:px-14 md:py-7">
            <img
              src="/digital/tamarindos/logo-tamarindos.png"
              alt="Pousada Tamarindos"
              className="mx-auto h-auto w-[220px] md:w-[390px]"
            />
          </div>

          <span className="mb-4 text-[11px] font-medium uppercase tracking-[0.45em] text-yellow-200 md:text-sm">
            Maricá • Lagoa de Araçatiba
          </span>

          <h1 className="max-w-5xl text-4xl font-black leading-tight text-white md:text-7xl">
            Hospede-se de frente para a lagoa
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 md:text-xl">
            Conforto, tranquilidade, café da manhã incluso e localização
            privilegiada em uma das paisagens mais bonitas de Maricá.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-9">
            <a
              href="#reservas"
              className="rounded-full bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-emerald-400"
            >
              Consultar disponibilidade
            </a>

            <a
              href="#acomodacoes"
              className="rounded-full border border-white/70 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
            >
              Ver acomodações
            </a>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="bg-[#f5f1e8] px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl">
            <img
              src="/digital/tamarindos/hero-pousada-2.webp"
              alt="Pousada Tamarindos"
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-emerald-700">
              Pousada Tamarindos
            </p>

            <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Tranquilidade, localização e acolhimento em Maricá
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Localizada de frente para a Lagoa de Araçatiba, a Pousada
              Tamarindos oferece uma experiência acolhedora e tranquila para
              quem deseja relaxar em uma das regiões mais bonitas de Maricá.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              Com acomodações equipadas com ar-condicionado, TV, frigobar e
              café da manhã incluso, a pousada une conforto, praticidade e uma
              excelente localização.
            </p>
          </div>
        </div>
      </section>

      {/* RESERVAS PREMIUM */}
      <section
        id="reservas"
        className="bg-white px-5 py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-emerald-700">
              Reserve sua estadia
            </p>

            <h2 className="text-4xl font-black text-slate-950 md:text-6xl">
              Adicione datas para consultar disponibilidade
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
              Preencha os dados abaixo e fale diretamente com a pousada pelo
              WhatsApp.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* FORM */}
            <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Check-in
                  </label>

                  <input
                    type="date"
                    name="checkin"
                    value={form.checkin}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Check-out
                  </label>

                  <input
                    type="date"
                    name="checkout"
                    value={form.checkout}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Hóspedes
                  </label>

                  <select
                    name="hospedes"
                    value={form.hospedes}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-emerald-500"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Acomodação
                  </label>

                  <select
                    name="acomodacao"
                    value={form.acomodacao}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-emerald-500"
                  >
                    <option>Solteiro</option>
                    <option>Casal</option>
                    <option>Duplo</option>
                    <option>Triplo</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Nome
                  </label>

                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    WhatsApp
                  </label>

                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="(21) 99999-9999"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    E-mail opcional
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seuemail@email.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={enviarWhatsapp}
                className="mt-7 w-full rounded-full bg-emerald-500 px-8 py-5 text-lg font-black text-white shadow-2xl transition hover:scale-[1.02] hover:bg-emerald-600"
              >
                Consultar disponibilidade pelo WhatsApp
              </button>

              <p className="mt-4 text-center text-sm text-slate-500">
                Esta é uma pré-reserva. A confirmação será feita pela pousada.
              </p>
            </div>

            {/* TARIFAS */}
            <div className="rounded-[2.2rem] bg-[#fbf7ef] p-6 shadow-2xl md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-700">
                Tarifas promocionais
              </p>

              <h3 className="mt-3 text-4xl font-black text-slate-950">
                Valores das diárias
              </h3>

              <div className="mt-7 grid gap-4">
                {tarifas.map((item) => (
                  <div
                    key={item.titulo}
                    className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-md"
                  >
                    <div>
                      <h4 className="text-xl font-black text-slate-950">
                        {item.titulo}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.descricao}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-700">
                        {item.valor}
                      </p>

                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        diária
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-emerald-100 bg-white p-5 text-sm leading-relaxed text-slate-700">
                <p>✓ Café da manhã incluso.</p>
                <p>✓ Ar-condicionado, TV e frigobar.</p>
                <p>✓ Crianças até 5 anos não pagam.</p>
                <p>✓ Check-in: 14h • Check-out: 12h.</p>
                <p>✓ Pix e cartões aceitos.</p>
                <p>✓ Não aceitamos animais.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTRUTURA */}
      <section className="bg-[#f5f1e8] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-emerald-700">
            Estrutura
          </p>

          <h2 className="text-4xl font-black text-slate-950 md:text-6xl">
            Tudo para uma estadia confortável
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            Uma estrutura acolhedora e completa para você aproveitar Maricá com
            conforto e tranquilidade.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {estrutura.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#ece3d7] bg-white px-5 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-lg font-bold text-slate-900">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACOMODAÇÕES */}
      <section
        id="acomodacoes"
        className="bg-white px-5 py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-emerald-700">
            Acomodações
          </p>

          <h2 className="text-4xl font-black text-slate-950 md:text-6xl">
            Quartos preparados para sua estadia
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            Ambientes confortáveis para solteiros, casais, famílias e grupos.
          </p>
        </div>
      </section>
    </main>
  );
}
