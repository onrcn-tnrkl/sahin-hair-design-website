import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles } from "@/data/blog";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <article><header className="page-hero"><Container className="page-hero-inner"><Eyebrow>{article.category} · {article.readingTime} okuma</Eyebrow><h1>{article.title}</h1><p>{article.excerpt}</p></Container></header><Container className="py-12 sm:py-20"><div className="relative mx-auto aspect-[16/8] max-w-5xl overflow-hidden"><Image src={article.image} alt={`${article.title} için editoryal görsel yer tutucusu`} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" /></div><div className="article-copy mx-auto mt-12 max-w-2xl">{article.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><p className="mx-auto mt-12 max-w-2xl border-t border-line pt-5 text-xs text-muted">Bu yazı, örnek site içeriği olarak hazırlanmış özgün bir yer tutucudur.</p></Container></article>;
}
