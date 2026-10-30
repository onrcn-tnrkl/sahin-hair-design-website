import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileBar } from "@/components/layout/StickyMobileBar";
import { site } from "@/config/site";

const serif = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], display: "swap" });
const sans = DM_Sans({ variable: "--font-body", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.slogan}`, template: `%s | ${site.name}` },
  description: `Özenli kesim, kişiye özel bakım ve sakin bir berber deneyimi. ${site.name}.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" className={`${serif.variable} ${sans.variable}`}><body><Header /><main>{children}</main><Footer /><StickyMobileBar /></body></html>;
}
