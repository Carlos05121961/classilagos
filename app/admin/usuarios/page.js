"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import Link from "next/link";

function formatarData(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [buscaTexto, setBuscaTexto] = useState("");

  // 🔹 Carregar anúncios e montar a lista de usuários
  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, user_id, created_at, nome_contato, email, telefone, whatsapp, categoria"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar usuários / anúncios:", error);
        setErro("Erro ao carregar dados. Tente novamente mais tarde.");
        setCarregando(false);
        return;
      }

      const mapa = new Map();

      (data || []).forEach((anuncio) => {
        const uid = anuncio.user_id || "sem_usuario"; // só por segurança

        const contatoNome =
          anuncio.nome_contato && anuncio.nome_contato.trim().length > 0
            ? anuncio.nome_contato
            : "—";

        const contatoTel =
          anuncio.telefone || anuncio.whatsapp || anuncio.email || "—";

        if (!mapa.has(uid)) {
          mapa.set(uid, {
            user_id: uid,
            nome: contatoNome,
            email: anuncio.email || "",
            telefoneOuWhats: contatoTel,
            primeiroAnuncioEm: anuncio.created_at,
            ultimoAnuncioEm: anuncio.created_at,
            totalAnuncios: 0,
            categoriasSet: new Set(),
          });
        }

        const u = mapa.get(uid);
        u.totalAnuncios += 1;
        u.categoriasSet.add(anuncio.categoria || "—");

        if (anuncio.created_at < u.primeiroAnuncioEm) {
          u.primeiroAnuncioEm = anuncio.created_at;
        }
        if (anuncio.created_at > u.ultimoAnuncioEm) {
          u.ultimoAnuncioEm = anuncio.created_at;
        }
      });

      const lista = Array.from(mapa.values()).map((u) => ({
        ...u,
        categorias: Array.from(u.categoriasSet),
      }));

      setUsuarios(lista);
      setCarregando(false);
    }

    carregar();
  }, []);

  // 🔍 Filtro de busca por nome / email / telefone
  const usuariosFiltrados = useMemo(() => {
    if (!buscaTexto) return usuarios;

    const termo = buscaTexto.trim().toLowerCase();
    return usuarios.filter((u) => {
      const blob = `${u.nome} ${u.email} ${u.telefoneOuWhats}`.toLowerCase();
      return blob.includes(termo);
    });
  }, [usuarios, buscaTexto]);

  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          Administração • Classilagos
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Usuários cadastrados
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Visão geral das pessoas que já publicaram anúncios na plataforma.
        </p>
      </div>

      {/* Filtro de busca */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-600">
            Buscar por nome, e-mail ou telefone
          </label>
          <input
            type="text"
            placeholder="Ex.: Carlos, anadia, (21) 9..."
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/60"
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
          />
        </div>

        <div className="text-right text-xs text-slate-500 mt-2 md:mt-0">
          {carregando ? (
            <span>Carregando usuários…</span>
          ) : (
            <span>
              Mostrando{" "}
              <span className="font-semibold text-slate-800">
                {usuariosFiltrados.length}
              </span>{" "}
              de {usuarios.length} usuários
            </span>
          )}
        </div>
      </div>

      {/* Erro */}
      {erro && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Tabela (desktop) */}
      <div className="hidden md:block rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs text-slate-500">
              <th className="py-2 pl-4 pr-2 text-left">Usuário / Contato</th>
              <th className="px-2 text-left">Anúncios</th>
              <th className="px-2 text-left">Categorias</th>
              <th className="px-2 text-left">Primeiro anúncio</th>
              <th className="px-2 text-left">Último anúncio</th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  Carregando usuários…
                </td>
              </tr>
            )}

            {!carregando && usuariosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  Nenhum usuário encontrado com o filtro atual.
                </td>
              </tr>
            )}

            {usuariosFiltrados.map((u) => (
              <tr
                key={u.user_id}
                className="border-b border-slate-100 hover:bg-slate-50/80"
              >
                <td className="py-3 pl-4 pr-2 align-top text-xs text-slate-700">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      {u.nome || "—"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {u.telefoneOuWhats}
                    </span>
                    {u.email && (
                      <span className="text-[11px] text-slate-500">
                        {u.email}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-2 py-3 align-top text-xs text-slate-700">
                  <span className="font-semibold">{u.totalAnuncios}</span>
                </td>

                <td className="px-2 py-3 align-top text-xs text-slate-700">
                  {u.categorias.join(", ")}
                </td>

                <td className="px-2 py-3 align-top text-xs text-slate-700">
                  {formatarData(u.primeiroAnuncioEm)}
                </td>

                <td className="px-2 py-3 align-top text-xs text-slate-700">
                  {formatarData(u.ultimoAnuncioEm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista em cards (mobile) */}
      <div className="md:hidden divide-y divide-slate-100 rounded-2xl bg-white border border-slate-200 overflow-hidden">
        {carregando && (
          <div className="py-6 text-center text-sm text-slate-500">
            Carregando usuários…
          </div>
        )}

        {!carregando && usuariosFiltrados.length === 0 && (
          <div className="py-6 text-center text-sm text-slate-500">
            Nenhum usuário encontrado com o filtro atual.
          </div>
        )}

        {usuariosFiltrados.map((u) => (
          <div key={u.user_id} className="p-3 space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              {u.nome || "—"}
            </p>
            <p className="text-[11px] text-slate-500">{u.telefoneOuWhats}</p>
            {u.email && (
              <p className="text-[11px] text-slate-500">{u.email}</p>
            )}

            <p className="text-[11px] text-slate-500">
              Anúncios:{" "}
              <span className="font-semibold text-slate-800">
                {u.totalAnuncios}
              </span>
            </p>

            <p className="text-[11px] text-slate-500">
              Categorias: {u.categorias.join(", ")}
            </p>

            <p className="text-[10px] text-slate-400">
              Primeiro: {formatarData(u.primeiroAnuncioEm)} • Último:{" "}
              {formatarData(u.ultimoAnuncioEm)}
            </p>
          </div>
        ))}
      </div>

      {/* Rodapézinho explicativo */}
      <div className="text-[11px] text-slate-500">
        * Esta tela usa apenas os dados dos anúncios (nome de contato, telefone,
        e-mail). No futuro podemos integrar diretamente com a lista oficial de
        usuários do Supabase Auth.
      </div>
    </div>
  );
}
