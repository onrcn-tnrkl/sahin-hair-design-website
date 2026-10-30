"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation, site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function handleBookingClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (pathname !== "/randevu") return;
    event.preventDefault();
    router.push(`/randevu?restart=${Date.now()}`);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Ana menü">
          {navigation.map((item) => <Link key={item.href} href={item.href} className="nav-link">{item.label}</Link>)}
        </nav>
        <Link href="/randevu" onClick={handleBookingClick} className="button button-dark header-cta">Randevu Al</Link>
        <button className="menu-toggle grid lg:hidden" type="button" aria-label={open ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="mobile-menu" aria-label="Mobil menü">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}<a href={site.phoneHref} onClick={() => setOpen(false)}>Bizi arayın</a><Link href="/randevu" className="button button-dark" onClick={handleBookingClick}>Randevu Al</Link></nav>}
    </header>
  );
}
