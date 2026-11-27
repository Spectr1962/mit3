import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

export function Breadcrumbs({
  items,
  baseUrl = "https://mit3.ru",
}: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { label: "Главная", href: "/" },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => {
      const position = index + 1;
      const listItem: Record<string, unknown> = {
        "@type": "ListItem",
        position,
        name: item.label,
      };

      if (item.href) {
        listItem.item = `${baseUrl}${item.href}`;
      }

      return listItem;
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Хлебные крошки"
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;

          return (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-4 w-4 shrink-0" />}
              {isLast || !item.href ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
