# دليل رفع «بوابة الطالب» إلى Google Play

تاريخ الإعداد: 2026-10-30

## جاهز الآن على القرص

| الملف | ملاحظة |
|---|---|
| `android/app/build/outputs/bundle/release/app-release.aab` | **حزمة AAB موقّعة، جاهزة للرفع** (3.25 ميجابايت) |
| `android/app/build/outputs/apk/debug/app-debug.apk` | APK للاختبار على هاتفك (4.42 ميجابايت) |
| `android/keystore/release.keystore` | مفتاح التوقيع (نفس مفتاح الحساب) — **انسخه احتياطياً** |
| `store-assets/icon-512.png` · `store-assets/feature-graphic-1024x500.png` | أصول المتجر |
| `store-assets/screenshots/` | 3 لقطات 9:16 |
| `store-assets/play-listing.md` | نصوص اللائحة + إجابات أمان البيانات |
| `client/public/privacy-policy.html` | سياسة الخصوصية (تنشر مع GitHub Pages) |

تحقّقتُ بالفحص: `targetSdkVersion=36` و`platformBuildVersion=36`، الاسم `com.mohammedusa162.oilgasportal`، والشهادة `CN=Mohammed … C=LY` بصمة `SHA256: 81:23:9A:…`، والخطوط و`privacy-policy.html` داخل الحزمة، وبلا أي مكوّن تتبّع.

## ما يجب عليك أنت (لا يمكن لأي أداة تنفيذه)

1. حساب Play Console + التحقق من الهوية + 25 دولاراً.
2. رفع `app-release.aab` من Console.
3. جمع **12 مختبراً × 14 يوماً متواصلة** للحصول على صلاحية النشر العام (حساب شخصي جديد بعد 2023-11-13).

## الخطوات على Console

1. **Create app** → الاسم والوصف من `store-assets/play-listing.md`.
2. ارفع الأيقونة والصورة العرضية واللقطات.
3. **Privacy policy**: ادفع تعديلات المشروع إلى GitHub حتى تُنشر الصفحة على Pages، ثم ضع الرابط:
   `https://mohammedusa162-oss.github.io/oil-gas-student-portal/privacy-policy.html`
4. **Data safety**: «لا يجمع ولا يشارك أي بيانات» — صحيح تقنياً بعد إزالة اتصال Google Fonts.
5. **Content rating** → Everyone · **Target audience** → 13+.
6. **App signing by Google Play**: فعّله، وارفع بمفتاحك المحلي.
7. **Internal testing** → ارفع الحزمة → أضف المختبرين.
8. **Closed testing** → 12 مختبراً 14 يوماً → ثم **Production** → مراجعة Google.

## أوامر البناء بعد أي تعديل

```bash
pnpm install                # مرة واحدة
pnpm exec vite build        # بناء الواجهة إلى dist/public
pnpm exec cap sync android  # نسخ الأصول إلى مشروع Android
cd android && ./gradlew bundleRelease    # حزمة الرفع
cd android && ./gradlew assembleDebug    # APK للاختبار
pnpm exec tsc --noEmit      # فحص الأنواع
node scripts/make-android-icons.cjs      # إعادة توليد الأيقونات
```

## ملاحظات تقنية

- `android/gradle.properties` يحمل `android.overridePathCheck=true` لأن مسار المشروع يحوي حروفاً عربية؛ الأفضل نقل المشروع إلى مسار لاتيني.
- مفتاح التوقيع مكرّر في `android/keystore/` (نفس مفتاح تطبيق «متتبع البحث») — مفتاح واحد لكل حساب مطوّر، وهو الأصل في Play.
- خط «عارف رقعة» (SIL OFL) مضمّن في `client/public/fonts/` — الطباعة تعمل دون إنترنت.
