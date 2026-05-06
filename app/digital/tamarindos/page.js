"use client";

import { useEffect, useState } from "react";

export default function TamarindosPage() {
  const WHATSAPP_NUMBER = "552126371983";

  const [showMarica, setShowMarica] = useState(false);

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

Check-in: ${form.checkin || "não informado"}
Check-out: ${form.checkout || "não informado"}
Hóspedes: ${form.hospedes}
Acomodação: ${form.acomodacao}
Nome: ${form.nome || "não informado"}
WhatsApp: ${form.whatsapp || "não informado"}
E-mail: ${form.email || "não informado"}`;

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(link, "_blank");
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
    "/digital/tamarindos/quarto-05.webp",
    "/digital/tamarindos/quarto-06.webp",
    "/digital/tamarindos/quarto-07.webp",
  ];

  const fotosPousada = [
    "/digital/tamarindos/galeria-01.webp",
    "/digital/tamarindos/galeria-02.webp",
    "/digital/tamarindos/galeria-04.webp",
    "/digital/tamarindos/recepcao.webp",
    "/digital/tamarindos/area-cafe-01.webp",
    "/digital/tamarindos/area-cafe-02.webp",
  ];

  const maricaFotos = [
    "/digital/tamarindos/hero-lagoa.webp",
    "/digital/tamarindos/lagoa-aracatiba.webp",
    "/digital/tamarindos/galeria-01.webp",
    "/digital/tamarindos/galeria-02.webp",
    "/digital/tamarindos/galeria-03.webp",
    "/digital/tamarindos/galeria-04.webp",
    "/digital/tamarindos/galeria-05.webp",
    "/digital/tamarindos/galeria-06.webp",
    "/digital/tamarindos/galeria-07.webp",
    "/digital/tamarindos/galeria-08.webp",
    "/digital/tamarindos/galeria-09.webp",
    "/digital/tamarindos/galeria-10.webp",
    "/digital/tamarindos/galeria-11.webp",
  ];

  const heroImages = [
  "/digital/tamarindos/hero-lagoa.webp",
  "/digital/tamarindos/hero-pousada.webp",
];
  
  return (
    <main className="bg-[#f6f1e8] text-slate-950">
      {/* HERO */}
      <section className="relative min-h-[82vh] overflow-hidden bg-black md:min-h-[90vh]">
        <img
        src="/digital/tamarindos/hero-lagoa.webp"
          alt="Pousada Tamarindos em Maricá"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/38" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/60" />

        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-6xl flex-col items-center justify-center px-5 py-10 text-center text-white md:min-h-[90vh]">
<div className="mb-4 rounded-2xl bg-white/95 px-5 py-3 shadow-xl md:mb-6 md:rounded-3xl md:px-9 md:py-5">
  <img
    src="/digital/tamarindos/tamarindos-logo.webp"
    alt="Pousada Tamarindos Maricá"
    className="mx-auto h-auto w-[175px] md:w-[320px]"
  />
</div>

          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-yellow-200 md:text-sm">
            Maricá • Lagoa de Araçatiba
          </p>

          <h1 className="max-w-4xl text-3xl font-extrabold leading-tight md:text-6xl">
            Hospede-se de frente para a lagoa
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:mt-5 md:text-xl">
            Conforto, café da manhã incluso e localização privilegiada em uma
            das paisagens mais bonitas de Maricá.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-7">
            <a
              href="#reservas"
              className="rounded-full bg-emerald-500 px-7 py-3 text-base font-bold text-white shadow-xl transition hover:bg-emerald-600"
            >
              Consultar disponibilidade
            </a>

            <a
              href="#acomodacoes"
              className="rounded-full border border-white/70 bg-white/10 px-7 py-3 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20"
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

      {/* RESERVAS COMPACTA */}
      <section id="reservas" className="bg-white px-5 py-14 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
              Reserve sua estadia
            </p>

            <h2 className="text-3xl font-extrabold md:text-5xl">
              Consulte sua hospedagem
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Preencha os dados e envie direto para o WhatsApp da pousada.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-xl md:p-6">
              <div className="grid gap-3 md:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">
                    Check-in
                  </span>
                  <input
                    type="date"
                    name="checkin"
                    value={form.checkin}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={enviarWhatsapp}
                className="mt-5 w-full rounded-full bg-emerald-500 px-7 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-600"
              >
                Consultar disponibilidade pelo WhatsApp
              </button>

              <p className="mt-3 text-center text-sm text-slate-500">
                Pré-reserva. A confirmação será feita pela pousada.
              </p>
            </div>

            <div className="rounded-[1.7rem] bg-[#fbf7ef] p-5 shadow-xl md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
                Tarifas promocionais
              </p>

              <h3 className="mt-2 text-2xl font-extrabold">
                Valores das diárias
              </h3>

              <div className="mt-5 grid gap-3">
                {tarifas.map((item) => (
                  <div
                    key={item.tipo}
                    className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <div>
                      <h4 className="text-base font-extrabold">{item.tipo}</h4>
                      <p className="text-sm text-slate-500">{item.detalhe}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-extrabold text-emerald-700">
                        {item.valor}
                      </p>
                      <p className="text-xs text-slate-500">diária</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-4 text-sm leading-relaxed text-slate-700">
                <p>✓ Café da manhã incluso.</p>
                <p>✓ Ar-condicionado, TV e frigobar.</p>
                <p>✓ Check-in 14h • Check-out 12h.</p>
                <p>✓ Crianças até 5 anos não pagam.</p>
                <p>✓ Não aceitamos animais.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTRUTURA */}
      <section className="px-5 py-14 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
                Estrutura
              </p>

              <h2 className="text-3xl font-extrabold md:text-5xl">
                Tudo para uma estadia confortável
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                Uma estrutura acolhedora para quem deseja descansar, aproveitar
                Maricá e se sentir bem recebido.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {estrutura.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#eee5d8] bg-white px-4 py-4 text-center shadow-sm"
                >
                  <span className="text-sm font-bold md:text-base">{item}</span>
                </div>
              ))}
            </div>
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

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quartos.map((src, index) => (
              <div
                key={src}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                <img
                  src={src}
                  alt={`Quarto ${index + 1} da Pousada Tamarindos`}
                  className="h-64 w-full object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA DA POUSADA */}
      <section className="bg-[#f6f1e8] px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-emerald-700">
            Pousada
          </p>

          <h2 className="text-3xl font-extrabold md:text-5xl">
            Conheça um pouco mais da pousada
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fotosPousada.map((src, index) => (
              <div key={src} className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={src}
                  alt={`Foto ${index + 1} da Pousada Tamarindos`}
                  className="h-64 w-full object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowMarica(true)}
            className="mt-10 rounded-full border border-emerald-700 px-8 py-3 font-bold text-emerald-700 transition hover:bg-emerald-700 hover:text-white"
          >
            Conheça Maricá
          </button>
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

      {/* MODAL CONHEÇA MARICÁ */}
      {showMarica && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-emerald-700">
                  Conheça Maricá
                </p>

                <h3 className="text-2xl font-extrabold md:text-4xl">
                  Cartões postais perto da Pousada Tamarindos
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowMarica(false)}
                className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700 hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {maricaFotos.map((src, index) => (
                <div key={src} className="overflow-hidden rounded-3xl shadow-md">
                  <img
                    src={src}
                    alt={`Cartão postal de Maricá ${index + 1}`}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
