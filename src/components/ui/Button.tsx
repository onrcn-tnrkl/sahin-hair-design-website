import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "outline" | "copper" | "light";
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Button({ href, children, variant = "dark", className = "", ...props }: Props) {
  return <Link href={href} className={`button button-${variant} ${className}`} {...props}>{children}</Link>;
}
