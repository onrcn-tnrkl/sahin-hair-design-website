export const site = {
  name: "Örnek Erkek Kuaförü",
  shortName: "ÖRNEK",
  descriptor: "ERKEK KUAFÖRÜ",
  slogan: "Kendine ayırdığın iyi bir zaman.",
  phone: "+90 5XX XXX XX XX",
  phoneHref: "tel:+905000000000",
  whatsapp: "905000000000",
  address: "Yeni, Güzel Hisar Cd. No: 28 D:1A, 35800 Aliağa/İzmir",
  mapUrl: "https://www.google.com/maps/dir/?api=1&destination=38.7944939%2C26.980508",
  googleMapsUrl: "https://maps.app.goo.gl/bq31UTMJFcAhotgF8",
  mapEmbedUrl: "https://maps.google.com/maps?hl=tr&q=%C5%9Eahin%20Hair%20Design%2C%20Yeni%2C%20G%C3%BCzel%20Hisar%20Cd.%20No%3A28%20D%3A1A%2C%20Alia%C4%9Fa%2C%20%C4%B0zmir&z=16&output=embed",
  rating: 5.0,
  reviewCount: 85,
  openDaysPerWeek: 6,
  copyrightYear: 2026,
  hours: [
    { day: "Pazartesi – Cuma", time: "09.00 – 20.00" },
    { day: "Cumartesi", time: "09.00 – 19.00" },
    { day: "Pazar", time: "Randevu ile" },
  ],
  social: [
    { name: "Instagram", href: "https://instagram.com/" },
    { name: "Facebook", href: "https://facebook.com/" },
  ],
} as const;

export const navigation = [
  { label: "Anasayfa", href: "/" },
  { label: "Manifesto", href: "/hakkimizda" },
  { label: "Ekibimiz", href: "/ekibimiz" },
  { label: "Hizmetlerimiz", href: "/hizmetler" },
  { label: "Blog", href: "/journal" },
] as const;
