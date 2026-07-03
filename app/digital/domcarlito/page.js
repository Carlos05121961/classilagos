"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const WHATSAPP_PEDIDOS = "5521990581668";
const PIX_CHAVE = "21967463576";

const bairrosAtendidos = ["Jacaroá", "Caju", "Araçatiba", "Centro", "Flamengo"];

const produtos = [
  {
    id: "kids",
    nome: "Dom Carlito Kids",
    imagem: "/digital/domcarlito/domcarlito-burguer.webp",
    descricao: "Pão Brioche 50g, hambúrguer artesanal 90g e queijo.",
    preco: 14.9,
  },
  {
    id: "burger",
    nome: "Dom Carlito Burger",
    imagem: "/digital/domcarlito/domcarlito-burguer.webp",
    descricao: "Pão Brioche 60g, hambúrguer artesanal 130g, queijo e cebola.",
    preco: 19.9,
  },
  {
    id: "salada",
    nome: "Dom Carlito Salada",
    imagem: "/digital/domcarlito/domcarlito-classico.webp",
    descricao:
      "Pão Brioche 60g, hambúrguer artesanal 130g, queijo, alface, tomate e cebola.",
    preco: 23.9,
  },
  {
    id: "bacon",
    nome: "Dom Carlito Bacon",
    imagem: "/digital/domcarlito/domcarlito-bacon.webp",
    descricao:
      "Pão Brioche 60g, hambúrguer artesanal 130g, queijo, bacon crocante e cebola.",
    preco: 24.9,
  },
  {
    id: "pimenta",
    nome: "Dom Carlito Pimenta",
    imagem: "/digital/domcarlito/domcarlito-pimenta.webp",
    descricao:
      "Pão Brioche Pimenta Vermelha 60g, hambúrguer artesanal 130g, queijo, alface, tomate e cebola.",
    preco: 24.9,
  },
  {
    id: "bbq",
    nome: "Dom Carlito BBQ",
    imagem: "/digital/domcarlito/domcarlito-pimenta.webp",
    descricao:
      "Pão Brioche Pimenta Vermelha 60g, hambúrguer artesanal defumado 130g, queijo, cebola e Molho Artesanal Dom Carlito.",
    preco: 25.9,
  },
  {
    id: "smoke",
    nome: "Dom Carlito Smoke",
    imagem: "/digital/domcarlito/domcarlito-classico.webp",
    descricao:
      "Pão Prime GB 60g, hambúrguer artesanal 130g, queijo, alface, tomate, cebola e Molho Artesanal Dom Carlito.",
    preco: 25.9,
  },
  {
    id: "duplo",
    nome: "Dom Carlito Duplo",
    imagem: "/digital/domcarlito/domcarlito-duplo.webp",
    descricao:
      "Pão Prime GB 60g, dois hambúrgueres artesanais 130g, queijo duplo e cebola.",
    preco: 32.9,
  },
];

const bebidas = [
  {
    id: "agua",
    nome: "Água Mineral",
    imagem: "/digital/domcarlito/coca-cola-200.webp",
    descricao: "Água mineral gelada.",
    preco: 3,
  },
  {
    id: "coca200",
    nome: "Coca-Cola 200ml",
    imagem: "/digital/domcarlito/coca-cola-200.webp",
    descricao: "Coca-Cola garrafinha 200ml gelada.",
    preco: 5,
  },
  {
    id: "coca350",
    nome: "Coca-Cola Lata 350ml",
    imagem: "/digital/domcarlito/coca-cola-350.webp",
    descricao: "Coca-Cola lata 350ml gelada.",
    preco: 8,
  },
];

function moeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function DomcarlitoPage() {
  const todosItens = [...produtos, ...bebidas];

  const [quantidades, setQuantidades] = useState({});
  const [recebimento, setRecebimento] = useState("entrega");

  const [nomeCliente, setNomeCliente] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [pagamento, setPagamento] = useState("pix");
  const [troco, setTroco] = useState("nao");
  const [trocoPara, setTrocoPara] = useState("");

  function alterarQuantidade(id, valor) {
    setQuantidades((atual) => {
      const novaQtd = Math.max(0, (atual[id] || 0) + valor);
      return { ...atual, [id]: novaQtd };
    });
  }

  const itensPedido = useMemo(() => {
    return todosItens
      .map((item) => ({
        ...item,
        quantidade: quantidades[item.id] || 0,
      }))
      .filter((item) => item.quantidade > 0);
  }, [quantidades]);

  const total = useMemo(() => {
    return itensPedido.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    );
  }, [itensPedido]);

  async function copiarPix() {
    await navigator.clipboard.writeText(PIX_CHAVE);
    alert("Chave PIX copiada!");
  }

  function enviarWhatsApp() {
    if (itensPedido.length === 0) {
      alert("Escolha pelo menos um item antes de finalizar.");
      return;
    }

    if (nomeCliente.trim() === "") {
      alert("Informe seu nome.");
      return;
    }

    if (recebimento === "entrega") {
      if (rua.trim() === "" || numero.trim() === "" || bairro.trim() === "") {
        alert("Informe rua, número e bairro para entrega.");
        return;
      }
    }

    if (pagamento === "dinheiro" && troco === "sim" && trocoPara.trim() === "") {
      alert("Informe para quanto precisa de troco.");
      return;
    }

    const lista = itensPedido
      .map(
        (item) =>
          `• ${item.quantidade}x ${item.nome} — ${moeda(
            item.preco * item.quantidade
          )}`
      )
      .join("\n");

    const dadosEntrega =
      recebimento === "entrega"
        ? `🚚 ENTREGA
Rua: ${rua}
Número: ${numero}
Bairro: ${bairro}
Complemento: ${complemento || "Não informado"}
Ponto de referência: ${referencia || "Não informado"}`
        : "🏠 RETIRADA NO LOCAL";

    const dadosPagamento =
      pagamento === "pix"
        ? `PIX - pagamento antecipado
Chave PIX: ${PIX_CHAVE}
Após realizar o PIX, enviarei o comprovante por aqui.`
        : `Dinheiro na entrega
Troco: ${troco === "sim" ? `Sim, para R$ ${trocoPara}` : "Não precisa"}`;

    const mensagem = `🍔 NOVO PEDIDO - DOM CARLITO

Cliente: ${nomeCliente}

${dadosEntrega}

-------------------------
PEDIDO

${lista}

-------------------------
TOTAL: ${moeda(total)}

-------------------------
PAGAMENTO:
${dadosPagamento}

-------------------------
OBSERVAÇÕES:
${observacoes || "Nenhuma observação."}`;

    const url = `https://wa.me/${WHATSAPP_PEDIDOS}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 py-10 text-center">
        <Image
          src="/digital/domcarlito/grelha.jpeg"
          alt="Dom Carlito na grelha"
          fill
          priority
          className="object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <Image
            src="/digital/domcarlito/domcarlitologo.webp"
            alt="Logo Dom Carlito"
            width={420}
            height={420}
            priority
            className="mx-auto w-full max-w-[260px] md:max-w-[310px]"
          />

          <p className="mt-4 text-sm uppercase tracking-[0.45em] text-yellow-500">
            Smoke Burgers
          </p>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Hambúrgueres Artesanais Dom Carlito
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Preparados na hora, com ingredientes selecionados e uma identidade
            de sabor própria.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#cardapio"
              className="rounded-full bg-yellow-500 px-8 py-4 font-bold text-black transition hover:bg-yellow-400"
            >
              Ver cardápio
            </a>

            <a
              href="#pedido"
              className="rounded-full border border-yellow-500 px-8 py-4 font-bold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
            >
              Finalizar pedido
            </a>
          </div>
        </div>
      </section>

      <section id="cardapio" className="bg-black px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm uppercase tracking-[0.35em] text-yellow-500">
            Cardápio
          </p>

          <h2 className="mt-4 text-center text-3xl font-black md:text-5xl">
            A Linha Dom Carlito
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <CardItem
                key={produto.id}
                item={produto}
                quantidade={quantidades[produto.id] || 0}
                alterarQuantidade={alterarQuantidade}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm uppercase tracking-[0.35em] text-yellow-500">
            Bebidas
          </p>

          <h2 className="mt-4 text-center text-3xl font-black md:text-5xl">
            Acompanhe seu pedido
          </h2>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {bebidas.map((bebida) => (
              <CardItem
                key={bebida.id}
                item={bebida}
                quantidade={quantidades[bebida.id] || 0}
                alterarQuantidade={alterarQuantidade}
                pequeno
              />
            ))}
          </div>
        </div>
      </section>

      <section id="pedido" className="bg-black px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-yellow-600/30 bg-zinc-950 p-6 shadow-2xl md:p-8">
          <h2 className="text-center text-3xl font-black text-yellow-500">
            Resumo do Pedido
          </h2>

          {itensPedido.length === 0 ? (
            <p className="mt-6 text-center text-zinc-400">
              Escolha seus hambúrgueres e bebidas no cardápio acima.
            </p>
          ) : (
            <div className="mt-8 space-y-3">
              {itensPedido.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-zinc-800 pb-3 text-sm md:text-base"
                >
                  <span>
                    {item.quantidade}x {item.nome}
                  </span>
                  <strong>{moeda(item.preco * item.quantidade)}</strong>
                </div>
              ))}

              <div className="flex justify-between pt-4 text-2xl font-black">
                <span>Total</span>
                <span className="text-yellow-500">{moeda(total)}</span>
              </div>
            </div>
          )}

          <div className="mt-8">
            <label className="mb-2 block font-bold text-yellow-500">
              Seu nome
            </label>
            <input
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full rounded-2xl border border-zinc-700 bg-black p-4 text-white outline-none focus:border-yellow-500"
            />
          </div>

          <div className="mt-8">
            <p className="mb-3 font-bold text-yellow-500">
              Forma de recebimento
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                onClick={() => setRecebimento("entrega")}
                className={`rounded-2xl border p-4 font-bold ${
                  recebimento === "entrega"
                    ? "border-yellow-500 bg-yellow-500 text-black"
                    : "border-zinc-700 text-white"
                }`}
              >
                Entrega
              </button>

              <button
                onClick={() => setRecebimento("retirada")}
                className={`rounded-2xl border p-4 font-bold ${
                  recebimento === "retirada"
                    ? "border-yellow-500 bg-yellow-500 text-black"
                    : "border-zinc-700 text-white"
                }`}
              >
                Retirada no local
              </button>
            </div>
          </div>

          {recebimento === "entrega" && (
            <div className="mt-8 rounded-3xl border border-zinc-800 bg-black p-5">
              <h3 className="text-xl font-black text-yellow-500">
                Endereço de entrega
              </h3>

              <p className="mt-3 text-sm text-zinc-400">
                Atendemos inicialmente: Jacaroá, Caju, Araçatiba, Centro e
                Flamengo.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Rua"
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-yellow-500"
                />

                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Número"
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-yellow-500"
                />

                <select
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-yellow-500"
                >
                  <option value="">Selecione o bairro</option>
                  {bairrosAtendidos.map((bairroItem) => (
                    <option key={bairroItem} value={bairroItem}>
                      {bairroItem}
                    </option>
                  ))}
                </select>

                <input
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Complemento"
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-yellow-500"
                />

                <input
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ponto de referência"
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-yellow-500 md:col-span-2"
                />
              </div>
            </div>
          )}

          <div className="mt-8">
            <label className="mb-2 block font-bold text-yellow-500">
              Observações do pedido
            </label>

            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Exemplo: sem cebola, sem tomate, molho separado..."
              className="min-h-24 w-full rounded-2xl border border-zinc-700 bg-black p-4 text-white outline-none focus:border-yellow-500"
            />
          </div>

          <div className="mt-8 rounded-3xl border border-yellow-600/30 bg-black p-6">
            <h3 className="text-center text-2xl font-black text-yellow-500">
              Pagamento
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-400">
              Recomendamos o pagamento via PIX. É rápido, seguro e agiliza a
              confirmação e a preparação do seu pedido.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <button
                onClick={() => setPagamento("pix")}
                className={`rounded-2xl border p-4 font-bold ${
                  pagamento === "pix"
                    ? "border-yellow-500 bg-yellow-500 text-black"
                    : "border-zinc-700 text-white"
                }`}
              >
                PIX recomendado
              </button>

              <button
                onClick={() => setPagamento("dinheiro")}
                className={`rounded-2xl border p-4 font-bold ${
                  pagamento === "dinheiro"
                    ? "border-yellow-500 bg-yellow-500 text-black"
                    : "border-zinc-700 text-white"
                }`}
              >
                Dinheiro
              </button>
            </div>

            {pagamento === "pix" && (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                  Chave PIX Mercado Pago
                </p>

                <p className="mt-3 text-2xl font-black text-yellow-500">
                  21 96746-3576
                </p>

                <button
                  onClick={copiarPix}
                  className="mt-5 rounded-full border border-yellow-500 px-6 py-3 font-bold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
                >
                  Copiar chave PIX
                </button>

                <p className="mt-4 text-sm text-zinc-400">
                  Após realizar o pagamento, envie o comprovante pelo WhatsApp.
                </p>
              </div>
            )}

            {pagamento === "dinheiro" && (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="font-bold text-yellow-500">
                  Vai precisar de troco?
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <button
                    onClick={() => setTroco("nao")}
                    className={`rounded-2xl border p-4 font-bold ${
                      troco === "nao"
                        ? "border-yellow-500 bg-yellow-500 text-black"
                        : "border-zinc-700 text-white"
                    }`}
                  >
                    Não
                  </button>

                  <button
                    onClick={() => setTroco("sim")}
                    className={`rounded-2xl border p-4 font-bold ${
                      troco === "sim"
                        ? "border-yellow-500 bg-yellow-500 text-black"
                        : "border-zinc-700 text-white"
                    }`}
                  >
                    Sim
                  </button>
                </div>

                {troco === "sim" && (
                  <input
                    value={trocoPara}
                    onChange={(e) => setTrocoPara(e.target.value)}
                    placeholder="Troco para quanto? Ex: 100,00"
                    className="mt-4 w-full rounded-2xl border border-zinc-700 bg-black p-4 text-white outline-none focus:border-yellow-500"
                  />
                )}
              </div>
            )}
          </div>

          <button
            onClick={enviarWhatsApp}
            className="mt-8 w-full rounded-full bg-yellow-500 px-8 py-4 text-lg font-black text-black transition hover:bg-yellow-400"
          >
            Finalizar pedido pelo WhatsApp
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Seu pedido será enviado para o WhatsApp Business oficial do Dom
            Carlito.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-black px-6 py-8 text-center text-sm text-zinc-500">
        Dom Carlito Smoke Burgers • Maricá/RJ • WhatsApp: (21) 99058-1668
      </footer>
    </main>
  );
}

function CardItem({ item, quantidade, alterarQuantidade, pequeno = false }) {
  return (
    <div className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center transition hover:border-yellow-600/70 hover:shadow-2xl">
      <div
        className={`flex items-center justify-center ${
          pequeno ? "h-40" : "h-56"
        }`}
      >
        <Image
          src={item.imagem}
          alt={item.nome}
          width={420}
          height={320}
          className={`w-full object-contain transition duration-300 group-hover:scale-105 ${
            pequeno ? "max-h-36" : "max-h-52"
          }`}
        />
      </div>

      <h3 className="mt-5 text-2xl font-black text-yellow-500">{item.nome}</h3>

      {item.descricao && (
        <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-zinc-300">
          {item.descricao}
        </p>
      )}

      <p className="mt-5 text-3xl font-black text-white">
        {moeda(item.preco)}
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => alterarQuantidade(item.id, -1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-xl font-black"
        >
          -
        </button>

        <span className="min-w-8 text-2xl font-black">{quantidade}</span>

        <button
          onClick={() => alterarQuantidade(item.id, 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-xl font-black text-black"
        >
          +
        </button>
      </div>
    </div>
  );
}
