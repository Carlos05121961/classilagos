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

  const [heroAtual, setHeroAtual] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setHeroAtual((prev) => (prev === 0 ? 1 : 0));
  }, 5000);

  return () => clearInterval(timer);
}, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function enviarWhatsapp() {
function formatarData(data) {
  if (!data) return "não informado";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

const mensagem = `Olá! Gostaria de consultar disponibilidade na Pousada Tamarindos.

Dados da pré-reserva:

📅 Check-in: ${formatarData(form.checkin)}
📅 Check-out: ${formatarData(form.checkout)}

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
    "Praias e lagoas",
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

  const experienciaTamarindos = [
  { icon: "🌅", titulo: "Vista privilegiada", texto: "De frente para a Lagoa de Araçatiba." },
  { icon: "☕", titulo: "Café da manhã incluso", texto: "Conforto para começar bem o dia." },
  { icon: "🛏️", titulo: "Quartos aconchegantes", texto: "Ambientes tranquilos e climatizados." },
  { icon: "🚴", titulo: "Orla e ciclovia", texto: "Perfeito para caminhar e aproveitar a região." },
  { icon: "📍", titulo: "Localização especial", texto: "Perto dos principais pontos de Araçatiba." },
];
  
  const fotosPousada = [
"/digital/tamarindos/recepcao.webp",
"/digital/tamarindos/area-cafe-01.webp",
"/digital/tamarindos/area-cafe-02.webp",
"/digital/tamarindos/galeria-13.webp",
"/digital/tamarindos/galeria-14.webp",
"/digital/tamarindos/galeria-15.webp",
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
    <section className="relative min-h-[52vh] overflow-hidden bg-black md:min-h-[60vh]">
        <img
        src={heroImages[heroAtual]}
          alt="Pousada Tamarindos em Maricá"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/38" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/60" />

       <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-6xl flex-col items-center justify-center px-5 py-10 text-center text-white md:min-h-[90vh]">
<div className="mb-3 md:mb-5">
  <img
    src="/digital/tamarindos/tamarindos-logo-premium.png"
    alt="Pousada Tamarindos Maricá"
   className="mx-auto mb-6 h-auto w-[210px] -translate-y-6 drop-shadow-[0_0_18px_rgba(255,255,255,0.45)] md:w-[360px]"
  />
</div>

<p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-yellow-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] md:text-sm">
  Maricá • Lagoa de Araçatiba
</p>

<h1 className="max-w-3xl text-2xl font-extrabold leading-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] md:text-4xl">
  Hospede-se de frente para a lagoa
</h1>

<p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] md:mt-5 md:text-xl">
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

{/* COMPARTILHAMENTO */}
<section className="bg-[#f6f1e8] px-5 py-6">
  <div className="mx-auto max-w-6xl text-center">

    <p
      className="mb-4 text-sm font-semibold text-emerald-800"
      style={{
        textShadow: "0 1px 4px rgba(0,0,0,0.18)",
      }}
    >
      Compartilhe a Pousada Tamarindos:
    </p>

    <div className="flex items-center justify-center gap-4 flex-wrap">

      {/* WHATSAPP */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          "https://classilagos.shop/digital/tamarindos"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg transition hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.77 11.77 0 0012.05 0C5.5 0 .18 5.32.18 11.87c0 2.09.55 4.14 1.6 5.94L0 24l6.36-1.67a11.8 11.8 0 005.69 1.45h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.15-3.41-8.43zM12.06 21.6a9.7 9.7 0 01-4.95-1.36l-.35-.21-3.78.99 1.01-3.68-.23-.38a9.69 9.69 0 01-1.5-5.09c0-5.37 4.37-9.74 9.75-9.74 2.6 0 5.05 1.01 6.89 2.85a9.68 9.68 0 012.85 6.89c0 5.38-4.37 9.75-9.69 9.75zm5.35-7.26c-.29-.14-1.72-.85-1.98-.95-.27-.1-.46-.14-.66.14-.19.29-.75.95-.92 1.14-.17.19-.33.22-.62.07-.29-.14-1.21-.45-2.3-1.44-.85-.76-1.42-1.7-1.58-1.99-.17-.29-.02-.44.12-.58.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.5h-.57c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.03 2.82 1.17 3.01c.14.19 2.01 3.07 4.87 4.3.68.29 1.22.46 1.63.58.68.22 1.3.19 1.79.12.55-.08 1.72-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z"/>
        </svg>
      </a>

      {/* FACEBOOK */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          "https://classilagos.shop/digital/tamarindos"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg transition hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.88 3.78-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12"/>
        </svg>
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

{/* EXPERIÊNCIA TAMARINDOS */}
<section className="bg-[#f5f1e8] px-5 py-16 md:px-10">
  <div className="mx-auto max-w-6xl">

    {/* TÍTULO */}
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.45em] text-emerald-700">
        Araçatiba • Maricá
      </p>

      <h2 className="text-3xl font-black text-slate-900 md:text-5xl">
        Descubra o charme da Lagoa de Araçatiba
      </h2>

      <div className="mx-auto mt-5 h-[2px] w-24 bg-emerald-600" />

      <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
        Hospede-se em uma das regiões mais bonitas de Maricá,
        com vista para a lagoa, conforto, tranquilidade e fácil
        acesso às praias e pontos turísticos da cidade.
      </p>
    </div>

    {/* CARDS */}
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">

      <div className="rounded-3xl bg-white p-6 text-center shadow-lg">
        <div className="mb-4 text-5xl">🌅</div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          Vista privilegiada
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          De frente para a Lagoa de Araçatiba.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 text-center shadow-lg">
        <div className="mb-4 text-5xl">☕</div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          Café da manhã incluso
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Mais conforto para começar bem o dia.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 text-center shadow-lg">
        <div className="mb-4 text-5xl">🛏️</div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          Quartos aconchegantes
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Ambientes tranquilos e climatizados.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 text-center shadow-lg">
        <div className="mb-4 text-5xl">🚴</div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          Orla e ciclovia
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Perfeito para caminhadas e lazer.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 text-center shadow-lg">
        <div className="mb-4 text-5xl">📍</div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          Localização especial
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Próxima ao centro e às praias de Maricá.
        </p>
      </div>

    </div>

    {/* MAPA */}
    <div className="mt-14 overflow-hidden rounded-[2rem] shadow-2xl">
      <iframe
        src="https://www.google.com/maps?q=Rua%20Alvares%20de%20Castro%201385%20Araçatiba%20Maricá%20RJ&output=embed"
        width="100%"
        height="420"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>

    {/* BOTÃO */}
    <div className="mt-12 text-center">
      <a
        href="#reservas"
        className="inline-flex rounded-full bg-emerald-600 px-10 py-5 text-lg font-bold text-white shadow-xl transition hover:scale-105 hover:bg-emerald-700"
      >
        Fazer consulta de hospedagem
      </a>
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
<section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 px-5 py-20 text-white">

  <div className="absolute inset-0 opacity-10">
    <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white blur-3xl" />
    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-300 blur-3xl" />
  </div>

  <div className="relative mx-auto max-w-5xl text-center">

    <p className="mb-4 text-xs font-bold uppercase tracking-[0.45em] text-emerald-200">
      Tamarindos Maricá
    </p>

    <h2 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
      Sua hospedagem de frente para a Lagoa de Araçatiba
    </h2>

    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-emerald-50/90 md:text-xl">
      Conforto, tranquilidade, café da manhã incluso e uma localização privilegiada em uma das paisagens mais bonitas de Maricá.
    </p>

    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

      <a
        href="#reservas"
        className="rounded-full bg-white px-10 py-5 text-lg font-bold text-emerald-800 shadow-2xl transition hover:scale-105 hover:bg-emerald-50"
      >
        Fazer consulta de hospedagem
      </a>

      <a
        href="#acomodacoes"
        className="rounded-full border border-white/50 px-10 py-5 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
      >
        Ver acomodações
      </a>

    </div>

    <div className="mt-14 border-t border-white/15 pt-8 text-sm text-emerald-100/80">

      <p>
        Rua Álvares de Castro, 1385 · Araçatiba · Maricá/RJ
      </p>

      <p className="mt-2">
        Produzido por Classilagos Digital
      </p>

    </div>

  </div>

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
