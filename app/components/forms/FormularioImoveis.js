"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

const cidadesRegiao = [
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

const tiposImovel = [
  "Casa",
  "Apartamento",
  "Cobertura",
  "Terreno / Lote",
  "Sala / Loja / Comercial",
  "Sítio / Chácara",
  "Outro",
];

const finalidades = ["Venda", "Aluguel", "Temporada", "Lançamento"];

export default function FormularioImoveis() {
  const router = useRouter();

  // dados principais
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [preco, setPreco] = useState("");
  const [tipoImovel, setTipoImovel] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [area, setArea] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [mobiliado, setMobiliado] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [aceitaFinanciamento, setAceitaFinanciamento] = useState("");

  // contato
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // fotos (upload)
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // feedback
  const [erro]()
