"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";
import AuthGuard from "../../../components/AuthGuard";

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

export default function EditarAnuncioPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const [anuncio, setAnuncio] = useState(null);

  // Campos editáveis (universal)
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    cidade: "",
    bairro: "",
    endereco: "",
    preco: "",
    telefone: "",
    whatsapp: "",
    email: "",
    contato: "", // opcional
  });

  const anuncioIdStr = useMemo(() => (id ? String(id) : ""), [id]);

  useEffect(() => {
    async function boot() {
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
        .eq("id", anuncioIdStr)
        .eq("user_id", user.id) // segurança: só edita se for do dono
        .single();

      if (error || !data) {
        console.error(error);
        setErro("Não foi possível carregar este anúncio (ou ele não é seu).");
        setLoading(false);
        return;
      }

      setAnuncio(data);

      setForm({
        titulo: data.titulo || "",
        descricao: data.descricao || "",
        cidade: data.cidade || "",
        bairro: data.bairro || "",
        endereco: data.endereco || "",
        preco: data.preco || "",
        telefone: data.telefone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        contato: data.contato || "",
      });

      setLoading(false);
    }

    if (anuncioIdStr) boot();
  }, [anuncioIdStr]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user || !anuncioIdStr) return;

    setSaving(true);
    setErro("");

    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      cidade: form.cidade.trim(),
      bairro: form.bairro.trim() || null,
      endereco: form.endereco.trim() || null,
      preco: form.preco.trim() || null,
      telefone: form.telefone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      email: form.email.trim() || null,
      contato: form.contato.trim() || null,
      // updated_at (se existir na tabela, ok; se não existir, ignore)
      // updated_at: new Date().toISOString(),
    };

    if (!payload.titulo || !payload.descricao || !payload.cidade) {
      setErro("Preencha pelo menos: Título, Descrição e Cidade.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("anuncios")
      .update(payload)
      .eq("id", anuncioIdStr)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      setErro("Erro ao salvar. Tente novamente.");
      setSaving(false);
      return;
    }

    // volta pro painel (Premium)
    router.push("/painel/meus-anuncios");
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F5FBFF] px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <header className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Editar anúncio</h1>
              <p className="text-sm text-slate-600">
                Atualize as informações do seu anúncio (sem quebrar nenhum pilar).
              </p>
            </div>

            <Link
              href="/painel/meus-anuncios"
              className="hidden sm:inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voltar
            </Link>
          </header>

          {loading && <p className="text-sm text-slate-600">Carregando…</p>}

          {!loading && erro && (
            <div className="rounded-2xl border border-red-200 bg-white px-5 py-4">
              <p className="text-sm text-red-600">{erro}</p>
              <div className="mt-3">
                <Link
                  href="/painel/meus-anuncios"
                  className="inline-flex rounded-full bg-[#21D4FD] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
                >
                  Voltar ao painel
                </Link>
              </div>
            </div>
          )}

          {!loading && !erro && anuncio && (
            <form
              onSubmit={handleSave}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                  Categoria: {(anuncio.categoria || "anúncios").toString()}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                  ID: {anuncioIdStr}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Título *
                  </label>
                  <input
                    value={form.titulo}
                    onChange={(e) => setField("titulo", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder="Ex: Apartamento 2 quartos em Saquarema"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Descrição *
                  </label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) => setField("descricao", e.target.value)}
                    rows={6}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder="Descreva com detalhes…"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Cidade *
                    </label>
                    <select
                      value={form.cidade}
                      onChange={(e) => setField("cidade", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
                    >
                      <option value="">Selecione…</option>
                      {CIDADES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Bairro
                    </label>
                    <input
                      value={form.bairro}
                      onChange={(e) => setField("bairro", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Endereço
                  </label>
                  <input
                    value={form.endereco}
                    onChange={(e) => setField("endereco", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder="Opcional (pode ser aproximado)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Preço / Valor
                  </label>
                  <input
                    value={form.preco}
                    onChange={(e) => setField("preco", e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder="Ex: 2500, 120.000, 80 por dia…"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      WhatsApp
                    </label>
                    <input
                      value={form.whatsapp}
                      onChange={(e) => setField("whatsapp", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="Ex: (22) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Telefone
                    </label>
                    <input
                      value={form.telefone}
                      onChange={(e) => setField("telefone", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      E-mail
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700">
                      Contato (texto)
                    </label>
                    <input
                      value={form.contato}
                      onChange={(e) => setField("contato", e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Link
                  href={`/anuncios/${anuncioIdStr}`}
                  className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Ver anúncio
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center rounded-full bg-[#21D4FD] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3] disabled:opacity-60"
                >
                  {saving ? "Salvando…" : "Salvar alterações"}
                </button>
              </div>

              <p className="text-[10px] text-slate-400">
                Obs: fotos e campos avançados (ex: quartos, área, finalidade, etc.) a gente liga na próxima etapa.
              </p>
            </form>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
