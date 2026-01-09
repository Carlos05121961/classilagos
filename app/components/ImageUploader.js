"use client";

import { useState } from "react";
import { processAndUploadImages, IMAGE_RULES } from "@/app/lib/imageUpload";

export default function ImageUploader({
  supabase,
  folder,
  value = [],          // array de urls já existentes
  onChange,            // (newUrls)=>void
  title = "Fotos",
}) {
  const [loading, setLoading] = useState(false);

  function move(arr, from, to) {
    const copy = [...arr];
    const item = copy.splice(from, 1)[0];
    copy.splice(to, 0, item);
    return copy;
  }

  async function handleSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const total = value.length + files.length;
    if (total > IMAGE_RULES.maxFiles) {
      alert(`Máximo de ${IMAGE_RULES.maxFiles} fotos por anúncio.`);
      e.target.value = "";
      return;
    }

    setLoading(true);
    try {
      const newUrls = await processAndUploadImages(supabase, files, {
        bucket: "anuncios",
        folder,
      });

      // junta mantendo ordem: existentes + novas
      onChange?.([...(value || []), ...newUrls]);
    } catch (err) {
      alert(err?.message || "Erro ao enviar imagens.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  function removeAt(idx) {
    const next = value.filter((_, i) => i !== idx);
    onChange?.(next);
  }

  function moveUp(idx) {
    if (idx === 0) return;
    onChange?.(move(value, idx, idx - 1));
  }

  function moveDown(idx) {
    if (idx === value.length - 1) return;
    onChange?.(move(value, idx, idx + 1));
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-slate-300">
            A 1ª foto é a capa. Até {IMAGE_RULES.maxFiles} fotos. Limite: 2MB.
          </div>
        </div>

        <label className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500">
          {loading ? "Enviando..." : "Adicionar fotos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleSelect}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>

      {value?.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div key={url + idx} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
              <div className="relative">
                <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-28 object-cover" />
                {idx === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
                    CAPA
                  </span>
                )}
              </div>

              <div className="p-2 flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                  >
                    ↓
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="rounded-lg border border-red-700 px-2 py-1 text-[11px] text-red-200 hover:bg-red-900/30"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
