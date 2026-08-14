type ImagePlaceholderProps = {
  label: string;
  src?: string;
  className?: string;
  /** Set for the page's above-the-fold hero photo so it loads eagerly instead of lazily. */
  priority?: boolean;
};

// Stand-in for the design's drag-and-drop <image-slot>. Pass `src` to swap
// in a real photo later without touching layout.
export default function ImagePlaceholder({ label, src, className = "", priority = false }: ImagePlaceholderProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-dark to-primary-dark p-4 text-center text-xs font-semibold text-white/40 ${className}`}
    >
      {label}
    </div>
  );
}
