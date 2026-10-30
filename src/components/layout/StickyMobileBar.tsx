import Link from "next/link";
import { CalendarDays, Phone, MessageCircle } from "lucide-react";
import { site } from "@/config/site";

export function StickyMobileBar() {
  return <nav className="sticky-mobile-bar" aria-label="Hızlı iletişim"><a href={site.phoneHref}><Phone size={17} /><span>Ara</span></a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /><span>WhatsApp</span></a><Link href="/randevu"><CalendarDays size={17} /><span>Randevu Al</span></Link></nav>;
}
