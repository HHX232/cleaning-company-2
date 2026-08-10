import Link from "next/link";

type Crumb = { label: string; href?: string };

type BreadcrumbsProps = {
  items: Crumb[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className="mx-auto max-w-385 px-4 pt-4 text-xs text-muted sm:px-6 sm:pt-6 lg:px-10">
      {items.map((item, i) => (
        <span key={item.label}>
          {item.href ? (
            <Link href={item.href} className="transition-colors duration-150 hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-1.5">»</span>}
        </span>
      ))}
    </nav>
  );
}
