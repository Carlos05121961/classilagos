import { supabase } from "@/app/supabaseClient";

/**
 * Monta a query de busca para IMÓVEIS
 * @param {Object} parsed Resultado do parser
 */
export function buildQueryImoveis(parsed) {
  let query = supabase
    .from("anuncios")
    .select("*")
    .eq("status", "ativo")
    .eq("categoria", "imoveis");

  // 1️⃣ Finalidade (venda | aluguel | aluguel_temporada)
  if (parsed.finalidade) {
    query = query.eq("finalidade", parsed.finalidade);
  }

  // 2️⃣ Tipo de imóvel
  if (parsed.tipo_imovel) {
    query = query.eq("tipo_imovel", parsed.tipo_imovel);
  }

  // 3️⃣ Cidade
  if (parsed.cidade) {
    query = query.ilike("cidade", `%${parsed.cidade}%`);
  }

  // 4️⃣ Bairro
  if (parsed.bairro) {
    query = query.ilike("bairro", `%${parsed.bairro}%`);
  }

  // 5️⃣ Termos livres (texto)
  if (parsed.termosLivres && parsed.termosLivres.length > 0) {
    const orConditions = parsed.termosLivres
      .map(
        (termo) =>
          `titulo.ilike.%${termo}%,descricao.ilike.%${termo}%`
      )
      .join(",");

    query = query.or(orConditions);
  }

  return query;
}
