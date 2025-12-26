"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";
import { supabase } from "../../../supabaseClient";

const CIDADES = [
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

function onlyDigits(v) {
  return (v || "").toString().replace(/\D/g, "");
}

export default function EditarAnuncioPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  // Form
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [preco, setPreco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Imagens (mantém o que já existe, e permite remover/adicionar por URL)
  const [imagens, setImagens] = useState([]);
  const [novaImagemUrl, setNovaImagemUrl] = useState("");

  const canSave = useMemo(() => {
    return (
      titulo.trim().length >= 3 &&
      descricao.trim().length >= 10 &&
      cidade.trim().length > 0
    );
  }, [titulo, descricao, cidade]);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        setErro("Erro ao carregar usuário.");
        setLoading(false);
        return;
      }
      if (!user) {
        setErro("Você precisa estar logado para editar anúncios.");
        setLoading(false);
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        setErro("Não foi possível carregar este anúncio.");
        setLoading(false);
        return;
      }

      // Segurança: só o dono edita
      if (data.user_id !== user.id) {
        setErro("Você não tem permissão para editar este anúncio.");
        setLoading(false);
        return;
      }

      setAnuncio(data);

      // Preenche form
      setTitulo(data.titulo || "");
      setDescricao(data.descricao || "");
      setCidade(data.cidade || "");
      setBairro(data.bairro || "");
      setPreco((data.preco ?? "").toString());
      setTelefone((data.telefone ?? "").toString());
      setWhatsapp((data.whatsapp ?? "").toString());
      setEmail((data.email ?? "").toString());
      setVideoUrl((data.video_url ?? "").toString());

      setImagens(Array.isArray(data.imagens) ? data.imagens.filter(Boolean) : []);

      setLoading(false);
    }

    if (id) carregar();
  }, [id]);

  function removerImagem(index) {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  }

  function adicionarImagemUrl() {
    const url = (novaImagemUrl || "").trim();
    if (!url) return;

    // Limite (padrão: até 8)
    setImagens((prev) => {
      const next = [...prev];
      if (next.length >= 8) return next;
      if (!next.includes(url)) next.push(url);
      return next;
    });

    setNovaImagemUrl("");
  }

  async function salvar() {
    if (!user || !anuncio) return;
    if (!canSave) {
      setErro("Revise: título, descrição e cidade são obrigatórios.");
      return;
    }

    setSaving(true);
    setErro("");

    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      cidade: cidade.trim(),
      bairro: bairro.trim() || null,
      preco: preco.toString().trim() || null,
      telefone: telefone.toString().trim() || null,
      whatsapp: whatsapp.toString().trim() || null,
      email: email.toString().trim() || null,
      video_url: videoUrl.toString().trim() || null,
      imagens: Array.isArray(imagens) ? imagens.slice(0, 8) : [],
      // Observação: NÃO mexemos em campos específicos (tipo_imovel, finalidade etc.) aqui.
      // Isso vem na fase 2 (editar avançado por categoria).
    };

    const { error } = await supabase
      .from("anuncios")
      .update(payload)
      .eq("id", anuncio.id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      setErro("Erro ao salvar: " + error.message);
      setSaving(false);
      return;
    }

    // Volta pro painel
    router.push("/painel/meus-anuncios");
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F5FBFF] px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Editar anúncio</h1>
              <p className="text-sm text-slate-600">
                Ajuste as informações principais do seu anúncio (modo Premium).
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/painel/meus-anuncios"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Voltar
              </Link>

              {anuncio?.id && (
                <Link
                  href={`/anuncios/${anuncio.id}`}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Ver anúncio
                </Link>
              )}
            </div>
          </header>

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600">
              Carregando anúncio…
            </div>
          )}

          {erro && !loading && (
            <div className="rounded-2xl border border-red-200 bg-white px-5 py-4 text-sm text-red-600">
              {erro}
            </div>
          )}

          {!loading && !erro && anuncio && (
            <div className="grid grid-cols-1 gap-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                    Categoria: {(anuncio.categoria || "anuncio").toString()}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ID #{anuncio.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Título
                    </label>
                    <input
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                      placeholder="Ex: Apartamento 2 quartos perto da praia"
                    />
                    <p className="text-[11px] text-slate-400">
                      Mínimo 3 caracteres.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Cidade
                    </label>
                    <select
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white"
                    >
                      <option value="">Selecione</option>
                      {CIDADES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Bairro (opcional)
                    </label>
                    <input
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                      placeholder="Ex: Centro"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Preço (opcional)
                    </label>
                    <input
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                      placeholder="Ex: 250.000 ou 1.200"
                    />
                    <p className="text-[11px] text-slate-400">
                      Você pode digitar com ou sem pontos.
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Descrição
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={6}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                    placeholder="Descreva detalhes importantes…"
                  />
                  <p className="text-[11px] text-slate-400">
                    Recomendado: pelo menos 10 caracteres.
                  </p>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Contatos do anúncio
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      WhatsApp (opcional)
                    </label>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                      placeholder="Ex: (22) 99999-9999"
                    />
                    <p className="text-[11px] text-slate-400">
                      Dígitos: {onlyDigits(whatsapp)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Telefone (opcional)
                    </label>
                    <input
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                      placeholder="Ex: (22) 3333-3333"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      E-mail (opcional)
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Vídeo (YouTube / opcional)
                  </label>
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Fotos do anúncio (até 8)
                </h2>

                {imagens.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {imagens.map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50"
                      >
                        <div className="h-28 w-full overflow-hidden bg-slate-100">
                          <img
                            src={url}
                            alt={`Foto ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <button
                            type="button"
                            onClick={() => removerImagem(idx)}
                            className="w-full rounded-full bg-red-500/90 px-3 py-2 text-[11px] font-semibold text-white hover:bg-red-600"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Este anúncio não tem fotos cadastradas.
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={novaImagemUrl}
                    onChange={(e) => setNovaImagemUrl(e.target.value)}
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                    placeholder="Cole aqui a URL de uma imagem (opcional)"
                  />
                  <button
                    type="button"
                    onClick={adicionarImagemUrl}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Adicionar
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Nesta fase (lançamento), o editor mantém as fotos existentes e permite remover/adicionar por URL.
                  Na fase 2, a gente conecta upload (Storage) aqui também.
                </p>
              </section>

              <section className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Salvar alterações
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Campos essenciais: título, cidade e descrição.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={salvar}
                    disabled={!canSave || saving}
                    className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {saving ? "Salvando…" : "Salvar"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

