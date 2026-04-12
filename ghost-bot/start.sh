#!/bin/bash
echo ""
echo "👻 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👻  Ghost Bot — by Rakib Islam"
echo "👻 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/runner/workspace/ghost-bot

# Check if account.txt has a cookie
COOKIE=$(head -1 account.txt 2>/dev/null)
if [ "$COOKIE" = "paste your cookie here." ] || [ -z "$COOKIE" ]; then
  echo "❌ ERROR: Facebook Cookie পাওয়া যায়নি!"
  echo ""
  echo "account.txt ফাইলে আপনার Facebook Cookie paste করুন।"
  echo ""
  echo "📖 Cookie কীভাবে পাবেন:"
  echo "  1. Kiwi Browser বা PC Chrome-এ Facebook login করুন"
  echo "  2. EditThisCookie extension install করুন"
  echo "  3. facebook.com-এ যান → Extension icon ক্লিক → Export করুন"
  echo "  4. সেই JSON টা account.txt-এ paste করুন"
  echo ""
  echo "👻 account.txt ঠিক করে আবার Start করুন।"
  exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Dependencies install হচ্ছে..."
  npm install --silent
  echo "✅ Install সম্পন্ন!"
  echo ""
fi

echo "🚀 Ghost Bot চালু হচ্ছে..."
echo "⚡ Prefix: $(node -e "const c=require('./config.json'); console.log(c.prefix)")"
echo "👤 Owner UID: 61576396811594 (Rakib Islam)"
echo ""

node index.js
