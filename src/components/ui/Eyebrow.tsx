export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "text-cream/75" : ""}`}>{children}</p>;
}
