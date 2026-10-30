import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ServiceRow } from "@/components/ui/ServiceRow";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? { title: service.title, description: service.promise } : {};
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  return <>
    <PageHero eyebrow={service.category} title={service.title} description={service.promise} />
    <Container className="py-16 sm:py-24"><div className="grid gap-14 lg:grid-cols-[1.2fr_.8fr]"><div><div className="detail-visual"><Image src="/images/studio.svg" alt={`${service.title} deneyimi için görsel yer tutucusu`} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /></div><Eyebrow><span className="mt-10 block">Hizmet hakkında</span></Eyebrow><h2 className="mt-4 font-serif text-4xl">Sana özel, özenle.</h2><p className="mt-5 max-w-2xl text-sm leading-8 text-muted">{service.details}</p><h3 className="mt-10 font-serif text-2xl">Neler dahil?</h3><ul className="mt-5 grid gap-4">{service.includes.map((item) => <li key={item} className="flex items-center gap-3 text-sm"><Check size={16} className="text-copper" />{item}</li>)}</ul></div><aside className="h-fit border border-line bg-cream p-7 sm:p-9"><Eyebrow>Başlangıç fiyatı</Eyebrow><p className="mt-3 font-serif text-5xl">₺{service.price.toLocaleString("tr-TR")}<span className="text-base text-muted">’den</span></p><p className="mt-4 text-xs leading-6 text-muted">Nihai ücret tercih ve ihtiyaca göre hizmet öncesinde netleştirilir.</p><Button href="/randevu" className="mt-7 w-full">Randevu al <ArrowRight size={14} /></Button><Link href="/hizmetler" className="mt-5 flex items-center justify-center gap-2 text-xs text-muted"><ArrowLeft size={13} /> Tüm hizmetler</Link></aside></div>
      <div className="mt-24"><Eyebrow>Diğer hizmetler</Eyebrow><h2 className="display-heading mt-4">Daha fazlasını keşfet.</h2><div className="mt-8">{related.map((item) => <ServiceRow key={item.slug} service={item} />)}</div></div>
    </Container>
  </>;
}
