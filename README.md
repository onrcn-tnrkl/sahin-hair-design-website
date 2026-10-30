# Şahin Hair Design

Türkçe, mobil öncelikli Şahin Hair Design sitesi. Next.js App Router, TypeScript, Tailwind CSS, Framer Motion ve lucide-react kullanır. Randevu akışı, Supabase veritabanındaki hizmet/personel bilgilerini ve randevu motorunun müsaitlik RPC'sini kullanır.

## Kurulum ve çalıştırma

```bash
npm install
```

Randevu entegrasyonunu kullanmadan önce:

1. `.env.example` dosyasını `.env.local` olarak kopyalayın: `cp .env.example .env.local`
2. Aynı Supabase projesine ait URL ve anon key değerlerini girin. Supabase RLS politikalarının randevu motorunun kullandığı okuma/yazma işlemlerine izin verdiğini doğrulayın.
3. `SITE_URL` değerini uygulamanın tam origin'i olarak ayarlayın (yerel geliştirmede `http://localhost:3000`). Personel Google Takvimleri bağlıysa `GOOGLE_CLIENT_EMAIL` ve `GOOGLE_PRIVATE_KEY` değerlerini de girin.
4. Gizli değerleri kaynak koda veya sürüm kontrolüne eklemeden uygulamayı başlatın.

Ana site ile `/home/onrcn13/appointment-engine` içindeki randevu motoru bağımsız Next.js uygulamalarıdır; her biri kendi proje dizininde ve kendi `.env.local` ayarlarıyla çalışır. Ana site, iki uygulamanın aynı Supabase projesini kullanmasıyla güncel hizmet, personel, müsaitlik ve randevu kayıtlarına erişir. Motor projesinin dosyalarını ana site çalıştırmaz veya değiştirmez. Node.js 20.9 veya üzeri gerekir.

Ardından siteyi çalıştırın:

```bash
npm run dev
```

Üretim derlemesini kontrol etmek için `npm run build`, ESLint için `npm run lint` komutlarını çalıştırın.

## Randevu akışı

`/randevu` hizmet ve personel uygunluğunu sunucu API'leri aracılığıyla Supabase'den getirir. Uygun saatler `get_available_slots_v4` RPC'si ve bağlı personelin Google Takvimi üzerinden kontrol edilir. Randevu oluşturulurken gelen alanlar sunucu tarafında doğrulanır, seçilen saat yeniden kontrol edilir ve müşteri/randevu/hizmet kayıtları aynı Supabase projesine yazılır. POST API'leri `SITE_URL` ile same-origin doğrulaması yapar. Google Takvim etkinliği oluşturulamazsa randevu kaydı korunur ve kullanıcıya uyarı gösterilir.

Veritabanı şeması ve RPC fonksiyonu motor projesinin kodunda tanımlı olmadığından, Supabase projesinde motorun kullandığı `service_categories`, `services`, `staff_services`, `staff`, `customers`, `appointments`, `appointment_services` tabloları ile `get_available_slots_v4` fonksiyonunun mevcut olduğundan emin olun. Son kayıt öncesi yapılan yeniden kontrol, daha önce seçilmiş/dolmuş saatlerin çoğunu engeller; iki eşzamanlı isteğe karşı kesin atomik garanti için veritabanında uygun kilit/constraint veya rezervasyon RPC'si gerekir ve mevcut projede böyle bir şema tanımı bulunmadı.

## İçerik ve marka ayarları

- İşletme adı, telefon, WhatsApp, adres, harita, saatler, sosyal bağlantılar ve Google puanı: `src/config/site.ts`
- Hizmet isimleri, açıklamalar, başlangıç fiyatları ve detaylar: `src/data/services.ts`
- Ekip kartları: `src/data/team.ts`
- Yorum kartları: `src/data/reviews.ts`
- Journal yazıları: `src/data/blog.ts`

İşletme adı, telefon, WhatsApp, çalışma saatleri, sosyal bağlantılar ve Google puanı/yorum sayısı `src/config/site.ts` içinde düzenlenir. Hareketli yorum bandı `src/data/reviews.ts` dosyasındaki yerel statik verileri kullanır; Google Places API çağrısı yapılmaz ve `GOOGLE_MAPS_API_KEY` veya `GOOGLE_PLACE_ID` gerekmez. Harita görünümü ve yol tarifi, Google Maps bağlantıları olarak çalışmaya devam eder. Yayın öncesinde işletme verilerini ve çalışma günlerini doğrulayın.

## Görseller

`public/images/` içindeki SVG dosyaları nötr tonlarda tasarlanmış çizim/gradient yer tutuculardır. Gerçek görsel eklenecek alanlar:

- `hero.svg`: ana sayfa açılış görseli
- `studio.svg`: salon iç mekânı ve hizmet detayları
- `group.svg`: ekip grup fotoğrafı
- `portrait.svg` ve `portrait-alt.svg`: ekip kartı normal/hover portreleri

Dosyaları aynı adlarla değiştirebilir veya `src/data/team.ts`, `src/data/blog.ts` ve `src/components/sections/HomeSections.tsx` içindeki yolları güncelleyebilirsiniz. Gerçek portre ve yorumları kullanmadan önce ilgili kişilerin açık iznini alın.
