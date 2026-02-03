"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePathname } from "next/navigation";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef(null);
  const pathname = usePathname();

  // ===============================
  // Helpers
  // ===============================
  async function fetchUnreadCount(uid) {
    if (!uid) {
      setUnreadCount(0);
      return;
    }

    const { count } = await supabase
      .from("notificacoes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid)
      .eq("lida", false);

    setUnreadCount(count || 0);
  }

  // ✅ cria/garante notificação de perfil incompleto (sem travar)
  async function ensureProfileIncompleteNotification(uid) {
    if (!uid) return;

    // 1) pega perfil (ajuste os campos conforme seu profiles real)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, nome, cidade, whatsapp") // <-- se seus campos tiverem outros nomes, me diga que eu ajusto
      .eq("id", uid)
      .single();

    const perfilIncompleto =
      !profile?.nome || !profile?.cidade || !profile?.whatsapp;

    if (!perfilIncompleto) {
      // se completou: marca como lida (se existir)
      await supabase
        .from("notificacoes")
        .update({ lida: true, lida_em: new Date().toISOString() })
        .eq("user_id", uid)
        .eq("tipo", "perfil_incompleto")
        .eq("lida", false);

      return;
    }

    // 2) evita duplicar: se já existe uma aberta, não cria outra
    const { data: existing } = await supabase
      .from("notificacoes")
      .select("id")
      .eq("user_id", uid)
      .eq("tipo", "perfil_incompleto")
      .eq("lida", false)
      .limit(1);

    if (existing && existing.length) return;

    // 3) cria a mensagem
    await supabase.from("notificacoes").insert({
      user_id: uid,
      tipo: "perfil_incompleto",
      titulo: "Complete seu perfil",
      mensagem:
        "Complete seu perfil para usar melhor o Classilagos (melhorar seus anúncios, facilitar contato e aparecer com mais destaque).",
      acao_label: "Completar agora",
      acao_url: "/perfil?next=/empregos",
      lida: false,
    });
  }

  // ===============================
  // 🔐 Carrega usuário + perfil + notificações
  // ===============================
  useEffect(() => {
    let ignore = false;
    let channel;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || ignore) {
        setUser(null);
        setIsAdmin(false);
        setUnreadCount(0);
        return;
      }

      setUser(user);

      // admin (seu projeto está usando is_admin aqui)
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      setIsAdmin(Boolean(profile?.is_admin));

      // notificações
      await ensureProfileIncompleteNotification(user.id);
      await fetchUnreadCount(user.id);

      // (opcional) realtime simples: atualiza badge quando mudar algo nas notificações do usuário
      try {
        channel?.unsubscribe?.();
        channel = supabase
          .channel(`notificacoes-${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notificacoes",
              filter: `user_id=eq.${user.id}`,
            },
            () => fetchUnreadCount(user.id)
          )
          .subscribe();
      } catch {
        // se realtime não estiver habilitado, tudo bem (badge atualiza no reload/login)
      }
    }

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      ignore = true;
      sub?.subscription?.unsubscribe?.();
      channel?.unsubscribe?.();
    };
  }, []);

  // ===============================
  // UX helpers
  // ===============================
  useEffect(() => {
    function onClickOutside(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onClickOutside);
    return () => document.removeEventListener("pointerdown", onClickOutside);
  }, []);

  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function sair() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const nome =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : "Minha conta");

  const itemClass =
    "block rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50";

  const badge = useMemo(() => {
    if (!unreadCount || unreadCount <= 0) return null;
    return (
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    );
  }, [unreadCount]);

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      {/* CTA MOBILE FIXO */}
      <Link
        href="/anunciar"
        className="md:hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-4 py-2 text-[12px] font-extrabold shadow-md"
      >
        📣 Anuncie grátis
      </Link>

      {/* 🔔 Mensagens / avisos */}
      {user && (
        <Link
          href="/mensagens"
          className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50"
          aria-label="Mensagens"
          title="Mensagens"
        >
          <span className="text-lg">🔔</span>
          {badge}
        </Link>
      )}

      {/* Botão usuário */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
      >
        <span className="hidden sm:inline max-w-[140px] truncate">{nome}</span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs">
          👤
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user ? nome : "Visitante"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user ? user.email : "Faça login para acessar"}
            </p>
          </div>

          <div className="p-2 text-sm">
            {user ? (
              <>
                <Link href="/mensagens" className={itemClass}>
                  Mensagens {unreadCount > 0 ? `(${unreadCount})` : ""}
                </Link>

                <Link href="/painel" className={itemClass}>
                  Meu painel
                </Link>

                <Link href="/painel/meus-anuncios" className={itemClass}>
                  Meus anúncios
                </Link>

                {/* 🔑 ADMIN */}
                {isAdmin && (
                  <>
                    <div className="my-1 h-px bg-slate-100" />
                    <Link
                      href="/admin"
                      className="block rounded-xl px-3 py-2 text-[13px] font-extrabold text-blue-700 hover:bg-blue-50"
                    >
                      Painel administrativo
                    </Link>
                  </>
                )}

                <div className="my-1 h-px bg-slate-100" />

                <Link href="/anunciar" className={itemClass}>
                  Anunciar grátis
                </Link>

                <button
                  onClick={sair}
                  className="w-full text-left rounded-xl px-3 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={itemClass}>
                  Entrar
                </Link>
                <Link href="/cadastro" className={itemClass}>
                  Cadastre-se grátis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

