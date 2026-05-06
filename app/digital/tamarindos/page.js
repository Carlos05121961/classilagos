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
    setForm((prev) => ({ ...prev, [name]: value }));
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

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  }

  const tarifas = [
    { tipo: "Solteiro", detalhe: "1 cama", valor: "R$ 267,00" },
    { tipo: "Casal", detalhe: "1 cama", valor: "R$ 315,00" },
    { tipo: "Duplo", detalhe: "2 camas", valor: "R$ 356,00" },
    { tipo: "Triplo", detalhe: "3 camas", valor: "R$ 460,00" },
  ];

  const estrutura = [
    "48 leitos",
    "Ar-condicionado",
    "TV e frigobar",
    "Café da manhã incluso",
    "Wi-Fi",
    "Área de lazer",
    "Churrasqueira",
    "Salão para eventos",
    "Próximo ao centro",
  ];

  const quartos = [
    "/digital/tamarindos/quarto-01.webp",
    "/digital/tamarindos/quarto-02.webp",
    "/digital/tamarindos/quarto-03.webp",
    "/digital/tamarindos/quarto-04.webp",
  ];

  const galeria = [
    "/digital/tamarindos/galeria-01.webp",
    "/digital/tamarindos/galeria-02.webp",
    "/digital/tamarindos/galeria-03.webp",
    "/digital/tamarindos/galeria-04.webp",
    "/digital/tamarindos/area-cafe-01.webp",
    "/digital/tamarindos/area-cafe-02.webp",
  ];

  return (
    <main className="bg-[#f6f1e8] text-slate-950">
      {/* HERO */}
      <section className="relative min-h-[82vh] overflow-hidden bg-black md:min-h-[92vh]">
        <img
          src="/digital/tamarindos/hero-pousada.webp"
          alt="Pousada Tamarindos"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/70" />

        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-6xl flex-col items-center justify-center px-5 py-10 text-center text-white md:min-h-[92vh]">
          <div className="mb-5 rounded-[1.6rem] bg-white/88 px-5 py-4 shadow-2xl backdrop-blur-md md:mb-7 md:rounded-[2rem] md:px-12 md:py-6">
            <img
              src="/digital/tamarindos/tamarindos-logo.webp"
              alt="Pousada Tamarindos Maricá"
              className="mx-auto h-auto w-[220px] md:w-[360px]"
            />
          </div>

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-yellow-200 md:text-sm">
            Maricá • Lagoa de Araçatiba
          </p>

          <h1 className="max-w-4xl text-3xl font-extrabold leading-tight md:text-6xl">
            Hospede-se de frente para a lagoa
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90 md:mt-6 md:text-xl">
            Conforto, café da manhã incluso e localização privilegiada em uma
            das paisagens mais bonitas de Maricá.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
            <a
              href="#reservas"
              className="rounded-full bg-emerald-500 px-7 py-3 text-base font-bold text-white shadow-xl transition hover:bg-emerald-600 md:px-8 md:py-4"
            >
              Consultar disponibilidade
            </a>

            <a
              href="#acomodacoes"
              className="rounded-full border border-white/70 bg-white/10 px-7 py-3 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20 md:px-8 md:py-4"
            >
              Ver acomodações
            </a>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl">
            <img
              src="/digital/tamarindos/hero-pousada-2.jpg"
              alt="Fachada da Pousada Tamarindos"
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
              Pousada Tamarindos
            </p>

            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Tranquilidade, localização e acolhimento em Maricá
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Com localização privilegiada, de frente para o calçadão e a Lagoa
              de Araçatiba, a Pousada Tamarindos oferece um ambiente acolhedor
              para quem busca descanso, praticidade e contato com a natureza.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              A pousada conta com acomodações equipadas com ar-condicionado, TV
              e frigobar, além de café da manhã incluso nas diárias.
            </p>
          </div>
        </div>
      </section>

      {/* RESERVAS */}
      <section id="reservas" className="bg-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
              Reserve sua estadia
            </p>

            <h2 className="text-3xl font-extrabold md:text-5xl">
              Adicione as datas e consulte a disponibilidade
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Preencha os dados da pré-reserva e fale direto com a pousada pelo
              WhatsApp.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">
                    Check-in
                  </span>
                  <input
                    type="date"
                    name="checkin"
                    value={form.checkin}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-emerald-500"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold text-slate-700">
                    Check-out
                  </span>
                  <input
                    type="date"
                    name="checkout"
                    value={form.checkout}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-emerald-500"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold text-slate-700">
                    Hóspedes
                  </span>
                  <select
                    name="hospedes"
                    value={form.hospedes}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-emerald-500"
                  >
                    <option value="1">1 hóspede</option>
                    <option value="2">2 hóspedes</option>
                    <option value="3">3 hóspedes</option>
                    <option value="4">4 hóspedes</option>
                    <option value="5 ou mais">5 ou mais</option>
                  </select>
                </label>

                <label>
                  <span className="text-sm font-bold text-slate-700">
                    Acomodação
                  </span>
                  <select
                    name="acomodacao"
                    value={form.acomodacao}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-emerald-500"
                  >
                    <option>Solteiro</option>
                    <option>Casal</option>
                    <option>Duplo</option>
                    <option>Triplo</option>
                  </select>
                </label>

                <label className="md:col-span-2">
                  <span className="text-sm font-bold text-slate-700">
                    Nome
                  </span>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-emerald-500"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold text-slate-700">
                    WhatsApp
                  </span>
                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="(21) 99999-9999"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-emerald-500"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold text-slate-700">
                    E-mail opcional
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seuemail@email.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={enviarWhatsapp}
                className="mt-6 w-full rounded-full bg-emerald-500 px-8 py-4 text-base font-extrabold text-white shadow-xl transition hover:bg-emerald-600"
              >
                Consultar disponibilidade pelo WhatsApp
              </button>

              <p className="mt-4 text-center text-sm text-slate-500">
                Esta é uma pré-reserva. A confirmação será feita diretamente
                pela pousada.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#fbf7ef] p-6 shadow-xl md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
                Tarifas promocionais
              </p>

              <h3 className="mt-3 text-3xl font-extrabold">
                Valores das diárias
              </h3>

              <div className="mt-6 grid gap-4">
                {tarifas.map((item) => (
                  <div
                    key={item.tipo}
                    className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div>
                      <h4 className="text-lg font-extrabold">{item.tipo}</h4>
                      <p className="text-sm text-slate-500">{item.detalhe}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-extrabold text-emerald-700">
                        {item.valor}
                      </p>
                      <p className="text-xs text-slate-500">diária</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 text-sm leading-relaxed text-slate-700">
                <p>✓ Ar-condicionado, TV, frigobar e café da manhã incluso.</p>
                <p>✓ Check-in a partir das 14h e check-out até 12h.</p>
                <p>✓ Crianças até 5 anos não pagam dormindo na mesma cama.</p>
                <p>✓ Cama extra: R$ 110,00 por dia fora de temporada.</p>
                <p>✓ Não aceitamos animais.</p>
                <p>✓ Pagamento em espécie, Pix e cartões.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTRUTURA */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
            Estrutura
          </p>

          <h2 className="text-3xl font-extrabold md:text-5xl">
            Tudo para uma estadia confortável
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {estrutura.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#eee5d8] bg-white px-5 py-5 text-center shadow-sm"
              >
                <span className="text-base font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACOMODAÇÕES */}
      <section id="acomodacoes" className="bg-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
              Acomodações
            </p>

            <h2 className="text-3xl font-extrabold md:text-5xl">
              Quartos preparados para sua estadia
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {quartos.map((src, index) => (
              <div
                key={src}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                <img
                  src={src}
                  alt={`Quarto ${index + 1} da Pousada Tamarindos`}
                  className="h-56 w-full object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAGOA */}
      <section className="bg-[#f6f1e8] px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
              Lagoa de Araçatiba
            </p>

            <h2 className="text-3xl font-extrabold md:text-5xl">
              Uma paisagem especial bem em frente à pousada
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              A localização permite aproveitar o clima tranquilo da lagoa,
              caminhar pelo calçadão e estar perto de pontos importantes de
              Maricá.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl">
            <img
              src="/digital/tamarindos/lagoa-aracatiba.webp"
              alt="Lagoa de Araçatiba em Maricá"
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="bg-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
            Galeria
          </p>

          <h2 className="text-3xl font-extrabold md:text-5xl">
            Conheça um pouco mais da pousada
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galeria.map((src, index) => (
              <div key={src} className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={src}
                  alt={`Foto ${index + 1} da Pousada Tamarindos`}
                  className="h-64 w-full object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-emerald-700 px-5 py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold md:text-5xl">
          Pronto para reservar sua estadia?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
          Fale com a Pousada Tamarindos pelo WhatsApp e consulte a melhor opção
          para sua hospedagem.
        </p>

        <button
          type="button"
          onClick={enviarWhatsapp}
          className="mt-8 rounded-full bg-white px-8 py-4 font-extrabold text-emerald-700 shadow-xl transition hover:bg-emerald-50"
        >
          Consultar agora pelo WhatsApp
        </button>
      </section>
    </main>
  );
}
