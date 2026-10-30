import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/data/services";

export function ServiceRow({ service, showPrice = true }: { service: Service; showPrice?: boolean }) {
  return (
    <Link href={`/hizmetler/${service.slug}`} className="service-row group">
      <span className="service-index">{String(service.category).slice(0, 1)}</span>
      <span className="min-w-0 flex-1"><span className="service-name">{service.title}</span><span className="service-promise">{service.promise}</span></span>
      {showPrice && <span className="service-price">₺{service.price.toLocaleString("tr-TR")}<small>’den başlayan</small></span>}
      <ArrowUpRight aria-hidden="true" className="service-arrow" size={21} />
    </Link>
  );
}
