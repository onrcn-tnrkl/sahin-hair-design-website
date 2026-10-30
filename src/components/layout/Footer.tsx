import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top"><div><Logo light /><p className="mt-5 max-w-xs text-sm leading-7 text-cream/65">{site.slogan}</p></div>
          <div><h2 className="footer-heading">Keşfet</h2><ul className="footer-links">{navigation.slice(1).map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></div>
          <div><h2 className="footer-heading">İletişim</h2><ul className="footer-links"><li><a href={site.phoneHref}>{site.phone}</a></li><li>{site.address}</li><li><a href={site.mapUrl} target="_blank" rel="noreferrer">Yol tarifi <ArrowUpRight size={14} /></a></li></ul></div>
          <div><h2 className="footer-heading">Çalışma saatleri</h2><ul className="footer-links">{site.hours.map((item) => <li key={item.day}><span>{item.day}</span><span>{item.time}</span></li>)}</ul></div>
        </div>
        <div className="footer-bottom"><span>© {site.copyrightYear} {site.name}. Tüm hakları saklıdır.</span><div className="flex gap-5">{site.social.map((item) => <a key={item.name} href={item.href} target="_blank" rel="noreferrer">{item.name}</a>)}</div></div>
      </Container>
    </footer>
  );
}
