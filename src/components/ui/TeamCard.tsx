import Image from "next/image";

type TeamMember = { name: string };
const portraits = ["/images/portrait.svg", "/images/portrait-alt.svg"];

export function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const image = portraits[index % portraits.length];
  const hoverImage = portraits[(index + 1) % portraits.length];

  return (
    <article className="team-card group">
      <div className="team-image">
        <Image
          src={image}
          alt={`${member.name} için temsili portre görseli`}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0"
        />
        <Image
          src={hoverImage}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
        />
        <span className="team-number">0{index + 1}</span>
      </div>
      <div className="mt-4"><h3 className="font-serif text-2xl">{member.name}</h3></div>
    </article>
  );
}
