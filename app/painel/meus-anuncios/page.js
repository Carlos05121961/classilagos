"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabaseClient";
import AuthGuard from "../../components/AuthGuard";

export default function MeusAnunciosPage() {
  const [user, setUser] = useState(null);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro("");

      const { data, error: userError } = await supabase.auth.getUser();
      const u = data?.user || null;

      if (userError) {
        console.error(userError);
        setErro("Erro ao carregar dados do usuário.");
        setLoading(false);
        return;
      }

      if (!u) {
        setErro("Você precisa estar logado para ver seus anúncios.");
        setLoading(false);
        return;
      }

      setUser(u);

      const { data: lista, error: anunciosError } = await supabase
        .from("anuncios")
        .select("id, titulo, cidade, bairro, preco, categoria, tipo_imovel, created_at, imagens")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });

      if (anunciosError) {
        console.error(anunciosError);
        setErro("Erro ao buscar seus anúncios.");
        setAnuncios([]);
      } else {
        setAnuncios(lista || []);
      }

      setLoading(false);
    }

    carregar();
  }, []);

  async function handleDelete(id) {
    if (!user) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este anúncio? Essa ação não pode ser desfeita."
    );
    if (!confirmar) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("anuncios")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir anúncio: " + error.message);
    } else {
      setAnuncios((prev) => prev.filter((a) => a.id !== id));
    }

    setDeletingId(null);
  }

  const labelCategoria = (c) => {
    const v = (c || "").toString().toLowerCase();
    if (v === "imoveis") return "Imóveis";
    if (v === "veiculos") return "Veículos";
    if (v === "nautica") return "Náutica";
    if (v === "pets") return "Pets";
    if (v === "emprego") return "Empregos";
    if (v === "curriculo") return "Currículos";
    if (v === "servico") return "Serviços";
    if (v === "turismo") return "Turismo";
    if (v ===
