# Инструкция по деплою

Стек: Next.js 16 (сборка standalone) + Prisma + **SQLite** (отдельный сервер БД не нужен) + S3-совместимое объектное хранилище (srvstorage.kz) для картинок и файлов чата + Telegram-бот (long-polling). Рассчитано на небольшой VPS с 1 ГБ RAM.

## 0. Что нужно на сервере

- **Node.js 20 LTS** и npm.
- **git**.
- **Swap** — на коробке с 1 ГБ он обязателен (сборка прожорлива по памяти). Создать ~2 ГБ один раз:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
  sudo mkswap /swapfile && sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```

## 1. Клонирование

```bash
git clone https://github.com/HHX232/cleaning-company-2.git
cd cleaning-company-2
```

## 2. Переменные окружения

Создать файл `.env` в корне проекта. **Значения секретов передаются отдельно — их нет в репозитории.**

```env
# Файл базы SQLite (путь относительно prisma/)
DATABASE_URL="file:./dev.db"

# Секрет сессий NextAuth — сгенерировать свой для прода:
#   openssl rand -base64 32
AUTH_SECRET="<сгенерировать-свой>"

# Публичный URL сайта — на проде ОБЯЗАТЕЛЬНО реальный домен.
# Используется в sitemap.xml, robots.txt и ссылках Telegram-уведомлений.
SITE_URL="https://ваш-домен.example"

# Telegram-бот (из @BotFather) — опционально; без токена бот просто не стартует.
TELEGRAM_BOT_TOKEN="<передаётся-отдельно>"

# S3-совместимое хранилище (картинки + вложения чата)
S3_ENDPOINT="https://s3.kz-1.srvstorage.kz"
S3_REGION="kz-1"
S3_BUCKET="cleaning-company"
S3_ACCESS_KEY="<передаётся-отдельно>"
S3_SECRET_KEY="<передаётся-отдельно>"
```

## 3. Установка зависимостей

```bash
npm ci
```

## 4. База данных (SQLite — база это один файл)

**Вариант A — сохранить текущий контент (рекомендуется).** На сайте уже есть реальный контент (страницы услуг, калькулятор, аккаунты админов). Он лежит в файле `prisma/dev.db`, которого намеренно **нет** в git. Скопировать полученный `dev.db` в `prisma/dev.db`:
```bash
cp /путь/к/полученному/dev.db prisma/dev.db
```

**Вариант B — начать с нуля** (базовый seed-контент + один админ по умолчанию):
```bash
npx prisma migrate deploy
npx prisma db seed
```

В любом случае применить непринятые миграции (запускать безопасно, если всё применено — ничего не сделает):
```bash
npx prisma migrate deploy
npx prisma generate
```

> Картинки и файлы чата лежат в общем S3-бакете, поэтому они уже доступны — копировать ничего не нужно.

## 5. Сборка

```bash
npm run build
```
Прожорлива по памяти — поэтому и нужен swap. Если коробка всё равно не тянет — собрать на другой машине и скопировать папку `.next/` на сервер.

## 6. Запуск

В проекте включён `output: "standalone"` (минимальный самодостаточный сервер). После сборки скопировать нужные standalone-серверу ассеты и запустить его:

```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env .next/standalone/.env
cp -r prisma .next/standalone/prisma   # файл SQLite + схема для Prisma в рантайме

PORT=3000 node .next/standalone/server.js
```

**Проще (но чуть больше RAM/диска, без шагов копирования):** `npm start` — запускает `next start` на порту 3000, `.env` читается автоматически.

## 7. Держать запущенным (пример на pm2)

```bash
npm i -g pm2
pm2 start .next/standalone/server.js --name cleaning --update-env
pm2 save
pm2 startup   # выполнить напечатанную команду, чтобы включить автозапуск при перезагрузке
```
(или systemd-сервис с `EnvironmentFile=/путь/.env`).

## 8. Реверс-прокси + HTTPS

Поставить впереди nginx/Caddy, проксирующий `:80/:443` → `127.0.0.1:3000`, и терминировать TLS там же. Это заодно снимает раздачу статики с Node. Направить DNS домена на сервер и указать `SITE_URL` = этот домен.

## Заметки / подводные камни

- **Telegram-бот**: стартует автоматически при загрузке сервера, если задан `TELEGRAM_BOT_TOKEN` (long-polling, см. `instrumentation.ts`). Запускать **только один** экземпляр — два процесса с одним токеном конфликтуют.
- **Аватар/имя бота**: ставятся через @BotFather (`/setuserpic`, `/setname`) — из кода это сделать нельзя.
- **SITE_URL** на проде должен быть реальным доменом, иначе ссылки в sitemap/robots/Telegram будут вести на localhost.
- **Никогда не коммитить `.env` и `prisma/*.db`** — оба намеренно в gitignore (секреты и данные).
