# دليل نشر موقع نور القدس — على نفس سيرفر الـ ERP

الموقع هيتنشر **جنب** نظام الـ ERP على نفس الخادم (Contabo VPS)، كمشروع مستقل
تماماً: مجلد خاص، عملية تشغيل خاصة (Node.js عبر systemd)، وموقع Nginx خاص.
Nginx بيوجّه كل طلب حسب الدومين اللي طلبه — مفيش تداخل بين المشروعين.

> **قبل ما تبدأ:** الموقع محتاج يقرأ كتالوج المنتجات من الـ ERP وقت البناء
> (`npm run build`)، فلازم **PublicApi يكون مفعّل على الإنتاج الأول** — ده
> الخطوة 1 تحت.

الوقت المتوقع: **20–30 دقيقة**.

---

## قبل ما تبدأ

| تحتاج | ملاحظة |
|-------|--------|
| **وصول SSH لنفس سيرفر الـ ERP** | نفس الخادم اللي عليه `/var/www/nour-al-quds` |
| **مستخدم `nour` وNginx موجودين** | من إعداد الـ ERP الأساسي (خطوة سابقة) |
| **دومين فرعي مجاني (sslip.io)** | مفيش داعي تشتري دومين حقيقي دلوقتي — هنستخدم `site.<IP-بشرطات>.sslip.io` |

---

## الخطوة 1 — فعّل PublicApi على الـ ERP (الإنتاج)

الموقع بيقرأ الكتالوج عبر PublicApi، ولسه متفعّل **محلياً بس** — مش على السيرفر.
ادخل على السيرفر (`ssh root@<IP-الخادم>`) وشغّل:

```bash
cd /var/www/nour-al-quds

# ولّد توكن + كلمة سر قوية لمستخدم القراءة-فقط
API_TOKEN=$(sudo -u nour php artisan tinker --execute="echo Str::random(64);" | tail -1)
RO_PASS=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 24)
echo "TOKEN=$API_TOKEN"
echo "RO_PASS=$RO_PASS"
```

**احفظ القيمتين دول** — هتحتاجهم تاني في الخطوة 4. بعدين أضِفهم للـ `.env`:

```bash
sudo -u nour tee -a /var/www/nour-al-quds/.env > /dev/null <<EOF

# PublicApi — الموقع الإلكتروني (قراءة فقط)
PUBLIC_API_ENABLED=true
PUBLIC_API_TOKEN=${API_TOKEN}
DB_RO_USERNAME=web_readonly
DB_RO_PASSWORD=${RO_PASS}
EOF
```

أنشئ مستخدم قاعدة البيانات المقيَّد (SELECT فقط — لا يقدر يكتب أي حاجة):

```bash
sudo -u postgres psql -c "CREATE USER web_readonly WITH PASSWORD '${RO_PASS}';"
sudo -u postgres psql -c "GRANT CONNECT ON DATABASE nour_al_quds TO web_readonly;"
sudo -u postgres psql -d nour_al_quds -c "GRANT USAGE ON SCHEMA public TO web_readonly;"
sudo -u postgres psql -d nour_al_quds -c "GRANT SELECT ON
    products, categories, companies, stock, product_web_images,
    invoice_items, invoices, web_posts, web_faqs, web_brand_infos, web_settings
    TO web_readonly;"
```

فعّل التغيير وجرّب:

```bash
cd /var/www/nour-al-quds && sudo -u nour php artisan config:cache

curl -s https://157.173.111.0.sslip.io/api/v1/public/health
curl -s -H "Authorization: Bearer ${API_TOKEN}" \
  "https://157.173.111.0.sslip.io/api/v1/public/products?per_page=2"
```

**المتوقّع:** أول أمر `{"status":"ok",...}`، والتاني `data` فيها منتجين حقيقيين من كتالوجك.

> **بدّل `157.173.111.0` بالـ IP أو الدومين الفعلي لسيرفرك في كل الأوامر تحت.**

---

## الخطوة 2 — إعداد الخادم للموقع (مرة واحدة)

```bash
apt update && apt install -y git
git clone https://github.com/KhaledMD4321/nour-al-quds-web.git /var/www/nour-al-quds-web
cd /var/www/nour-al-quds-web
bash deploy/setup-server.sh site.157.173.111.0.sslip.io
```

> بدّل `157.173.111.0` بالنقط بـ IP سيرفرك الفعلي. النقط في IPv4 مقبولة في
> sslip.io عادي (مثال: `site.157.173.111.0.sslip.io`).

ده بيثبّت Node.js، وينشئ خدمة `nour-web` (systemd)، وموقع Nginx بيوجّه لـ
`127.0.0.1:3000`، وصلاحية محدودة لمستخدم `nour` يعيد تشغيل الخدمة وقت النشر.

---

## الخطوة 3 — أنشئ ملف البيئة `.env.production`

```bash
sudo -u nour nano /var/www/nour-al-quds-web/.env.production
```

الصق ده وعدّل التوكن (نفس `API_TOKEN` من الخطوة 1) والدومين:

```ini
DATA_SOURCE=erp
ERP_API_URL=https://157.173.111.0.sslip.io/api/v1/public
ERP_API_TOKEN=الصق_التوكن_من_الخطوة_1_هنا
ERP_API_TIMEOUT_MS=8000

NEXT_PUBLIC_SITE_URL=http://site.157.173.111.0.sslip.io
PORT=3000
HOSTNAME=127.0.0.1
```

للحفظ في `nano`: **Ctrl+O** ثم **Enter** ثم **Ctrl+X**.

> `NEXT_PUBLIC_SITE_URL` هنا بـ `http` مؤقتاً — هنرجعله ونحوّله `https` بعد
> الخطوة 5 (شهادة SSL).

---

## الخطوة 4 — انشر الموقع

```bash
sudo -u nour bash /var/www/nour-al-quds-web/deploy/deploy.sh
```

ده بيثبّت الاعتماديات، يبني الموقع (**يقرأ الكتالوج الحقيقي من الـ ERP وقت
البناء** — لازم يكون شغّال زي ما أكّدنا في الخطوة 1)، ويشغّل الخدمة.

---

## الخطوة 5 — جرّب!

افتح المتصفح على: **`http://site.157.173.111.0.sslip.io`**

المفروض تشوف الموقع كامل بالبراندات الحقيقية (نصار، إيجيك EGIC، ديما ثيرم)
والمنتجات الفعلية. 🎉

---

## الخطوة 6 — شهادة HTTPS (مجانية عبر sslip.io)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d site.157.173.111.0.sslip.io
```

اختر التحويل التلقائي لـ HTTPS لما يسأل. بعدها:

```bash
sudo -u nour sed -i 's#http://site#https://site#' /var/www/nour-al-quds-web/.env.production
sudo -u nour bash /var/www/nour-al-quds-web/deploy/deploy.sh
```

(إعادة النشر لازمة عشان `NEXT_PUBLIC_SITE_URL` الجديد يتضمّن في البناء —
بيُستخدم في الـ sitemap والـ canonical links.)

---

## بعد النشر

### تحديث الموقع لأحدث إصدار (في أي وقت لاحق)

```bash
sudo -u nour bash /var/www/nour-al-quds-web/deploy/deploy.sh
```

### الشوف على الأخطاء (لو حصل مشكلة)

```bash
sudo journalctl -u nour-web -n 50 --no-pager
```

### إعادة تشغيل الخدمة يدوياً

```bash
sudo systemctl restart nour-web
sudo systemctl status nour-web
```

---

## حل المشاكل السريع

| المشكلة | الحل |
|---------|------|
| صفحة 502 من Nginx | `systemctl status nour-web` — لو واقفة شوف `journalctl -u nour-web -n 50` |
| البناء (`deploy.sh`) بيفشل عند `npm run build` | تأكد إن الـ ERP شغّال ومتاح: `curl https://<دومين الـ ERP>/api/v1/public/health` |
| البناء بيرجّع 401 | التوكن في `.env.production` (`ERP_API_TOKEN`) مش مطابق لـ `PUBLIC_API_TOKEN` في `.env` بتاع الـ ERP |
| تعديل في `.env.production` مش ظاهر | التعديل محتاج **إعادة نشر** (`deploy.sh`) — `NEXT_PUBLIC_*` بتتخبز وقت البناء مش وقت التشغيل |
| رقم الواتساب أو نص محتوى مش متحدّث | راجع «الموقع الإلكتروني» في لوحة الـ ERP — التحديث تلقائي خلال ~٥ دقايق بدون إعادة نشر (ده منفصل عن `.env.production`) |

---

## تحسين أمان اختياري (لاحقاً، مش ضروري دلوقتي)

بما إن الموقع والـ ERP على نفس السيرفر، تقدر تقفل PublicApi عن الإنترنت
تماماً وتخليه مسموح بس لطلبات السيرفر نفسه — الموقع هيفضل شغّال عادي (بيكلّم
الـ ERP داخلياً)، لكن محدش من بره يقدر يوصله. على سيرفر الـ ERP، في بلوك
Nginx بتاعه، ضيف قبل `location /api/v1/public`:

```nginx
location /api/v1/public {
    allow 157.173.111.0;   # IP سيرفرك نفسه (بدّله بالفعلي)
    deny all;
    try_files $uri /index.php?$query_string;
}
```

ثم `nginx -t && systemctl reload nginx`. اختبر بعدها إن الموقع لسه شغّال
(`deploy.sh` تاني) وإن `/api/v1/public/health` بقى مرفوض من بره (`curl` من
جهازك الشخصي المفروض يرجّع 403).

---

## قائمة تحقق ✅

- [x] PublicApi مفعّل على الـ ERP بمستخدم قاعدة بيانات مقيَّد (SELECT فقط)
- [x] الموقع شغّال بمستخدم `nour` (مش root)، عملية منفصلة عن الـ ERP تماماً
- [x] البناء يعتمد على الكتالوج الحقيقي (لا mock على الإنتاج)
- [ ] **HTTPS مفعّل** (الخطوة 6)
- [ ] **(اختياري)** قفل PublicApi عن الإنترنت (القسم فوق)
- [ ] **(لاحقاً)** لما يتوفر دومين حقيقي: كرّر الخطوة 6 بالدومين الجديد بدل sslip.io

**مبروك — الموقع رسمي وشغّال جنب الـ ERP! 🚀**
