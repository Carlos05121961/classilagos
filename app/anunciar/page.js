"use client";

import Link from "next/link";
import Image from "next/image";

export default function AnunciarPage() {
  const secoes = [
    {
      slug: "imoveis",
      titulo: "Imóveis",
      texto: "Casas, apartamentos, terrenos e muito mais.",
    },
    {
      slug: "veiculos",
      titulo: "Veículos",
      texto: "Carros, motos, caminhões e utilitários.",
    },
    {
      slug: "nautica",
      titulo: "Náutica",
      texto: "Lanchas, barcos de passeio, jet skis...",
    },
    {
      slug: "pets",
      titulo: "Pets",
      texto: "Adoção, venda e serviços para animais.",
    },
    {
      slug: "empregos",
      titulo: "Empregos",
      texto: "Vagas de emprego em toda a região.",
    },
    {
      slug: "servicos",
      titulo: "Serviços",
      texto: "Prof
