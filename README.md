# YouTube Shorts Blocker — Safari

Safari uchun TypeScript’da yozilgan Web Extension. Node.js build va Safari loyihasini yaratish uchun ishlatiladi; extension ichida Node.js serveri ishlamaydi.

## Imkoniyatlar

- Bosh sahifa, qidiruv va tavsiyalardagi Shorts kartochkalarini yashiradi.
- Shorts bo‘limlari va yon menyudagi Shorts havolasini yashiradi.
- `/shorts` va `/shorts/VIDEO_ID` ochilsa, YouTube bosh sahifasiga qaytaradi.
- YouTube sahifa almashishi va yangi kontent yuklanishini kuzatadi.
- Oddiy videolarni saqlaydi. `/watch?v=...` ko‘rinishida ochilgan qisqa videolarni davomiyligi bo‘yicha bloklamaydi.
- Faqat YouTube sahifalarida ishlaydi; tashqi server, telemetriya va ma’lumot yig‘ish yo‘q.

## Ishga tushirish

Node.js 22+ va macOS’da Safari 16+ kerak.

```sh
npm install
npm run check
npm run safari
```

`dist/` — brauzer uchun tayyor extension. Safari bu papkani bevosita extension sifatida o‘rnatmaydi: uni Xcode orqali macOS ilovasi bilan paketlash kerak.

### Xcode nima uchun kerak?

TypeScript extension mantig‘ini yozish uchun, Node.js esa uni JavaScript’ga yig‘ish uchun ishlatiladi. Xcode tayyor extension’ni Safari taniydigan macOS ilovasi bilan paketlaydi va ishga tushiradi. Extension ishlashi uchun Xcode doim ochiq turishi shart emas.

### 1. Xcode’ni tayyorlash

App Store’dan Apple’ning **Xcode** dasturini o‘rnating va bir marta oching. Faqat Xcode Command Line Tools yetarli emas.

Boshlang‘ich sozlashda:

- **Components** oynasida macOS komponenti `Built-in` bo‘lsa, u mavjud. Bu loyiha faqat Mac uchun: iOS, watchOS, tvOS va visionOS komponentlarini yuklash shart emas. iOS tanlangan bo‘lsa, uni o‘chiring va davom eting.
- **External Agent Access** oynasida **Never** tanlandi. Extension’ni yig‘ish uchun tashqi AI agentlariga Xcode vositalaridan foydalanish ruxsati kerak emas. Bu sozlamani keyin Settings → Intelligence orqali o‘zgartirish mumkin.

Terminal’da faol developer katalogini belgilang:

```sh
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Mac parolini kiriting. Terminal’da parol belgilari ko‘rinmasligi normal.

### 2. Safari loyihasini yaratish

```sh
cd ~/Documents/Projects/youtube-shorts-blocker
npm install
npm run check
npm run safari
open safari
```

`npm run safari` avval `dist/` papkasini yig‘adi, so‘ng mavjud Apple packager yoki converter vositasi bilan `safari/` ichida macOS loyihasini yaratadi.

Ochilgan papkadan `YouTube Shorts Blocker/YouTube Shorts Blocker.xcodeproj` faylini Xcode’da oching. Yangi loyihani qo‘lda yaratish kerak emas.

### 3. Xcode’da ishga tushirish

Yuqorida **YouTube Shorts Blocker** sxemasi va **My Mac** qurilmasini tanlang. **Run** (`⌘R`) bosing. Signing talab qilinsa, target’ning **Signing & Capabilities → Team** bo‘limini sozlang.

Faqat `Build Succeeded` chiqishi bilan cheklanmay, ilovani ham ishga tushiring: Safari extension’ni aniqlashi uchun uning asosiy macOS ilovasi bir marta ochilishi kerak.

### 4. Safari’da extension’ni yoqish

1. **Safari → Settings → Advanced → Show features for web developers**’ni yoqing.
2. Safari yuqori menyusidan **Develop → Allow Unsigned Extensions**’ni belgilang.
3. **Settings → Extensions → YouTube Shorts Blocker** yonidagi katakchani yoqing.
4. YouTube saytiga kirish ruxsatini bering. Extension’ni yoqishning o‘zi saytga ruxsat berish o‘rnini bosmaydi.
5. YouTube sahifasini **⌘R** bilan yangilang.

Sayt ruxsatini berish usullari:

- YouTube ochiq turganda manzil satri yonidagi extension belgisini bosing. Ruxsat so‘ralsa, **Always Allow on This Website**’ni tanlang.
- Yoki **Safari → Settings → Extensions → YouTube Shorts Blocker → Edit Websites** ichida `youtube.com` uchun **Allow**’ni tanlang.

Menyu nomlari Safari versiyasiga qarab farqlanishi mumkin. Safari yopilib qayta ochilganda **Allow Unsigned Extensions**’ni qayta yoqish talab qilinishi mumkin.

Safari panelida extension ikonkasi bor. Bosilganda qisqa yo‘riqnoma oynasi ochiladi. Yoqilib, sayt ruxsati berilgach, extension YouTube sahifalarida avtomatik ishlaydi.

## O‘rnatishda uchragan muammolar va yechimlar

### `manifest.json is missing icons`

Converter loyihaga ikonka qo‘sha olmagani haqida ogohlantirdi. Dastlab manifest’da ikonka belgilanmagan edi. Endi `public/icons/` ichidagi PNG ikonkalar manifest’ga qo‘shilgan. Bu ogohlantirish extension mantig‘ining ishlashiga to‘sqinlik qilmadi; loyiha bilan davom etildi.

### `Embedded binary's bundle identifier is not prefixed with the parent app's bundle identifier`

Asosiy ilova va extension identifikatorlaridagi katta-kichik harflar mos kelmadi:

- Asosiy ilova: `uz.local.YouTube-Shorts-Blocker`
- Extension: `uz.local.youtube-shorts-blocker.Extension`

Asosiy ilova identifikatori quyidagicha tuzatildi:

| Target | Bundle Identifier |
| --- | --- |
| YouTube Shorts Blocker | `uz.local.youtube-shorts-blocker` |
| YouTube Shorts Blocker Extension | `uz.local.youtube-shorts-blocker.Extension` |

Extension identifikatori asosiy ilova identifikatori va nuqta bilan boshlanishi kerak; harflar registri ham bir xil bo‘lsin. Xcode’da har bir target’ning **Signing & Capabilities → Bundle Identifier** qiymatini tekshiring. O‘z identifikatoringizni ishlatsangiz, ikkala target’ni ham shu qoidaga moslang.

Ushbu tuzatish yaratilgan `safari/YouTube Shorts Blocker/YouTube Shorts Blocker.xcodeproj/project.xcproj` fayliga kiritildi va `xcodebuild` natijasi **BUILD SUCCEEDED** bo‘ldi. Safari loyihasini qayta yaratsangiz, identifikatorlarni yana tekshiring: tuzatish converter skriptiga kiritilmagan. Xcode eski xatoni ko‘rsatsa, loyihani yopib qayta oching va `⌘R` bosing.

### Extension Safari ro‘yxatida ko‘rinmayapti

**Allow Unsigned Extensions** yoqilganini tekshiring va Xcode’da ilovani `⌘R` bilan ishga tushiring. So‘ng Safari’ning Extensions sozlamalarini qayta oching.

### Extension yoqilgan, lekin Shorts hali ko‘rinmoqda

Avval YouTube uchun sayt ruxsatini tekshiring. O‘rnatish davomida manzil satri yonidagi extension belgisida to‘q sariq ogohlantirish ko‘rindi. YouTube uchun **Allow** berilib, sahifa yangilangach, foydalanuvchi bloklash ishlaganini tasdiqladi. Safari’ni qayta ishga tushirish bu holatda shart bo‘lmadi.

## Bajarilgan tekshiruvlar

- TypeScript tekshiruvi (`npm run typecheck`) o‘tdi.
- Ikkita avtomatik test (`npm test`) o‘tdi.
- Extension build’i (`npm run build`) bajarildi.
- Bundle Identifier tuzatilgach, Xcode build’i muvaffaqiyatli yakunlandi.
- 2026-yil 8-noyabrda Safari’da sayt ruxsati berilgach, foydalanuvchi Shorts bloklanishi ishlaganini tasdiqladi. Quyidagi qo‘lda tekshirish ro‘yxatining barcha bandlari alohida tasdiqlanmagan.

Apple yo‘riqnomasi: [Packaging a web extension for Safari](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari).

## Tekshirish

```sh
npm run typecheck
npm test
npm run build
```

Avtomatik testlar URL chegaralari, begona domenlar, oddiy videolarni saqlash, yangi kartochkalar va qayta ishlatilgan kartochkalarning tiklanishini tekshiradi.

Safari’da qo‘lda tekshirish:

- Bosh sahifa va qidiruvda oddiy videolar ko‘rinsin, Shorts bo‘limlari yashirilsin.
- Pastga aylantirilganda kelgan Shorts ham yashirilsin.
- `https://www.youtube.com/shorts/VIDEO_ID` ochilganda bosh sahifaga qaytsin.
- Oddiy video, Back/Forward va YouTube ichidagi sahifa almashish ishlasin.

YouTube HTML tuzilmasi o‘zgarsa, `src/blocker.ts` va `public/content.css` selektorlarini yangilash kerak bo‘lishi mumkin. Bu DOM asosidagi bloklovchi: to‘g‘ridan-to‘g‘ri Shorts ochilganda yo‘naltirishdan oldin tarmoq so‘rovlari boshlanishi mumkin.

## Tuzilishi

- `src/content.ts` — sahifa kuzatuvi va yo‘naltirish.
- `src/blocker.ts` — URL tekshirish va kartochkalarni yashirish.
- `public/` — manifest va darhol qo‘llanadigan CSS.
- `scripts/` — Node.js + TypeScript build va Safari paketlash.
- `tests/` — xatti-harakat testlari.

## Ikonkalar

`public/icons/icon.svg` — rangli extension ikonkasi, `toolbar.svg` — Safari paneli uchun shaffof fondagi belgi. `scripts/icons.ts` build vaqtida SVG fayllardan kerakli o‘lchamdagi PNG fayllarni yaratadi. Manifest’dagi `icons` extension ro‘yxati uchun, `action.default_icon` esa panel tugmasi uchun ishlatiladi.

Ikonkalar va popup mavjud Xcode loyihasiga ham qo‘shilgan. Yangilanishni Safari’da ko‘rish uchun Xcode’da ilovani to‘xtatib, `⌘R` bilan qayta ishga tushiring. Panelda tugma ko‘rinmasa, Safari’ning View → Customize Toolbar menyusini tekshiring.
