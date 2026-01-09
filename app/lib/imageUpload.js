// app/lib/imageUpload.js
export const IMAGE_RULES = {
  maxFiles: 8,
  maxBytes: 2 * 1024 * 1024, // 2MB
  maxW: 1600,
  maxH: 1600,
  quality: 0.82,
  allowed: ["image/jpeg", "image/png", "image/webp"],
};

export function validateImageFile(file) {
  if (!IMAGE_RULES.allowed.includes(file.type)) {
    throw new Error("Envie JPG, PNG ou WebP.");
  }
  if (file.size > IMAGE_RULES.maxBytes) {
    throw new Error("Imagem muito grande. Limite: 2MB por foto.");
  }
}

async function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => reject(new Error("Falha ao ler a imagem."));
    img.src = url;
  });
}

export async function convertToWebp(file) {
  const img = await loadImageFromFile(file);

  const ratio = Math.min(
    IMAGE_RULES.maxW / img.width,
    IMAGE_RULES.maxH / img.height,
    1
  );

  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado.");

  ctx.drawImage(img, 0, 0, w, h);

  const webpBlob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/webp", IMAGE_RULES.quality);
  });

  // fallback se webp não rolar
  const finalBlob =
    webpBlob ||
    (await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/jpeg", IMAGE_RULES.quality);
    }));

  if (!finalBlob) throw new Error("Falha ao converter imagem.");

  const base = (file.name || "foto").replace(/\.[^/.]+$/, "");
  const safe = base.replace(/[^\w\-]+/g, "-").slice(0, 50);
  const ext = webpBlob ? "webp" : "jpg";

  return new File([finalBlob], `${safe}.${ext}`, {
    type: finalBlob.type,
    lastModified: Date.now(),
  });
}

/**
 * Processa + sobe no Storage e retorna URLs públicas
 * @param {object} supabase - client
 * @param {File[]} files - arquivos do input
 * @param {object} opts - { bucket, folder }
 */
export async function processAndUploadImages(supabase, files, opts = {}) {
  const bucket = opts.bucket || "anuncios";
  const folder = opts.folder || "temp";

  if (!Array.isArray(files) || files.length === 0) return [];
  if (files.length > IMAGE_RULES.maxFiles) {
    throw new Error(`Você pode enviar até ${IMAGE_RULES.maxFiles} fotos.`);
  }

  // 1) valida + converte
  const converted = [];
  for (const f of files) {
    validateImageFile(f);
    const out = await convertToWebp(f);
    converted.push(out);
  }

  // 2) upload
  const urls = [];
  for (let i = 0; i < converted.length; i++) {
    const file = converted[i];
    const path = `${folder}/${Date.now()}-${i}-${file.name}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
