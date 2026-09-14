# Talha Korkmaz — Kokteyl Seçkisi

Kırık beyaz ve bordo renklerde, tek sayfalık hareketli kokteyl sunumu. Orange Silk signature sahnesi, karakter grupları altında 10 kokteyl, The Çay / Peachy 10 özel sunumları, kilim dokulu Gece Kahvesi ve tasarımcı kapanışı.

## Ürün yönetimi

`/yonetim` ekranında adları, hikâyeleri, içerik özetlerini, görselleri, lezzet profillerini, renkleri, görünürlüğü ve banner seçimini değiştirin. Yeni kokteyl ekleyin, silin ve sıralayın. Değişiklikler **Seçkiyi kaydet** ile siteye uygulanır. Mevsimlik kaldırmak için **Seçkide göster** anahtarını kapatmak yeterlidir.

Düzenleme yalnızca `app/admin-auth.ts` dosyasındaki sahibin hesabına açıktır. Yerel geliştirmede starter'ın localhost ile sınırlı test hesabı kullanılabilir; üretimde bu istisna yoktur. Sitedeki genel erişim ayrıca Sites erişim ayarlarıyla yönetilir.

Kaydedilen menü D1'da, yüklenen görseller R2'da tutulur. Tarayıcı depolaması kalıcı kayıt yerine kullanılmaz. Görseller PNG, JPEG veya WebP olabilir (en fazla 8 MB). Eşzamanlı değişikliklerde eski taslak yeni kaydı ezmez.

İlk içerik `app/menu-data.ts`, sayfa tasarımı `app/showcase.tsx`, stiller `app/globals.css` içindedir. İlk kayıt oluşturulduktan sonra menü içeriği veri tabanından gelir. Hazırlanış ve ölçü bilgileri ziyaretçi sayfasında bulunmaz. Lezzet ölçekleri duyusal yorumdur; alkol oranı göstermez.

## Geliştirme

Node.js 22.13+ gerekir. Paket sürümleri package-lock.json ile sabitlenmiştir.

- `npm run install:ci`: bağımlılıkları kurar.
- `npm run dev`: localhost:5173 önizlemesi.
- `npm run build`: Sites / Cloudflare Worker çıktısı.
- `npm run db:generate`: şema değiştiğinde yeni migration oluşturur.

D1: `DB`, R2: `BUCKET`. Mevcut Site kimliği `.openai/hosting.json` dosyasında korunur. Siteyi yeniden oluşturmadan aynı proje üzerinden yayınlayın. Kalıcı veriler kaynak dosyası dağıtımlarından bağımsızdır.

## Görseller ve referanslar

Ürün görselleri kullanıcı tarafından verilen Drive klasöründen alındı. Klasörde Orange Silk adıyla duran passion fruit garnitürlü dosya, görseldeki meyveye dayanılarak Passion 10 ile eşleştirildi; gerekirse yönetim ekranından değiştirilebilir.

Bar portresi ve kilim dokusu, kullanıcının talebine göre built-in image_gen ile üretildi. Portre gerçek bir bar çekimi değildir. İki fotoğraf yüz referansı olarak kullanıldı. WebP türevleri boyutu azaltmak için hazırlanmıştır.

Tipografi: Google Fonts — Barlow Condensed, Cormorant Garamond ve DM Sans. Fontlar kendi dosyalarından yüklenir; OFL lisansları public/fonts içinde yer alır.

İncelenen tasarım referansları: https://21st.dev, https://gsap-cocktail-showcase.surge.sh, https://coastandpixel.com/web_design_cocktail_bar.html, https://allisincreative.com. Bileşen kodu bu sitelerden kopyalanmadı.

## Doğrulama

TypeScript kontrolü; 10 ürünün ve görsellerin yüklenmesi; kayıt sonrası veri okuması; izinsiz ve farklı kaynaktan yazma denemelerinin reddi; geçersiz kayıt doğrulaması; eşzamanlı kayıt çakışması; yerel R2 görsel yükleme ve byte bütünlüğü kontrol edildi. Yönetimdeki WebMCP okuma, taslak hazırlama, geçersiz girdiyi reddetme ve mevcut değerleri koruyarak kayıt işlemleri doğrulandı.
