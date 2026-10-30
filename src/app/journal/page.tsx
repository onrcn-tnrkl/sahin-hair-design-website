import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/data/blog";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Journal", description: "Kişisel bakım ve stil üzerine özgün notlar." };

export default function JournalPage() {
  return <><PageHero eyebrow="Journal" title="Bakım, stil ve iyi hissetmek." description="Kişisel stil, bakım alışkanlıkları ve berber kültürü üzerine küçük notlar." /><Container className="py-16 sm:py-24"><div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <article key={article.slug}><Link href={`/journal/${article.slug}`}><div className="article-image"><Image src={article.image} alt={`${article.title} için editoryal görsel yer tutucusu`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" /></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[.15em] text-copper">{article.category} · {article.readingTime}</p><h2 className="mt-2 font-serif text-3xl leading-tight">{article.title}</h2><p className="mt-3 text-sm leading-7 text-muted">{article.excerpt}</p><span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">Devamını oku <ArrowUpRight size={14} /></span></Link></article>)}</div></Container></>;
}
