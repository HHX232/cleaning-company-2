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
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-dark">
        {currentSrc ? (
          <img src={currentSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center text-[10px] text-white/40">
            нет фото
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="mb-1 text-sm font-semibold text-ink">{label}</div>
        <form
          action="/api/admin/images"
          method="post"
          encType="multipart/form-data"
          className="flex flex-wrap items-center gap-2"
        >
          <input type="hidden" name="key" value={imgKey} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          {targetTable && <input type="hidden" name="targetTable" value={targetTable} />}
          {targetId && <input type="hidden" name="targetId" value={targetId} />}
          {targetField && <input type="hidden" name="targetField" value={targetField} />}
          <input type="file" name="file" accept="image/*" required className="text-xs text-ink" />
          <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
            Загрузить
          </button>
        </form>
      </div>
    </div>
  );
}
