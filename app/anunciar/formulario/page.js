"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";
import AuthGuard from "../../components/AuthGuard";

// Página principal: só cuida do Suspense
export default function FormularioPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-4 py-8">
            <p className="text-sm text-slate-600">
              Carregando formulário de anúncio...
            </p>
          </div>
        }
      >
        <FormularioAnuncio />
      </Suspense>
    </AuthGuard>
  );
}

// Componente que realmente usa useSearchParams e os outros hooks
function FormularioAnuncio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaFromUrl = searchParams.get("tipo") || "geral";

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [contato, setContato] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    // Garante que o usuário está logado
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const user = session.user;

    // Salva no Supabase (tabela anuncios)
    const { error: insertError } = await supabase.from("anuncios").insert({
      user_id: user.id,
      cate
