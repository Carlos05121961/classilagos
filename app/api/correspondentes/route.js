import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      nome,
      cidade,
      whatsapp,
      email,
      instagram,
      perfil,
      ideias,
    } = body;

    if (!nome || !cidade || !whatsapp || !email || !perfil) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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
      from: `"Classilagos" <${process.env.SMTP_USER}>`,
      to: "correspondentes@classilagos.shop",
      replyTo: email,
      subject: `Candidatura Correspondente Cultural — ${cidade} — ${nome}`,
      text: textoEmail,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO CORRESPONDENTES:", error);
    return NextResponse.json(
      { error: "Erro ao enviar candidatura." },
      { status: 500 }
    );
  }
}
