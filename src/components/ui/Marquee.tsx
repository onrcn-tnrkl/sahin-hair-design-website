"use client";

import { Star } from "lucide-react";
import type { Review } from "@/data/reviews";

export function Marquee({ reviews, rating }: { reviews: Review[]; rating: number }) {
  const items = [...reviews, ...reviews];
  return (
    <section className="marquee-wrap" aria-label="Google misafir yorumları">
      <div className="marquee-heading"><span className="rating-badge"><Star size={14} fill="currentColor" /> {rating.toLocaleString("tr-TR")}</span><span>Misafir yorumları</span></div>
      {items.length > 0 ? <div className="marquee-track">{items.map((review, index) => <p key={`${review.name}-${index}`} className="marquee-item"><span>“{review.text}”</span><b>— {review.name}</b></p>)}</div> : <p className="marquee-item">Şu anda gösterilecek 4 yıldız ve üzeri Google yorumu bulunmuyor.</p>}
    </section>
  );
}
