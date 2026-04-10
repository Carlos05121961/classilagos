import { supabase } from "../app/supabaseClient";

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function normalizeWhatsapp(v) {
  let digits = onlyDigits(v);
  if (digits.length === 11) digits = "55" + digits;
  return digits;
}

export async function syncUserMetadataFromForm(user, dados = {}) {
  const metaAtual = user?.user_metadata || {};

  const nome = String(dados.nome || "").trim();
  const cidade = String(dados.cidade || "").trim();
  const whatsapp = normalizeWhatsapp(dados.whatsapp || "");
  const telefone = onlyDigits(dados.telefone || "");
  const endereco = String(dados.endereco || "").trim();
  const email = normalizeEmail(dados.email || user?.email || "");

  const payload = {
    ...metaAtual,

    nome: nome || metaAtual.nome || "",
    cidade: cidade || metaAtual.cidade || "",
    whatsapp: whatsapp || metaAtual.whatsapp || "",
    telefone: telefone || metaAtual.telefone || "",
    endereco: endereco || metaAtual.endereco || "",
    email: email || metaAtual.email || "",

    perfil_completo: Boolean(
      (nome || metaAtual.nome) &&
      (cidade || metaAtual.cidade) &&
      (whatsapp || metaAtual.whatsapp)
    ),

    origem_cadastro: dados.origem || metaAtual.origem_cadastro || "anuncio",
    ultimo_anuncio_em: new Date().toISOString(),
  };

  const { error } = await supabase.auth.updateUser({
    data: payload,
  });

  if (error) throw error;
}
