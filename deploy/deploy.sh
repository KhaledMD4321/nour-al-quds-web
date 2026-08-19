#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  موقع نور القدس — نشر/تحديث (يُشغَّل كمستخدم التطبيق: nour)
#  أول نشر:  sudo -u nour bash deploy/deploy.sh   (بعد إنشاء .env.production)
#  أي تحديث لاحق: نفس الأمر — السكربت آمن لإعادة التشغيل.
#
#  محتاج الـ ERP شغّالاً وقت البناء (npm run build بيسحب الكتالوج الحقيقي
#  عبر PublicApi لتوليد الصفحات الثابتة). لو الـ ERP واقع، البناء هيفشل.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

cd "$(dirname "$0")/.."
APP_DIR="$(pwd)"

if [ ! -f "${APP_DIR}/.env.production" ]; then
  echo "❌ ${APP_DIR}/.env.production غير موجود — راجع DEPLOYMENT.md وأنشئه أولاً."
  exit 1
fi

echo ">>> [1/5] تحديث الكود من GitHub..."
git pull --ff-only 2>/dev/null || echo "    (تخطّي git pull — أول نشر أو مفيش تغييرات)"

echo ">>> [2/5] تثبيت الاعتماديات..."
npm ci

echo ">>> [3/5] بناء الإنتاج (يقرأ الكتالوج من الـ ERP عبر PublicApi)..."
npm run build

echo ">>> [4/5] تجهيز حزمة standalone (نسخ الأصول الثابتة + متغيرات البيئة)..."
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
cp .env.production .next/standalone/.env.production

echo ">>> [5/5] إعادة تشغيل الخدمة..."
sudo systemctl restart nour-web
sleep 2
sudo systemctl status nour-web --no-pager -l | head -6

echo ""
echo "✅ نشر الموقع اكتمل."
