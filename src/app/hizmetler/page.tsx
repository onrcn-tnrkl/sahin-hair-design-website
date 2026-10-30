import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { connection } from "next/server";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { getCatalog } from "@/lib/booking-server";
import { serviceSlug } from "@/lib/service-slug";

export const metadata: Metadata = { title: "Hizmetler", description: "Saç, sakal ve kişisel bakım hizmetlerini keşfedin." };

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

async function ServicesCatalog() {
  await connection();
  const categories = await getCatalog();

  return (
    <Container className="py-16 sm:py-24">
      {categories.length === 0 || categories.every(({ services }) => services.length === 0) ? (
        <p className="text-sm text-muted">Şu anda listelenecek bir hizmet bulunmuyor.</p>
      ) : (
        categories.map((category) => (
          category.services.length > 0 && (
            <section key={category.id} className="mb-14 last:mb-0">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="font-serif text-3xl">{category.name}</h2>
                <span className="text-xs text-muted">
                  {category.services.length} hizmet
                </span>
              </div>
              <div className="border-t border-line">
                {category.services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/randevu?service=${encodeURIComponent(serviceSlug(service.name))}`}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5 transition-colors hover:text-copper"
                  >
                    <span className="font-serif text-xl">{service.name}</span>
                    <span className="flex items-center gap-5">
                      <span className="text-sm">
                        {priceFormatter.format(service.base_price)}’den
                      </span>
                      <ArrowUpRight aria-hidden="true" size={19} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )
        ))
      )}
      <p className="mt-8 text-xs text-muted">
        Hizmet fiyatları başlangıç fiyatıdır; ihtiyaçlara göre değişiklik gösterebilir.
      </p>
    </Container>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hizmetlerimiz"
        title="Kendine iyi bakmanın her hali."
        description="İhtiyacına göre şekillenen, özenli ve kişisel bakım deneyimleri. Fiyatlar başlangıç fiyatıdır."
      />
      <Suspense
        fallback={
          <Container className="py-16 sm:py-24" aria-busy="true">
            <p className="text-sm text-muted" role="status">Hizmetler yükleniyor...</p>
          </Container>
        }
      >
        <ServicesCatalog />
      </Suspense>
    </>
  );
}
