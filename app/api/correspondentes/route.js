import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // nodemailer precisa de Node runtime
export const dynamic = "force-dynamic"; // evita cache em rota POST

function json(status, data) {
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

    // ✅ validação básica
    if (!nome || nome.length < 3) return json(400, { ok: false, error: "Informe seu nome." });
    if (!cidade) return json(400, { ok: false, error: "Informe sua cidade." });
    if (!whatsapp || whatsapp.length < 8) return json(400, { ok: false, error: "Informe seu WhatsApp." });
    if (!email || !email.includes("@")) return json(400, { ok: false, error: "Informe um e-mail válido." });
    if (!perfil || perfil.length < 10) return json(400, { ok: false, error: "Descreva seu perfil (mínimo 10 caracteres)." });

    // ✅ ENV do Zoho (server-only)
    const HOST = process.env.ZOHO_SMTP_HOST;
    const PORT = process.env.ZOHO_SMTP_PORT;
    const USER = process.env.ZOHO_SMTP_USER; // contato@classilagos.shop (mailbox real)
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
      // ✅ ajuda muito em Vercel + Zoho
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // ✅ entrega garantida (não depende de alias)
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

    return json(200, { ok: true, message: "Candidatura enviada com sucesso." });
  } catch (error) {
    console.error("ERRO CORRESPONDENTES:", error);
    return json(500, { ok: false, error: "Erro ao enviar candidatura." });
  }
}

