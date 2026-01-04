import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function j(status, data) {
  return NextResponse.json(data, { status });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const nome = String(body?.nome || "").trim();
    const cidade = String(body?.cidade || "").trim();
    const whatsapp = String(body?.whatsapp || "").trim();
    const email = String(body?.email || "").trim();
    const instagram = String(body?.instagram || "").trim();
    const perfil = String(body?.perfil || "").trim();
    const ideias = String(body?.ideias || "").trim();

    // 🔒 Validação básica
    if (!nome || !cidade || !whatsapp || !email || !perfil) {
      return j(400, { ok: false, error: "Dados obrigatórios não informados." });
    }
    if (!email.includes("@")) {
      return j(400, { ok: false, error: "Informe um e-mail válido." });
    }

    // ✅ ENV do Zoho
    const HOST = process.env.ZOHO_SMTP_HOST;
    const PORT = process.env.ZOHO_SMTP_PORT;
    const USER = process.env.ZOHO_SMTP_USER; // contato@classilagos.shop
    const PASS = process.env.ZOHO_SMTP_PASS;

    const missing = [];
    if (!HOST) missing.push("ZOHO_SMTP_HOST");
    if (!PORT) missing.push("ZOHO_SMTP_PORT");
    if (!USER) missing.push("ZOHO_SMTP_USER");
    if (!PASS) missing.push("ZOHO_SMTP_PASS");

    if (missing.length) {
      return j(500, { ok: false, error: `SMTP não configurado. Faltando: ${missing.join(", ")}` });
    }

    const portNum = Number(PORT);
    const secure = portNum === 465;

    const transporter = nodemailer.createTransport({
      host: HOST,
      port: portNum,
      secure,
      auth: { user: USER, pass: PASS },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // ✅ Entrega garantida: manda para o USER real
    const TO = USER;

    const subject = `[Classilagos • Correspondente] ${cidade} — ${nome}`;

    const textoEmail = `
CANDIDATURA – CORRESPONDENTE CULTURAL CLASSILAGOS

Nome: ${nome}
Cidade: ${cidade}
WhatsApp: ${whatsapp}
E-mail: ${email}
Instagram: ${instagram || "-"}

Perfil / Experiência:
${perfil}

Ideias de pautas:
${ideias || "-"}
`.trim();

    await transporter.sendMail({
      from: `"Classilagos" <${USER}>`,
      to: TO,
      replyTo: { name: nome, address: email },
      subject,
      text: textoEmail,
    });

    return j(200, { ok: true, message: "Candidatura enviada com sucesso." });
  } catch (error) {
    console.error("ERRO CORRESPONDENTES:", error);
    return j(500, { ok: false, error: "Erro ao enviar candidatura." });
  }
}

