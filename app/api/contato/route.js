import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getClientIP(req) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

// Regras simples “anti-trote”
function spamHeuristics({ mensagem }) {
  const msg = String(mensagem || "").trim();

  // mínimo já é validado, mas reforça:
  if (msg.length < 10) return "mensagem_curta";

  // links demais costuma ser spam
  const links = (msg.match(/https?:\/\/|www\./gi) || []).length;
  if (links >= 3) return "links_demais";

  // repetição exagerada
  const repeated = /(.)\1{8,}/.test(msg); // 9+ vezes o mesmo caractere
  if (repeated) return "repeticao_exagerada";

  return "";
}

export async function POST(req) {
  const ip = getClientIP(req);
  const userAgent = req.headers.get("user-agent") || "";

  let payload = {};
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const {
    nome = "",
    email = "",
    telefone = "",
    assunto = "",
    mensagem = "",
    empresa = "", // honeypot
  } = payload || {};

  // Honeypot: se veio preenchido, é bot. Responde ok e loga como blocked.
  const honeypotHit = String(empresa).trim().length > 0;

  const safeNome = String(nome).trim();
  const safeEmail = String(email).trim().toLowerCase();
  const safeTelefone = String(telefone).trim();
  const safeAssunto = String(assunto).trim();
  const safeMensagem = String(mensagem).trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(safeEmail);
  const nomeOk = safeNome.length >= 2;
  const msgOk = safeMensagem.length >= 10;

  // Supabase (server) para log + rate limit
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase =
    supabaseUrl && serviceKey
      ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
      : null;

  async function log(status, reason = "") {
    if (!supabase) return;
    try {
      await supabase.from("contato_logs").insert({
        nome: safeNome || null,
        email: safeEmail || null,
        assunto: safeAssunto || null,
        mensagem: safeMensagem ? safeMensagem.slice(0, 5000) : null,
        ip,
        user_agent: userAgent,
        status,
        reason: reason || null,
      });
    } catch {
      // não derruba o envio por falha de log
    }
  }

  // Se honeypot pegou
  if (honeypotHit) {
    await log("blocked", "honeypot");
    return Response.json({ ok: true }, { status: 200 });
  }

  // Validações
  if (!nomeOk || !emailOk || !msgOk) {
    await log("blocked", "dados_invalidos");
    return Response.json(
      { ok: false, error: "Verifique nome, e-mail e mensagem (mínimo 10 caracteres)." },
      { status: 400 }
    );
  }

  // Heurísticas anti-spam
  const heuristic = spamHeuristics({ mensagem: safeMensagem });
  if (heuristic) {
    await log("blocked", heuristic);
    return Response.json(
      { ok: false, error: "Mensagem bloqueada pelos filtros de segurança." },
      { status: 429 }
    );
  }

  // Rate limit (por IP e por e-mail) — 3 envios a cada 10 minutos
  if (supabase) {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    try {
      const { count: countIp } = await supabase
        .from("contato_logs")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", since);

      const { count: countEmail } = await supabase
        .from("contato_logs")
        .select("id", { count: "exact", head: true })
        .eq("email", safeEmail)
        .gte("created_at", since);

      const total = (countIp || 0) + (countEmail || 0);

      if (total >= 3) {
        await log("blocked", "rate_limit_10min");
        return Response.json(
          { ok: false, error: "Muitas tentativas em pouco tempo. Tente novamente mais tarde." },
          { status: 429 }
        );
      }
    } catch {
      // Se falhar a contagem, segue (não derruba contato real)
    }
  }

  // SMTP Zoho
  const {
    ZOHO_SMTP_HOST,
    ZOHO_SMTP_PORT,
    ZOHO_SMTP_USER,
    ZOHO_SMTP_PASS,
    CONTATO_TO,
    CONTATO_CC,
  } = process.env;

  if (
    !ZOHO_SMTP_HOST ||
    !ZOHO_SMTP_PORT ||
    !ZOHO_SMTP_USER ||
    !ZOHO_SMTP_PASS ||
    !CONTATO_TO
  ) {
    await log("error", "smtp_nao_configurado");
    return Response.json(
      { ok: false, error: "Servidor de e-mail não configurado." },
      { status: 500 }
    );
  }

  const port = Number(ZOHO_SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: ZOHO_SMTP_USER, pass: ZOHO_SMTP_PASS },
  });

  const cc = (CONTATO_CC || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const subject = safeAssunto
    ? `[Classilagos] ${safeAssunto} — ${safeNome}`
    : `[Classilagos] Nova mensagem do Fale Conosco — ${safeNome}`;

  const text = `
NOVA MENSAGEM — FALE CONOSCO (Classilagos)

Nome: ${safeNome}
E-mail: ${safeEmail}
Telefone/WhatsApp: ${safeTelefone || "-"}
Assunto: ${safeAssunto || "-"}

Mensagem:
${safeMensagem}

---
Enviado via site Classilagos.
`.trim();

  const html = `
<div style="font-family:Arial,sans-serif;line-height:1.5">
  <h2 style="margin:0 0 8px">Nova mensagem — Fale Conosco</h2>
  <p style="margin:0 0 12px;color:#444">
    Você recebeu uma nova mensagem pelo site <strong>Classilagos</strong>.
  </p>

  <div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;background:#fafafa">
    <p style="margin:0 0 6px"><strong>Nome:</strong> ${escapeHtml(safeNome)}</p>
    <p style="margin:0 0 6px"><strong>E-mail:</strong> ${escapeHtml(safeEmail)}</p>
    <p style="margin:0 0 6px"><strong>Telefone/WhatsApp:</strong> ${escapeHtml(safeTelefone || "-")}</p>
    <p style="margin:0 0 10px"><strong>Assunto:</strong> ${escapeHtml(safeAssunto || "-")}</p>
    <p style="margin:0"><strong>Mensagem:</strong></p>
    <div style="white-space:pre-wrap;margin-top:6px">${escapeHtml(safeMensagem)}</div>
  </div>

  <p style="margin:14px 0 0;color:#6b7280;font-size:12px">
    Enviado via Classilagos.
  </p>
</div>
`.trim();

  // Log “received” antes de enviar (opcional, mas útil)
  await log("received", "");

  try {
    await transporter.sendMail({
      from: `"Classilagos — Fale Conosco" <${ZOHO_SMTP_USER}>`,
      to: CONTATO_TO,
      cc,
      subject,
      text,
      html,
      replyTo: safeEmail,
    });

    await log("sent", "");
    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    await log("error", "smtp_send_fail");
    return Response.json(
      { ok: false, error: "Erro ao enviar. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}
