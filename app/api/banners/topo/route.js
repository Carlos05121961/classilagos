import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // evita cache chato em deploy

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "banners", "topo");

    // se a pasta não existir, retorna vazio
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
      .filter((f) => !f.startsWith(".")) // ignora .gitkeep etc
      .sort((a, b) => a.localeCompare(b, "pt-BR"));

    const images = files.map((f) => `/banners/topo/${f}`);

    return NextResponse.json({ images });
  } catch (e) {
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
