// lib/busca/buscarImoveisSupabase.js
import { interpretarBuscaImoveis } from "./interpretarImoveis";

// Ajuda: transforma termos livres num texto único
function termosParaWebsearch(termosLivres = []) {
  // Ex: ["vista","mar"] -> "vista mar"
  return termosLivres.join(" ").trim();
}

export async function buscarImoveisSupabase({
  supabase,
  textoBusca = "",
  limit = 24,
}) {
  const parsed = interpretarBuscaImoveis(textoBusca);

  // 1) Query base (sempre imóveis + ativos)
  let query = supabase
    .from("anuncios")
    .select("*")
    .eq("categoria", "imoveis")
    .eq("status", "ativo");

  // 2) Filtros estruturados (exatos do seu banco)
  if (parsed.tipo_imovel) query = query.eq("tipo_imovel", parsed.tipo_imovel);
  if (parsed.finalidade) query = query.eq("finalidade", parsed.finalidade);
  if (parsed.cidade) query = query.eq("cidade", parsed.cidade);

  if (parsed.quartos) query = query.eq("quartos", parsed.quartos);
  if (parsed.vagas) query = query.eq("vagas", parsed.vagas);

  // 3) Se sobrou termos livres: usa FULL TEXT SEARCH no search_tsv (você já tem índice GIN!)
  const websearch = termosParaWebsearch(parsed.termosLivres);
  if (websearch) {
    query = query.textSearch("search_tsv", websearch, {
      type: "websearch",
      config: "portuguese",
    });
  }

  // 4) Ordenação padrão Classilagos
  query = query
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data, error } = await query;

  // 5) Fallback inteligente:
  // Se veio vazio e o usuário digitou algo, relaxa os filtros e tenta só FTS (sem tipo/finalidade/cidade)
  if ((!data || data.length === 0) && textoBusca.trim()) {
    const parsed2 = interpretarBuscaImoveis(textoBusca);
    const websearch2 = termosParaWebsearch([
      ...(parsed2.termosLivres || []),
      // se a interpretação pegou tipo/finalidade/cidade, também joga como texto no fallback
      ...(parsed2.tipo_imovel ? [parsed2.tipo_imovel] : []),
      ...(parsed2.finalidade ? [parsed2.finalidade] : []),
      ...(parsed2.cidade ? [parsed2.cidade] : []),
    ].map((x) => String(x)));

    let fallback = supabase
      .from("anuncios")
      .select("*")
      .eq("categoria", "imoveis")
      .eq("status", "ativo");

    if (websearch2.trim()) {
      fallback = fallback.textSearch("search_tsv", websearch2, {
        type: "websearch",
        config: "portuguese",
      });
    }

    fallback = fallback
      .order("destaque", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    const { data: data2, error: error2 } = await fallback;

    return {
      ok: !error2,
      error: error2 || error || null,
      parsed,
      modo: "fallback",
      anuncios: data2 || [],
    };
  }

  return {
    ok: !error,
    error: error || null,
    parsed,
    modo: "normal",
    anuncios: data || [],
  };
}
