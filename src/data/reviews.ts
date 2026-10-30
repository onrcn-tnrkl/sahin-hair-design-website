export type Review = {
  name: string;
  date: string;
  text: string;
  rating: number;
};

export const reviews: Review[] = [
  { name: "Google Maps değerlendirmesi", date: "3 ay önce", text: "Farklı tarzlarda yapılan kesimlerde beklentilerinin aşıldığını ve hizmetten memnun kaldığını belirtiyor.", rating: 5 },
  { name: "Google Maps değerlendirmesi", date: "2 ay önce", text: "Salonun temiz ve ferah ortamını, istenen saç stiline uygun kesimi öne çıkarıyor.", rating: 5 },
  { name: "Google Maps değerlendirmesi", date: "3 ay önce", text: "Aliağa'daki hizmetten duyduğu memnuniyeti ve berberin kesim konusundaki deneyimini vurguluyor.", rating: 5 },
];
