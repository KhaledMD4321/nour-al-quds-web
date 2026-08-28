#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  موقع نور القدس — إعداد الخادم لأول مرة (يُشغَّل مرة واحدة، كـ root)
#  يفترض إن سيرفر الـ ERP (nour-al-quds) موجود بالفعل على نفس الجهاز:
#  مستخدم nour و Nginx مثبَّتين مسبقاً — هنا بنضيف Node.js + عملية الموقع بس.
#
#  الاستخدام:  sudo bash deploy/setup-server.sh [hostname-or-domain]
#  مثال (دومين فرعي مجاني):  sudo bash deploy/setup-server.sh site.157.173.111.0.sslip.io
#  مثال (بدون دومين):        sudo bash deploy/setup-server.sh   (يستخدم IP الخادم)
#
#  يثبّت: Node.js 20 LTS. ويجهّز: مجلد التطبيق (git clone) · خدمة systemd
#  (nour-web) · موقع Nginx (reverse proxy لـ 127.0.0.1:3000) · صلاحية sudo
#  محدودة لمستخدم nour لإعادة تشغيل الخدمة وقت النشر.
#  اختبر على Ubuntu 24.04 LTS.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "❌ شغّله كـ root:  sudo bash $0"; exit 1; }

REPO_URL="https://github.com/KhaledMD4321/nour-al-quds-web.git"
APP_DIR=/var/www/nour-al-quds-web
APP_USER=nour
PORT=3000

SERVER_IP="$(hostname -I | awk '{print $1}')"
SERVER_NAME="${1:-$SERVER_IP}"

echo ">>> [1/6] التأكد من وجود مستخدم التطبيق (${APP_USER})..."
id -u "${APP_USER}" >/dev/null 2>&1 || { echo "❌ المستخدم ${APP_USER} غير موجود — شغّل إعداد الـ ERP أولاً."; exit 1; }

echo ">>> [2/6] تثبيت Node.js 20 LTS..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v

echo ">>> [3/6] استنساخ الكود (أول مرة فقط)..."
if [ ! -d "${APP_DIR}/.git" ]; then
  git clone "${REPO_URL}" "${APP_DIR}"
fi
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"

if [ ! -f "${APP_DIR}/.env.production" ]; then
  echo ""
  echo "⚠️  لازم تنشئ ${APP_DIR}/.env.production يدوياً قبل أول نشر (راجع DEPLOYMENT.md)."
  echo "    السكربت هيكمل، لكن أول تشغيل لـ deploy.sh هيفشل من غير الملف ده."
  echo ""
fi

echo ">>> [4/6] خدمة systemd (nour-web)..."
cat > /etc/systemd/system/nour-web.service <<EOF
[Unit]
Description=نور القدس — موقع Next.js
After=network.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable nour-web >/dev/null 2>&1 || true

echo ">>> [5/6] موقع Nginx (server_name = ${SERVER_NAME})..."
cat > /etc/nginx/sites-available/nour-al-quds-web <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAME};

    # أصول Next.js الثابتة — كاش طويل، بصمة الملف (hash) بتضمن التحديث
    location /_next/static/ {
        proxy_pass http://127.0.0.1:${PORT};
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
ln -sf /etc/nginx/sites-available/nour-al-quds-web /etc/nginx/sites-enabled/nour-al-quds-web
nginx -t && systemctl reload nginx

echo ">>> [6/6] صلاحية إعادة تشغيل الخدمة وقت النشر (بدون باسورد، أوامر محدّدة فقط)..."
# لاحظ الصيغة بمعاملات (*) — sudoers بيطابق الأمر بمعاملاته بالكامل، و deploy.sh
# بينادي `systemctl status nour-web --no-pager -l` فبدون النجمة كان بيطلب باسورد.
cat > /etc/sudoers.d/nour-web-deploy <<EOF
${APP_USER} ALL=(root) NOPASSWD: /usr/bin/systemctl restart nour-web, /usr/bin/systemctl status nour-web, /usr/bin/systemctl status nour-web *
EOF
chmod 440 /etc/sudoers.d/nour-web-deploy

echo ""
echo "✅ إعداد الخادم اكتمل."
echo "   التالي: أنشئ ${APP_DIR}/.env.production يدوياً، وبعدين شغّل:"
echo "     sudo -u ${APP_USER} bash ${APP_DIR}/deploy/deploy.sh"
echo "   الموقع (بعد أول نشر) هيبقى متاح على: http://${SERVER_NAME}"
echo "   لتفعيل HTTPS بعدها:  apt install -y certbot python3-certbot-nginx && certbot --nginx -d ${SERVER_NAME}"
