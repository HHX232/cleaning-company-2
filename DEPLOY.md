# Deployment guide

Stack: Next.js 16 (standalone build) + Prisma + **SQLite** (no separate DB server) + S3-compatible object storage (srvstorage.kz) for images/chat files + a Telegram bot (long-polling). Targeted at a small 1 GB RAM VPS.

## 0. Prerequisites (on the server)

- **Node.js 20 LTS** and npm.
- **git**.
- **Swap** — on a 1 GB box this is essential (the build is memory-hungry). Create ~2 GB once:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
  sudo mkswap /swapfile && sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```

## 1. Clone

```bash
git clone https://github.com/ttr232/cleaning-company.git
cd cleaning-company
```

## 2. Environment variables

Create a `.env` file in the project root. **The secret values are sent separately — they are not in the repo.**

```env
# SQLite database file (relative to prisma/)
DATABASE_URL="file:./dev.db"

# NextAuth session secret — generate a fresh one for prod:
#   openssl rand -base64 32
AUTH_SECRET="<generate-your-own>"

# Public site URL — MUST be the real domain in prod.
# Used by sitemap.xml, robots.txt and Telegram notification links.
SITE_URL="https://your-domain.example"

# Telegram bot (from @BotFather) — optional; if omitted the bot just doesn't start.
TELEGRAM_BOT_TOKEN="<sent-separately>"

# S3-compatible object storage (images + chat attachments)
S3_ENDPOINT="https://s3.kz-1.srvstorage.kz"
S3_REGION="kz-1"
S3_BUCKET="cleaning-company"
S3_ACCESS_KEY="<sent-separately>"
S3_SECRET_KEY="<sent-separately>"
```

## 3. Install dependencies

```bash
npm ci
```

## 4. Database (SQLite — the DB is a single file)

**Option A — keep the current content (recommended).** The site already has real content (service pages, calculator, admin accounts). That content lives in the file `prisma/dev.db`, which is intentionally **not** in git. Copy the `dev.db` you were given into `prisma/dev.db`:
```bash
cp /path/to/received/dev.db prisma/dev.db
```

**Option B — start fresh** (baseline seed content + one default admin):
```bash
npx prisma migrate deploy
npx prisma db seed
```

Either way, apply any pending migrations (safe to run, no-op if already applied):
```bash
npx prisma migrate deploy
npx prisma generate
```

> Images and chat files live in the shared S3 bucket, so they're already available — nothing to copy.

## 5. Build

```bash
npm run build
```
Memory-heavy — this is why swap matters. If the box still struggles, build on another machine and copy the `.next/` folder over.

## 6. Run

The project is configured with `output: "standalone"` (a minimal self-contained server). After building, copy the assets the standalone server needs, then run it:

```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env .next/standalone/.env
cp -r prisma .next/standalone/prisma   # SQLite file + schema for Prisma at runtime

PORT=3000 node .next/standalone/server.js
```

**Simpler alternative** (uses a bit more RAM/disk, but no copy steps): `npm start` — runs `next start` on port 3000, reads `.env` automatically.

## 7. Keep it running (pm2 example)

```bash
npm i -g pm2
pm2 start .next/standalone/server.js --name cleaning --update-env
pm2 save
pm2 startup   # follow the printed command to enable auto-start on reboot
```
(or use a systemd service with `EnvironmentFile=/path/.env`).

## 8. Reverse proxy + HTTPS

Put nginx/Caddy in front, proxying `:80/:443` → `127.0.0.1:3000`, and terminate TLS there. This also offloads static file serving from Node. Point your domain's DNS at the server and set `SITE_URL` to that domain.

## Notes / gotchas

- **Telegram bot**: starts automatically on server boot if `TELEGRAM_BOT_TOKEN` is set (long-polling, see `instrumentation.ts`). Run **only one** instance — two processes polling the same bot token conflict.
- **Bot profile photo/name**: set via @BotFather (`/setuserpic`, `/setname`) — can't be done from code.
- **SITE_URL** must be the real domain in prod, otherwise sitemap/robots/Telegram links point at localhost.
- **Never commit `.env` or `prisma/*.db`** — both are gitignored on purpose (secrets and data).
