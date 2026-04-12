# 👻 Ghost Bot — Complete Setup & Usage Guide
**Owner: Rakib Islam | Bot: Ghost Bot | Prefix: . (dot)**

---

## 🚀 HOW TO START THE BOT

### 1. Add Facebook Cookie
Edit `account.txt` file and paste your Facebook cookie (fbstate)

### 2. Install & Run
```bash
cd ghost-bot
npm install
node index.js
```

### 3. Keep Running 24/7 (Anti-Crash)
```bash
npm install pm2 -g
pm2 start index.js --name ghost-bot
pm2 save
pm2 startup
```

---

## 🔒 PRIVATE / PUBLIC MODE

| Command | What it does |
|---------|-------------|
| `.ghostmode private` | Only you (owner) can use commands |
| `.ghostmode public` | Everyone can use commands |
| `.ghostmode status` | Check current mode |

---

## 👤 OWNER-ONLY COMMANDS (UID: 61576396811594)

| Command | Description |
|---------|-------------|
| `.ghostmode private/public` | Toggle bot mode |
| `.ghostgit setup <token> <user> <repo>` | Connect GitHub |
| `.ghostgit push "message"` | Push to GitHub from Messenger |
| `.ghostgit status` | Check git status |
| `.ghostban @user` | Ban user from bot |
| `.ghostban unban @user` | Unban user |
| `.ghostbroadcast <msg>` | Send to all groups |
| `.ghostdm @user <msg>` | Private message |
| `.ghostcmd new <name> <desc>\|<reply>` | Create new command live |
| `.ghostcmd list` | List custom commands |

---

## 👮 ADMIN-ONLY COMMANDS (Role 1+)

| Command | Description |
|---------|-------------|
| `.roast @user` | Roast someone |
| `.insult @user <reason>` | Publicly warn |
| `.kick2 @user` | Kick from group |
| `.ghostwarn @user <reason>` | Warn user (3 warns = notice) |
| `.ghostwarn check @user` | Check warn count |
| `.ghostmute @user <mins>` | Mute user |
| `.ghostmute unmute @user` | Unmute |
| `.ghosttag <message>` | Tag all members |
| `.antilink2 on/off` | Anti-link protection |

---

## 🌐 PUBLIC COMMANDS (Everyone)

### 📥 Media Downloads
| Command | Description |
|---------|-------------|
| `.song <name>` | Download MP3 song |
| `.ytb mp3 <name>` | YouTube to MP3 |
| `.ytb mp4 <name>` | YouTube to MP4 |
| `.tiktok <link>` | Download TikTok (no watermark) |
| `.fbdl <link>` | Download Facebook video |
| `.pin <search> - <count>` | Pinterest images |

### 🤖 AI Features
| Command | Description |
|---------|-------------|
| `.gpt <question>` | Ask AI anything |
| `.imagine <prompt>` | Generate AI image |
| `.ghostask <question>` | Quick AI answer |
| `.baby <message>` | AI chat (baby mode) |
| `.translate <lang> <text>` | Translate text |

### 🛠️ Utility
| Command | Description |
|---------|-------------|
| `.weather <city>` | Weather info |
| `.calc 5+3*2` | Calculator |
| `.time` | Bangladesh time |
| `.qr <text>` | Generate QR code |
| `.shorten <url>` | Shorten URL |
| `.define <word>` | Word definition |
| `.lyrics <song>` | Song lyrics |
| `.crypto bitcoin` | Crypto prices |
| `.news <topic>` | Latest news |
| `.remind <seconds> <msg>` | Set reminder |
| `.poll <q>\|opt1\|opt2` | Create poll |

### 🎮 Fun
| Command | Description |
|---------|-------------|
| `.joke` | Random joke |
| `.trivia` | Quiz game |
| `.ship @p1 @p2` | Love meter |
| `.catfact` | Cat facts |
| `.fakeid` | Fake profile |
| `.ghostquote` | Dark quotes |
| `.color #FF5733` | Color info |

### ℹ️ Info
| Command | Description |
|---------|-------------|
| `.owner` | Owner info + photo |
| `.alive` | Bot status |
| `.ghostinfo` | Bot details & uptime |
| `.ghoststats` | System stats |
| `.ghostping` | Response speed |
| `.ghosthelp` | Help menu |

---

## 📦 HOW TO PUBLISH TO GITHUB (From Messenger)

### Step 1: Get GitHub Token
1. Go to: **github.com/settings/tokens**
2. Click "Generate new token (classic)"
3. Select: `repo` and `workflow`
4. Copy the token

### Step 2: Create Repository
1. Go to: **github.com/new**
2. Name: `ghost-bot`
3. Create it

### Step 3: Connect from Messenger
Type in your group:
```
.ghostgit setup <your-token> <your-username> ghost-bot
```

### Step 4: Push Updates from Messenger
```
.ghostgit push "Added new commands"
```

---

## 🛡️ ANTI-BAN TIPS (70+ Days)

✅ **Already configured:**
- `autoReconnect: true` — reconnects automatically
- `forceLogin: false` — prevents checkpoint
- `updatePresence: false` — reduces detection
- `autoRefreshFbstate: true` — auto-refreshes cookie
- Auto restart every 6 hours
- MQTT restart every 1 hour

✅ **Additional tips:**
1. Don't spam — use cooldown on commands
2. Don't send too many messages per second
3. Use a 2FA-secured Facebook account
4. Don't login from multiple devices
5. Keep bot active 24/7 (don't restart often)
6. Use cookies from real browser session

---

## 📊 GHOST BOT STATS
- **Total Commands**: 215+
- **Owner**: Rakib Islam (UID: 61576396811594)
- **Prefix**: . (dot)
- **Bot Name**: Ghost Bot
- **Timezone**: Asia/Dhaka
- **Database**: SQLite (stable)

---
💀 **Ghost Bot** — Powered by Darkness | Made by **Rakib Islam**
