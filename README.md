# موقع نور القدس التعريفي

الموقع التسويقي/التعريفي لشركة **نور القدس** لتوزيع الأدوات الصحية والسباكة في مصر.
هدفه الأساسي جذب العملاء عبر البحث (SEO) وعرض الكتالوج، مع توليد الطلبات عبر واتساب
(مش متجر بيع أونلاين — لا أسعار ولا سلة).

## الصلة بنظام الـ ERP

مشروع **منفصل** عن نظام نور القدس ERP (Laravel/Filament في `C:\Projects\nour-al-quds`).
بيانات المنتجات والفئات والمصنّعين تُسحب من الـ ERP عبر **PublicApi** — واجهة عامة
للقراءة فقط تحت `/api/v1/public`، ويعيد الموقع التوليد دورياً (ISR) فتبقى البيانات
محدّثة دون تعريض قاعدة بيانات الـ ERP للنت العام. المتصفح لا يكلّم الـ ERP مطلقاً؛
كل النداءات server-side بالتوكن.

- **الكتالوج** (منتجات/فئات/مصنّعين/الأكثر طلباً): [`src/lib/erp.ts`](src/lib/erp.ts) — يدعم `DATA_SOURCE=mock|erp`
- **محتوى الموقع (CMS)**: يُدار من لوحة الـ ERP (مجموعة «الموقع الإلكتروني») ويُقرأ عبر
  [`src/lib/cms.ts`](src/lib/cms.ts) من `/content/*` — المقالات والأسئلة الشائعة ونبذات
  المصنّعين وإعدادات التواصل (واتساب/هاتف/مواعيد/عنوان/خريطة). أي endpoint فاضي أو واقع
  ⇒ fallback تلقائي للمحتوى المشحون في `src/lib/{blog,faqs,brandInfo,site}.ts`
- الأنواع (مطابقة لعقد الـ API): [`src/types/erp.ts`](src/types/erp.ts)

## التقنيات

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + نظام تصميم (tokens في `src/styles`)
- TypeScript
- خط Alexandria + عربي RTL

## الإعداد والتشغيل

```bash
npm install
cp .env.example .env.local     # واضبط ERP_API_URL و ERP_API_TOKEN
npm run dev                    # http://localhost:3000
```

المتغيّرات المطلوبة موضّحة في [`.env.example`](.env.example).

## الفحص والبناء

```bash
npm run lint          # ESLint
npx tsc --noEmit      # فحص الأنواع
npm run build         # بناء الإنتاج (يحتاج الـ ERP شغّالاً لجلب الكتالوج)
npm run start         # تشغيل نسخة الإنتاج
```

> ملاحظة: صفحات المنتجات تُبنى عند الطلب (on-demand ISR) لأن الكتالوج كبير
> (١٥٠٠+ صنف)؛ الباقي ثابت (SSG). لازم يكون الـ ERP متاحاً وقت `next build`.

## النشر

مناسب لـ **Vercel** (Next.js native). اضبط متغيّرات `.env.example` في إعدادات
المشروع على الاستضافة، وتأكّد إن الـ ERP يفعّل `PUBLIC_API_ENABLED=true` وإن
`ERP_API_URL` يشير للـ PublicApi الحقيقي المتاح لسيرفر الموقع فقط.
