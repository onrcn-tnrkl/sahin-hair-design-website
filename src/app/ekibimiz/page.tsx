import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { TeamCard } from "@/components/ui/TeamCard";
import { getActiveStaff } from "@/lib/booking-server";

export const metadata: Metadata = { title: "Ekibimiz", description: "Örnek Erkek Kuaförü ekibiyle tanışın." };

async function StaffList() {
  const staff = await getActiveStaff();

  return (
    <Container className="py-16 sm:py-24">
      {staff.length === 0 ? (
        <p className="text-sm text-muted">Şu anda listelenecek bir ekip üyesi bulunmuyor.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member, index) => (
            <TeamCard key={member.id} member={{ name: member.full_name }} index={index} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Ekibimiz"
        title="Her detayda özenli."
        titleClassName="team-page-title"
        description="Farklı uzmanlıkları, ortak bir yaklaşımda buluşturuyoruz: seni dinlemek ve kendine iyi hissettiren bir deneyim sunmak."
      />
      <Suspense
        fallback={
          <Container className="py-16 sm:py-24" aria-busy="true">
            <p className="text-sm text-muted" role="status">Ekibimiz yükleniyor...</p>
          </Container>
        }
      >
        <StaffList />
      </Suspense>
    </>
  );
}
