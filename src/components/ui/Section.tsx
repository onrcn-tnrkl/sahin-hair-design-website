import type { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Section({ children, className = "", id, innerClassName = "" }: { children: ReactNode; className?: string; id?: string; innerClassName?: string }) {
  return <section id={id} className={`section-space ${className}`}><Container className={innerClassName}><Reveal>{children}</Reveal></Container></section>;
}
