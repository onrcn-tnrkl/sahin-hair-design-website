export type Service = {
  slug: string;
  title: string;
  promise: string;
  price: number;
  details: string;
  includes: string[];
  category: string;
};

export const services: Service[] = [
  {
    slug: "anatomik-sac-kesimi",
    title: "Anatomik saç kesimi",
    promise: "Yüz hatlarına ve yaşam ritmine uyumlu, kişiye özel kesim.",
    price: 650,
    details: "Saçın doğal yönünü, yüz hatlarını ve günlük kullanım alışkanlıklarını birlikte değerlendiriyoruz. Sonuç; kolay şekil alan, sana ait bir görünüm.",
    includes: ["Kısa stil danışmanlığı", "Yıkama ve kişiye özel kesim", "Fön ve şekillendirme önerisi"],
    category: "Saç",
  },
  {
    slug: "sakal-bakimi",
    title: "Sakal bakımı",
    promise: "Yüz formunu belirginleştiren dengeli bir sakal ritüeli.",
    price: 400,
    details: "Sakalın doğal çıkış yönünü takip ederek hatları temizliyor, uzunluğu yüz biçiminle uyumlu hale getiriyoruz.",
    includes: ["Sıcak havlu hazırlığı", "Kontur ve boy düzenlemesi", "Nemlendirici bakım"],
    category: "Sakal",
  },
  {
    slug: "sac-cizgisi-ve-boya",
    title: "Saç çizgisi & boya",
    promise: "Doğal görünen tonlar ve temiz, dengeli hatlar.",
    price: 500,
    details: "Saç çizgisini özenle belirginleştiriyor, saç ve sakal için doğal görünümü koruyan renk uygulamaları yapıyoruz.",
    includes: ["Ton danışmanlığı", "Hassas çizgi düzenlemesi", "Renk koruma tavsiyesi"],
    category: "Renk",
  },
  {
    slug: "sac-bakim-ve-onarim",
    title: "Saç bakım & onarım",
    promise: "Saç derisine ve saç tellerine iyi gelen kısa bir mola.",
    price: 550,
    details: "Saç ve saç derisi ihtiyacına uygun ürünlerle bakım uyguluyor, günlük rutinde sürdürebileceğin öneriler paylaşıyoruz.",
    includes: ["Saç derisi değerlendirmesi", "Besleyici bakım uygulaması", "Evde bakım önerileri"],
    category: "Bakım",
  },
  {
    slug: "cilt-bakimi",
    title: "Cilt bakımı",
    promise: "Temiz, ferah ve dengeli bir cilt hissi.",
    price: 750,
    details: "Cildi nazikçe arındırıp rahatlatan, dinlenmiş bir görünüm kazandırmaya odaklanan bakım deneyimi.",
    includes: ["Cilt temizliği", "Arındırıcı maske", "Nemlendirici ve rahatlatıcı bitiş"],
    category: "Bakım",
  },
  {
    slug: "damat-paketi",
    title: "Damat paketi",
    promise: "Özel gününden önce baştan sona özenli hazırlık.",
    price: 2200,
    details: "Düğün gününe özel görünümünü önceden planlıyor, saç ve sakal bakımını tek bir sakin deneyimde buluşturuyoruz.",
    includes: ["Kişiye özel saç kesimi", "Sakal tasarımı", "Cilt tazeleme bakımı", "Özel gün öncesi stil planı"],
    category: "Paketler",
  },
  {
    slug: "manikur-pedikur",
    title: "Manikür & pedikür",
    promise: "Bakımlı eller ve ayaklar için özenli dokunuşlar.",
    price: 700,
    details: "Kişisel bakım rutininin tamamlayıcısı olan bu hizmette konfor, hijyen ve düzenli görünüm önceliğimiz.",
    includes: ["Tırnak şekillendirme", "El veya ayak bakımı", "Nemlendirici son dokunuş"],
    category: "Bakım",
  },
];
