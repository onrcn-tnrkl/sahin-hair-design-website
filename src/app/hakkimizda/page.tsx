import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Manifesto", description: "Özenli bakımın ve kişisel stilin buluştuğu yer." };

export default function AboutPage() {
  return <><PageHero eyebrow="Manifestomuz" title="Zanaate saygı, insana özen." description="Bizim için berberlik yalnızca bir hizmet değil; dinlemek, anlamak ve her misafire iyi hissettiren bir alan açmaktır." />
    <Container className="py-20 sm:py-28"><Reveal><div className="grid gap-14 lg:grid-cols-2 lg:items-center"><div><Eyebrow>Nasıl hissediyorsan, öyle ol</Eyebrow><h2 className="display-heading mt-5">Stilin, senin<br />hikâyen.</h2><p className="mt-7 max-w-xl text-sm leading-8 text-muted">Her yüzün, her saçın ve her günün ritmi farklı. Bu yüzden hazır kalıplar yerine, seni dinleyerek başlıyoruz. İhtiyacını anlıyor, birlikte karar veriyor ve kendini iyi hissettiğin bir sonuç için çalışıyoruz.</p><p className="mt-4 max-w-xl text-sm leading-8 text-muted">Zanaatin inceliğine, kullanılan her ürünün özenine ve sana ayrılan zamana inanıyoruz. Kapıdan çıktığında yalnızca daha iyi görünmeni değil, kendine daha iyi bakmış hissetmeni istiyoruz.</p><Button href="/hizmetler" className="mt-8">Hizmetleri keşfet <ArrowRight size={15} /></Button></div><div className="about-image"><Image src="/images/studio.svg" alt="Salon atmosferini anlatan sıcak tonlu görsel yer tutucusu" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><span className="image-caption">BİZİM İÇİN ÖZEN, BİR TAVIRDIR</span></div></div></Reveal></Container>
    <section className="manifesto-band"><Container><p>“Kendin olmanın en iyi hali, <em>kendine iyi bakmaktır.</em>”</p></Container></section>
    <Container className="py-20 text-center"><Eyebrow>Birlikte başlayalım</Eyebrow><h2 className="display-heading mx-auto mt-5 max-w-3xl">Güzel bir deneyim, küçük bir randevuyla başlar.</h2><Button href="/randevu" className="mt-8">Randevu al</Button></Container></>;
}
