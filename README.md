# موقع نور القدس التعريفي

الموقع التسويقي/التعريفي لشركة **نور القدس** لتوزيع الأدوات الصحية والسباكة في مصر.
هدفه الأساسي جذب العملاء عبر البحث (SEO) وعرض المنتجات.

## الصلة بنظام الـ ERP

هذا مشروع **منفصل** عن نظام نور القدس ERP (Laravel/Filament في `C:\Projects\nour-al-quds`).
المنتجات وأسعارها تُسحب من الـ ERP عبر endpoint عام للقراءة فقط، ويعيد الموقع التوليد
دورياً (ISR) فتبقى الأسعار محدّثة دون تعريض قاعدة بيانات الـ ERP للنت العام.

- عميل الربط: [`src/lib/erp.ts`](src/lib/erp.ts)
- الأنواع: [`src/types/product.ts`](src/types/product.ts)
- الإعداد: انسخ `.env.local.example` إلى `.env.local` واضبط `ERP_API_URL`

> ملاحظة: الـ endpoint العام (`/api/public/products`) لم يُبنَ بعد في الـ ERP — يحتاج إضافة.

## التقنيات

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- TypeScript
- خط Cairo + عربي RTL

## التشغيل

```bash
npm install
cp .env.local.example .env.local   # واضبط ERP_API_URL
npm run dev                        # http://localhost:3000
```

## البناء

```bash
npm run build
npm run start
```
