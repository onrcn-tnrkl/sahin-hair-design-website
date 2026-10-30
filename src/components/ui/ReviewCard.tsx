import { Star } from "lucide-react";
import type { Review } from "@/data/reviews";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card">
      <div className="mb-5 flex gap-1 text-copper" aria-label={`${review.rating} yıldız`} >{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}</div>
      <p className="font-serif text-xl leading-relaxed">{review.text}</p>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm"><span className="font-medium">{review.name}</span><span className="text-muted">{review.date}</span></div>
    </article>
  );
}
