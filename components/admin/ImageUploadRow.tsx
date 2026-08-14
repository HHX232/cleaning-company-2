"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ImageUploadRowProps = {
  imgKey: string;
  label: string;
  currentSrc?: string;
  redirectTo: string;
  targetTable?: "teamMember" | "servicePage" | "galleryItem";
  targetId?: string;
  targetField?: "photoUrl" | "heroImageUrl" | "consultationImageUrl" | "beforeUrl" | "afterUrl";
};

export default function ImageUploadRow({
  imgKey,
  label,
  currentSrc,
  redirectTo,
  targetTable,
  targetId,
  targetField,
}: ImageUploadRowProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentSrc);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || busy) return;

    const fd = new FormData();
    fd.set("key", imgKey);
    fd.set("redirectTo", redirectTo);
    if (targetTable) fd.set("targetTable", targetTable);
    if (targetId) fd.set("targetId", targetId);
    if (targetField) fd.set("targetField", targetField);
    fd.set("file", file);

    setBusy(true);
    const toastId = toast.loading("Загружаем фото…");
    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        headers: { "x-ajax-upload": "1" },
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text().catch(() => ""));
      // Instant local preview, then refresh server data in the background —
      // no navigation, no back-button dance.
      setPreview(URL.createObjectURL(file));
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Фото загружено", { id: toastId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Не удалось загрузить фото", { id: toastId });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-dark">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center text-[10px] text-white/40">
            нет фото
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="mb-1 text-sm font-semibold text-ink">{label}</div>
        <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" name="file" accept="image/*" required className="text-xs text-ink" />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Загрузка…" : "Загрузить"}
          </button>
        </form>
      </div>
    </div>
  );
}
