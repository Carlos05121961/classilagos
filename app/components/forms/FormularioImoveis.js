"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient"; // AJUSTADO PARA O SEU PROJETO

export default function FormularioImoveis() {
  const router = useRouter();

  // Estados
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [preco, setPreco] = useState("");

  // Fotos (4 URLs)
  const [foto1, setFoto1] = useState("");
  const [foto2, setFoto2] = useState("");
  const [foto3, setFoto3] = useState("");
  const [foto4, setFoto4] = useState("");

  // Contatos
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Lista fixa das cidades da Região dos Lagos
  const cidades = [
    "Maricá",
    "Saquarema",
    "Araruama",
    "Iguaba Grande",
    "São Pedro da Aldeia",
    "Arraial do Cabo",
    "Cabo Frio",
    "Búzios",
    "Rio das Ostras",
  ];

  // VERIFICAR LOGIN
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
    });
  }, []);

  // ENVIO DO ANÚNCIO
  const enviarAnuncio = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Verificar login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Você precisa estar logado para anunciar.");
      router.push("/login");
      return;
    }

    // Contato principal
    const contatoPrincipal = whatsapp || telefone || email;

    if (!contatoPrincipal) {
      setErro("Informe pelo menos um meio de contato (WhatsApp, telefone ou e-mail).");
      return;
    }

    // Montar array de imagens
    const imagens = [foto1, foto2, foto3, foto4].filter((f) => f !== "");

    // INSERIR NO SUPABASE
const { error } = await supabase.from("anuncios").insert({
  user_id: user.id,
  categoria: "imoveis",
  titulo,
  descricao,
  cidade,
  bairro,
  endereco,
  preco,
  imagens,
  telefone,
  whatsapp,
  email,
  contato: contatoPrincipal,
  tipo_imovel: "não informado",   // 👈 ESTE É O QUE FALTAVA
  status: "ativo",
  destaque: false,
});


    if (error) {
      console.log(error);
      setErro("Ocorreu um erro ao salvar o anúncio. Tente novamente.");
      return;
    }

    setSucesso("Anúncio enviado com sucesso!");
    setTimeout(() => {
      router.push("/imoveis");
    }, 1500);
  };

  return (
    <form onSubmit={enviarAnuncio} className="space-y-6">
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}

      {/* Título */}
      <div>
        <label className="block text-sm font-medium">Título do anúncio *</label>
        <input
          type="text"
          className="mt-1 w-full border rounded-md p-2"
          placeholder="Ex: Casa com 3 quartos em Itaipuaçu"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium">Descrição *</label>
        <textarea
          className="mt-1 w-full border rounded-md p-2 h-28"
          placeholder="Descreva os principais detalhes do imóvel..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>

      {/* Cidade */}
      <div>
        <label className="block text-sm font-medium">Cidade *</label>
        <select
          className="mt-1 w-full border rounded-md p-2"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {cidades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Bairro */}
      <div>
        <label className="block text-sm font-medium">Bairro / Região</label>
        <input
          type="text"
          className="mt-1 w-full border rounded-md p-2"
          placeholder="Ex: Centro, Itaipuaçu, Ponta Negra..."
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
        />
      </div>

      {/* Endereço */}
      <div>
        <label className="block text-sm font-medium">Endereço (opcional)</label>
        <input
          type="text"
          className="mt-1 w-full border rounded-md p-2"
          placeholder="Rua, número, complemento..."
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
      </div>

      {/* Preço */}
      <div>
        <label className="block text-sm font-medium">Preço (opcional)</label>
        <input
          type="text"
          className="mt-1 w-full border rounded-md p-2"
          placeholder="Ex: R$ 350.000"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
      </div>

      {/* Fotos */}
      <div>
        <label className="block text-sm font-medium">Fotos (URLs)</label>

        <input
          type="text"
          className="mt-2 w-full border rounded-md p-2"
          placeholder="URL da foto 1"
          value={foto1}
          onChange={(e) => setFoto1(e.target.value)}
        />

        <input
          type="text"
          className="mt-2 w-full border rounded-md p-2"
          placeholder="URL da foto 2"
          value={foto2}
          onChange={(e) => setFoto2(e.target.value)}
        />

        <input
          type="text"
          className="mt-2 w-full border rounded-md p-2"
          placeholder="URL da foto 3"
          value={foto3}
          onChange={(e) => setFoto3(e.target.value)}
        />

        <input
          type="text"
          className="mt-2 w-full border rounded-md p-2"
          placeholder="URL da foto 4"
          value={foto4}
          onChange={(e) => setFoto4(e.target.value)}
        />
      </div>

      {/* Contatos */}
      <div>
        <label className="block text-sm font-medium">Telefone</label>
        <input
          type="text"
          className="mt-1 w-full border rounded-md p-2"
          placeholder="Telefone para contato"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">WhatsApp</label>
        <input
          type="text"
          className="mt-1 w-full border rounded-md p-2"
          placeholder="DDD + número"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">E-mail</label>
        <input
          type="email"
          className="mt-1 w-full border rounded-md p-2"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white rounded-md py-3 font-medium hover:bg-blue-700 transition"
      >
        Enviar anúncio
      </button>
    </form>
  );
}
