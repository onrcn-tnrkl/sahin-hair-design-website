import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export function PageHero({ eyebrow, title, description, titleClassName = "" }: { eyebrow: string; title: string; description: string; titleClassName?: string }) {
  return <section className="page-hero"><Container className="page-hero-inner"><Eyebrow>{eyebrow}</Eyebrow><h1 className={titleClassName}>{title}</h1><p>{description}</p></Container></section>;
}
