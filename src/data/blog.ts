export type Article = {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  excerpt: string;
  image: string;
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "dogru-sac-kesimi-nasil-secilir",
    title: "Kendine yakışan saç kesimini seçmenin yolları",
    category: "Stil",
    readingTime: "4 dakika",
    excerpt: "Yüz biçimi, saçın doğal yönü ve günlük alışkanlıklar iyi bir kesimin başlangıç noktasıdır.",
    image: "/images/studio.svg",
    content: ["İyi bir saç kesimi, yalnızca trendleri takip etmekle değil, seni tanımakla başlar. Yüz hatların, saçının doğal yapısı ve sabahları ayırabildiğin zaman; doğru modeli birlikte belirler.", "Berberinle beklentilerini açıkça paylaş. Beğendiğin örnekleri göstermek kadar, günlük hayatında saçını nasıl kullandığını anlatmak da faydalıdır.", "Son dokunuşta sana uygun ürün ve şekillendirme önerilerini öğren. Böylece salondaki görünümünü evde de kolayca sürdürebilirsin."],
  },
  {
    slug: "sakal-bakiminda-kucuk-aliskanliklar",
    title: "Sakal bakımında fark yaratan küçük alışkanlıklar",
    category: "Bakım",
    readingTime: "3 dakika",
    excerpt: "Düzenli temizlik ve basit bir bakım rutini, sakalın görünümünü baştan sona değiştirir.",
    image: "/images/hero.svg",
    content: ["Sakal bakımının temeli düzenli temizliktir. Cilt tipine uygun nazik bir temizleyiciyle sakalın altındaki cildi de ihmal etme.", "Duştan sonra sakalını yumuşakça kurula ve ihtiyacına göre hafif bir bakım ürünü kullan. Az ürünle başlamak, sakalın doğal hissini korumaya yardımcı olur.", "Hatları evde düzeltirken küçük adımlar at. Büyük değişiklikleri ve form düzenlemelerini uzmanına bırakmak daha dengeli sonuç verir."],
  },
  {
    slug: "berber-ziyareti-oncesi-bilmen-gerekenler",
    title: "Berber ziyaretinden önce bilmen gerekenler",
    category: "Salon notları",
    readingTime: "5 dakika",
    excerpt: "Randevu öncesi birkaç küçük hazırlık, salondaki zamanını daha verimli kılar.",
    image: "/images/group.svg",
    content: ["Randevuya gelmeden önce nasıl bir görünüm istediğini düşünmek görüşmeyi kolaylaştırır. Bir fotoğraf örneği yardımcı olabilir; yine de saç yapının farklı olabileceğini aklında tut.", "Saçını sık kullandığın şekilde bırakman, berberinin doğal formu görmesini sağlar. Özel bir etkinliğin varsa bunu önceden söyle.", "Aklındaki soruları paylaşmaktan çekinme. İyi bir deneyim, karşılıklı iletişim ve sana ayrılan zamanla başlar."],
  },
];
