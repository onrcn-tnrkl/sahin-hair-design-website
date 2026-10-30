import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} ana sayfa`}
      className={`brand-mark ${light ? "brand-mark-light text-cream" : "text-ink"}`}
    >
      <Image src="/images/logoo.png" alt="" width={492} height={457} className="brand-logo-image" />
      <span className="brand-wordmark">
        <strong>SAHIN</strong>
        <small>HAIR DESIGN</small>
      </span>
    </Link>
  );
}
