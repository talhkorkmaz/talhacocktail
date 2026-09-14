# Cocktail — bağımsız Cloudflare yayını

Bu proje sunucu uygulamasıdır. Pages üzerinde yalnızca `dist/client` yayımlamak ana sayfayı çalıştırmaz. Mevcut tasarım ve Sites yapılandırması korunur; bağımsız yayın `vite.cloudflare.config.ts` ile yapılır.

## Hesapta hazırlanacak hizmetler

1. Cloudflare D1: `talhacocktail-menu` adlı veritabanı oluşturun. Verilen Database ID değerini `wrangler.jsonc` içindeki örnek `database_id` yerine yazın.
2. Cloudflare R2: `talhacocktail-images` adlı bucket oluşturun. R2 için faturalandırma/aktivasyon istenirse hesap sahibi bu adımı tamamlamalıdır. Bucket'ın public erişimini açmak gerekmez; görseller uygulama üzerinden sunulur.
3. Cloudflare Access: Self-hosted uygulama oluşturun. `cocktail.talhakorkmaz.com/yonetim` ve `cocktail.talhakorkmaz.com/yonetim/*` yollarını aynı uygulamada koruyun. Allow politikası yalnızca `talhkorkmaz@gmail.com` için olmalı. Giriş için e-postaya tek kullanımlık kod kullanılabilir. Tüm domaini korumayın; ziyaretçi sayfası herkese açık kalmalı.
4. Access takım alan adını (ör. `takim.cloudflareaccess.com`, https veya yol olmadan) ve uygulamanın AUD değerini `wrangler.jsonc` içindeki `ACCESS_TEAM_DOMAIN` ve `ACCESS_AUD` alanlarına yazın. Bunlar şifre değildir.

Worker, Access imzasını/issuer/audience/süreyi ve sahip e-postasını doğrular. Ziyaretçinin gönderdiği eski Sites kimlik başlıklarını siler. Eksik veya geçersiz girişle yönetim ve yazma istekleri reddedilir; workers.dev üzerinden giriş atlanamaz. Access çerezi API isteklerinde sunucuda tekrar doğrulanır.

## Yayın sırası

Mevcut canlı Sites menüsünde sonradan değişiklik/yükleme varsa önce bunları aktarın; yeni D1 ve R2 eski hesabın içeriğini otomatik devralmaz. İlk şema yalnızca boş tablo oluşturur; uygulama tablo boşken kaynakta bulunan başlangıç menüsünü gösterir.

Yerel kurulum ve kontroller:

```sh
npm ci
npm run check:cloudflare
npm run db:migrate:cloudflare
npm run deploy:cloudflare
```

`db:migrate:cloudflare` gerçek hesabın D1 şemasını hazırlar. Önce doğru Cloudflare hesabında oturum açılmalıdır (`npx wrangler login`). `deploy:cloudflare` eksik hesap ayarlarıyla yayına izin vermez.

GitHub bağlantısı için **Pages değil Workers** projesi kullanın:

- Repo: `talhkorkmaz/talhacocktail`, dal `main`, kök klasör boş.
- Worker adı: `talhacocktail` (wrangler.jsonc ile aynı).
- Build command: `npm run check:cloudflare && npm run build:cloudflare`
- Deploy command: `npx wrangler deploy --config dist/server/wrangler.json`
- Pages'teki `Build output directory: dist/client` ayarı bu Workers akışında kullanılmaz.
- D1 migration ilk yayın öncesinde uygulanmalı; şema değişikliklerinde sonraki migration'lar da uygulanmalıdır.

Worker'ın `.workers.dev` adresinde ana sayfayı ve görselleri doğrulayın. Sonra `cocktail.talhakorkmaz.com` alan adını mevcut Pages projesinden ayırıp Worker'a Custom Domain olarak bağlayın. Pages projesini silmek gerekmez. Ana alan adı `talhakorkmaz.com` ve diğer içerikler değiştirilmez.

Son kontroller: ana sayfa ve 10 ürün, `/api/menu`, görseller/fontlar; oturumsuz `/yonetim` erişiminin engellenmesi; sahibin Access ile girişi; ürün kaydetme ve görsel yükleme. Hesap kurulumu yapılmadan canlı yayın tamamlanmış sayılmaz.

## Yerel test

```sh
node --experimental-strip-types --test worker/access.test.mjs
npx tsc --noEmit --incremental false
npm run build:cloudflare
npx wrangler d1 migrations apply DB --local --config wrangler.jsonc --persist-to .wrangler/state
npx wrangler dev --config dist/server/wrangler.json --persist-to .wrangler/state
```

Varsayılan yerel Access ayarları boş olduğundan yönetim kapalı kalır. Gerçek kullanıcı oturumu Cloudflare hesabında kurulumdan sonra ayrıca denenmelidir.
