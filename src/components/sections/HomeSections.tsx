import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, Clock3, Star, CalendarDays } from "lucide-react";
import { site } from "@/config/site";
import { services } from "@/data/services";
import { reviews } from "@/data/reviews";
import { articles } from "@/data/blog";
import { getActiveStaff } from "@/lib/booking-server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { ServiceRow } from "@/components/ui/ServiceRow";
import { TeamCard } from "@/components/ui/TeamCard";

type BusinessStats = { rating: number; reviewCount: number };

export function HomeHero({ rating, reviewCount }: BusinessStats) {
  return <section className="home-hero">
    <Image src="/images/hero.svg" alt="Sıcak tonlarda tasarlanmış örnek berber salonu görseli" fill priority sizes="100vw" className="object-cover" />
    <div className="home-hero-overlay" />
    <Container className="home-hero-content">
      <Eyebrow light>Özenli bakım. Kendine özgü stil.</Eyebrow>
      <h1>İyi görünmek,<br /><em>iyi hissetmekle</em> başlar.</h1>
      <p className="hero-slogan">{site.slogan}</p>
      <p className="hero-description">Kendine ayırdığın zamanı, kişisel stiline ve iyi hissetmene odaklanan sakin bir deneyime dönüştürüyoruz.</p>
      <p className="hero-meta"><span><Star size={13} fill="currentColor" /> Google puanı {rating.toLocaleString("tr-TR")} · {reviewCount.toLocaleString("tr-TR")} yorum</span><i /> <span><Clock3 size={13} /> Hafta içi {site.hours[0].time}</span></p>
      <div className="mt-8 flex flex-wrap gap-3"><Button href="/randevu" variant="copper"><CalendarDays size={15} /> Randevu Al</Button><Button href="/hizmetler" variant="outline">Hizmetleri Gör</Button></div>
      <div className="hero-quick-links"><a href={site.phoneHref}><span>Hemen ara</span><ArrowUpRight size={14} /></a><a href={site.mapUrl} target="_blank" rel="noreferrer"><span>Yol tarifi</span><ArrowUpRight size={14} /></a></div>
    </Container>
    <a className="scroll-cue" href="#istatistikler"><span>Kaydır</span><ArrowDown size={15} /></a>
  </section>;
}

export function StatsStrip({ rating, reviewCount }: BusinessStats) {
  const stats = [
    { label: "Google puanı", value: rating.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }), suffix: "" },
    { label: "Google yorumu", value: reviewCount.toLocaleString("tr-TR"), suffix: "" },
    { label: "Haftada açık", value: site.openDaysPerWeek.toLocaleString("tr-TR"), suffix: " gün" },
  ];
  return <section id="istatistikler" className="stats-strip"><div className="stats-grid">{stats.map((item) => <div key={item.label} className="stat-item"><strong>{item.value}{item.suffix}</strong><span>{item.label}</span></div>)}</div></section>;
}

export function AboutPreview() {
  return <Section className="bg-cream"><div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
    <div className="about-image"><Image src="/images/studio.svg" alt="Örnek kuaför salonu için sıcak tonlu iç mekân yer tutucu görseli" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><span className="image-caption">ÖZEN, HER DETAYDA</span></div>
    <div><Eyebrow>Hakkımızda</Eyebrow><h2 className="display-heading mt-5">Bir kesimden<br />fazlası.</h2><p className="mt-6 max-w-lg text-sm leading-8 text-muted">Bizce iyi bir berber deneyimi; aceleye gelmeyen bir sohbet, seni anlayan bir dokunuş ve kendine iyi geldiğini hissettiğin bir sonuçtur.</p><p className="mt-4 max-w-lg text-sm leading-8 text-muted">Klasik zanaate duyduğumuz saygıyı, bugünün kişisel bakım anlayışıyla buluşturuyor; her misafirimize kendine ait bir alan açıyoruz.</p><Button href="/hakkimizda" variant="dark" className="mt-8">Deneyimi keşfet <ArrowRight size={15} /></Button></div>
  </div></Section>;
}

export function ServicesPreview() {
  return <Section><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><Eyebrow>Hizmetlerimiz</Eyebrow><h2 className="display-heading mt-4">Bakımın sana<br />ait hali.</h2></div><Link href="/hizmetler" className="text-link">Tüm hizmetler <ArrowUpRight size={15} /></Link></div><div>{services.map((service) => <ServiceRow key={service.slug} service={service} />)}</div></Section>;
}

async function TeamCards() {
  const staff = await getActiveStaff();
  if (staff.length === 0) {
    return <p className="mt-8 text-sm text-muted">Şu anda listelenecek bir ekip üyesi bulunmuyor.</p>;
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
      {staff.map((member, index) => (
        <TeamCard key={member.id} member={{ name: member.full_name }} index={index} />
      ))}
    </div>
  );
}

export function TeamPreview() {
  return <Section className="bg-cream"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><Eyebrow>Tanışalım</Eyebrow><h2 className="display-heading mt-4">İyi hissettiren<br />ekip.</h2></div><Link href="/ekibimiz" className="text-link">Ekibimizi tanı <ArrowUpRight size={15} /></Link></div>
    <Suspense fallback={<p className="mt-10 text-sm text-muted" role="status">Ekibimiz yükleniyor...</p>}>
      <TeamCards />
    </Suspense>
  </Section>;
}

export function LocationSection() {
  return <Section className="bg-cream"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><Eyebrow>Bizi ziyaret et</Eyebrow><h2 className="display-heading mt-4">Kendine ayır<br />bir zaman.</h2><div className="mt-7 space-y-5"><p className="flex items-start gap-3 text-sm leading-7 text-muted"><MapPin className="mt-1 shrink-0 text-copper" size={18} />{site.address}</p><div className="flex items-start gap-3 text-sm leading-7 text-muted"><Clock3 className="mt-1 shrink-0 text-copper" size={18} /><div>{site.hours.map((item) => <p key={item.day} className="flex min-w-[240px] justify-between gap-8"><span>{item.day}</span><span>{item.time}</span></p>)}</div></div></div><p className="mt-5 text-xs italic text-muted">Yalnızca randevuyla hizmet veriyoruz.</p><Button href={site.mapUrl} variant="dark" className="mt-7" target="_blank" rel="noreferrer">Yol tarifi al <ArrowUpRight size={14} /></Button></div><div className="overflow-hidden border border-line bg-white"><iframe title="Şahin Hair Design konum haritası" src={site.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="map-frame" /><p className="border-t border-line px-4 py-3 text-xs text-muted">Şahin Hair Design · Aliağa, İzmir</p></div></div></Section>;
}

export function JournalPreview() {
  return <Section><div className="mb-10 flex items-end justify-between gap-4"><div><Eyebrow>Journal</Eyebrow><h2 className="display-heading mt-4">Stil üzerine<br />notlar.</h2></div><Link href="/journal" className="text-link">Tüm yazılar <ArrowUpRight size={15} /></Link></div><div className="grid gap-5 md:grid-cols-3">{articles.map((article) => <article key={article.slug} className="article-card"><Link href={`/journal/${article.slug}`}><div className="article-image"><Image src={article.image} alt={`${article.title} için editoryal görsel yer tutucusu`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" /></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[.15em] text-copper">{article.category} · {article.readingTime}</p><h3 className="mt-2 font-serif text-[25px] leading-tight">{article.title}</h3><span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">Yazıyı oku <ArrowRight size={13} /></span></Link></article>)}</div></Section>;
}

export function HomePage() {
  return <><HomeHero rating={site.rating} reviewCount={site.reviewCount} /><StatsStrip rating={site.rating} reviewCount={site.reviewCount} /><Marquee reviews={reviews} rating={site.rating} /><AboutPreview /><ServicesPreview /><TeamPreview /><LocationSection /><JournalPreview /><div className="home-cta"><Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><Eyebrow light>Bir sonraki iyi anın</Eyebrow><h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-cream sm:text-5xl">Kendine ayırdığın zamanı planla.</h2></div><Button href="/randevu" variant="light">Randevu al <ArrowRight size={15} /></Button></Container></div></>;
}
