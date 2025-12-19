import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function requireAdmin(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return { ok: false, status: 401, message: "Não autenticado." };

  // valida o token (client anon)
  const supaAnon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false },
  });

  const { data: userData, error: userErr } = await supaAnon.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, message: "Sessão inválida." };
  }

  const user = userData.user;

  // service role para ler profiles e atualizar agenda
  const supaAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  const { data: profile, error: profErr } = await supaAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profErr && profile?.role === "admin") {
    return { ok: true, user, supaAdmin };
  }

  return { ok: false, status: 403, message: "Acesso negado (não admin)." };
}

export async function GET(request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pendente";
  const cidade = searchParams.get("cidade") || "";
  const q = (searchParams.get("q") || "").trim();

  let query = guard.supaAdmin
    .from("agenda_eventos")
    .select(
      "id, titulo, cidade, local, data_evento, hora_inicio, hora_fim, descricao, imagem_url, link_ingressos, contato, status, destaque, created_at, user_id"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status);
  if (cidade) query = query.eq("cidade", cidade);

  if (q) {
    query = query.or(
      `titulo.ilike.%${q}%,local.ilike.%${q}%,descricao.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data || [] });
}

export async function PATCH(request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const body = await request.json().catch(() => ({}));
  const { id, status, destaque } = body || {};
  if (!id) return NextResponse.json({ error: "Faltou id." }, { status: 400 });

  const update = {};
  if (typeof status === "string") update.status = status; // pendente|publicado|recusado
  if (typeof destaque === "boolean") update.destaque = destaque;

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
  }

  const { data, error } = await guard.supaAdmin
    .from("agenda_eventos")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, item: data });
}

export async function DELETE(request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Faltou id." }, { status: 400 });

  const { error } = await guard.supaAdmin
    .from("agenda_eventos")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
