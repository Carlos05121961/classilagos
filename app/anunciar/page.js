"use client";

import Link from "next/link";

const categorias = [
  {
    slug: "imoveis",
    label: "Imóveis",
    descricao: "Casas, apartamentos, terrenos, salas comerciais...",
  },
  {
    slug: "veiculos",
    label: "Veículos",
    descricao: "Carros, motos, caminhões, utilitários...",
  },
  {
    slug: "nautica",
    label: "Náutica",
    descricao: "Lanchas, barcos, jet ski, passeios náuticos...",
  },
  {
    slug: "pets",
    label: "Pets",
    descricao: "Pet shops, veterinários, banho & tosa, adoção...",
  },
  {
    slug: "empregos",
    label: "Empregos",
    descricao: "Vagas de trabalho, estágios, freelas...",
  },
  {
    slug: "servicos",
    label: "Serviços",
    descricao: "Eletricista, diarista, reformas, autônomos...",
  },
  {
    slug: "turismo",
    label: "Turismo",
    descricao: "Pousadas, hotéis, passeios, bares e restaurantes...",
  },
  {
    slug: "lagolistas",
    label: "LagoListas",
    descricao: "Guia comercial completo da Região dos Lagos.",
  },
];

export default function AnunciarEscolherPage() {
  return (
    <main className="min-h-screen bg-slate-50">
