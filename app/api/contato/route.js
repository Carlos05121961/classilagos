import nodemailer from "nodemailer";

export const runtime = "nodejs"; // ✅ IMPORTANTÍSSIMO: nodemailer precisa de Node runtime
export const dynamic = "force-dynamic"; // evita cache em rota POST

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const nome = String(body?.nome || "").trim();
    const email = String(body?.email || "").trim();
    const assunto = String(body?.assunto || "").trim();
    const mensagem = String(body?.mensagem || "").trim();
    const empresa = String(body?.empresa || "").trim(); // honeypot

    // 🛑 Honeypot (bots)
    if (empresa) {
      return json(200, { ok: true });
    }

    // ✅ validação básica
    if (!nome || nome.length < 2) return json(400, { ok: false, error: "Informe seu nome." });
    if (!email || !email.includes("@")) return json(400, { ok: false, error: "Informe um e-mail válido." });
    if (!assunto || assunto.length < 3) return json(400, { ok: false, error: "Informe o assunto." });
    if (!mensagem || mensagem.length < 10) return json(400, { ok: false, error: "Escreva uma mensagem (mínimo 10 caracteres)." });

    // ✅ ENV do Zoho (server-only)
    const HOST = process.env.ZOHO_SMTP_HOST;
    const PORT = process.env.ZOHO_SMTP_PORT;
    const USER = process.env.ZOHO_SMTP_USER;
    const PASS = process.env.ZOHO_SMTP_PASS;

    const missing = [];
    if (!HOST) missing.push("ZOHO_SMTP_HOST");
    if (!PORT) missing.push("ZOHO_SMTP_PORT");
    if (!USER) missing.push("ZOHO_SMTP_USER");
    if (!PASS) missing.push("ZOHO_SMTP_PASS");

    if (missing.length) {
      return json(500, {
        ok: false,
        error: `Servidor de e-mail não configurado. Faltando: ${missing.join(", ")}`,
      });
    }

    const portNum = Number(PORT);
    const secure = portNum === 465; // 465 SSL, 587 STARTTLS

    const transporter = nodemailer.createTransport({
      host: HOST,
      port: portNum,
      secure,
      auth: { user: USER, pass: PASS },
    });

    // destinos (ajuste aqui se quiser)
    const TO = "fale-conosco@classilagos.shop";
    const CC = ["comercial@classilagos.shop", "imprensa@classilagos.shop"];

    const subject = `[Classilagos • Fale Conosco] ${assunto}`;

    const text = [
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Assunto: ${assunto}`,
      "",
      "Mensagem:",
      mensagem,
      "",
      `Enviado em: ${new Date().toISOString()}`,
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <h2 style="margin: 0 0 12px">Nova mensagem (Fale Conosco)</h2>
        <p><b>Nome:</b> ${escapeHtml(nome)}</p>
        <p><b>E-mail:</b> ${escapeHtml(email)}</p>
        <p><b>Assunto:</b> ${escapeHtml(assunto)}</p>
        <p><b>Mensagem:</b><br/>${escapeHtml(mensagem).replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p style="color:#666;font-size:12px">Classilagos • ${new Date().toLocaleString("pt-BR")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Classilagos" <${USER}>`, // geralmente precisa ser o mesmo USER do SMTP
      to: TO,
      cc: CC,
      replyTo: email, // ✅ responder vai direto pro visitante
      subject,
      text,
      html,
    });

    return json(200, { ok: true });
  } catch (err) {
    // log interno (Vercel logs)
    console.error("CONTATO_API_ERROR:", err);
    return json(500, {
      ok: false,
      error: "Falha ao enviar agora. Tente novamente em instantes.",
    });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
