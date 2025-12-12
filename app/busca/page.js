// /app/busca/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";

export default function BuscaPage() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Pega os parâmetros da busca
  const query = router.query;

  useEffect(() => {
    if (!query) return;

    const buscarAnuncios = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .ilike("titulo", `%${query.texto}%`)  // busca texto
        .eq("cidade", query.cidade)  // cidade
        .eq("categoria", query.categoria)  // categoria
        .limit(10);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setResultados(data);
      setLoading(false);
    };

    buscarAnuncios();
  }, [query]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>Resultados da Busca</h1>
      <div>
        {resultados.map((item) => (
          <div key={item.id}>
            <h2>{item.titulo}</h2>
            <p>{item.descricao}</p>
            <p>Cidade: {item.cidade}</p>
            <p>Categoria: {item.categoria}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
