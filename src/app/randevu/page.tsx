import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone } from "lucide-react";
import { site } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = { title: "Randevu", description: "Hizmetini seç, sana uygun randevu saatini ayırt." };

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Kendine zaman ayır"
        title="Randevunu planla."
        description="Hizmetini ve sana uygun zamanı seç; randevunu hemen oluştur."
      />
      <Container className="booking-layout grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.2fr_.8fr]">
        <div className="booking-panel">
          <Suspense fallback={<p className="text-sm text-muted">Randevu formu yükleniyor…</p>}>
            <BookingForm />
          </Suspense>
        </div>
        <aside className="booking-aside h-fit">
          <span className="eyebrow">Bize ulaşın</span>
          <p className="mt-4 text-sm leading-7 text-muted">
            Randevunu doğrudan konuşmayı tercih edersen, telefonla bize ulaşabilirsin.
          </p>
          <a href={site.phoneHref} className="mt-5 flex items-center gap-3 font-serif text-2xl">
            <Phone className="text-copper" size={18} />{site.phone}
          </a>
          <p className="mt-7 border-t border-line pt-5 text-xs leading-6 text-muted">
            Uygun saatler randevu sistemindeki güncel takvim bilgilerine göre gösterilir.
          </p>
        </aside>
      </Container>
    </>
  );
}
