# MIT3

Базовый PWA-проект на Next.js, TypeScript, Tailwind CSS, tRPC, Prisma и PostgreSQL.

## Запуск

Требуются Node.js 22+ и Docker.

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Откройте http://localhost:3000.

## Проверки

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Деплой на VPS

Workflow `.github/workflows/deploy.yml` собирает образ, публикует его в GHCR и запускает на VPS.
В GitHub Actions Secrets нужны `SERVER_HOST`, `SSH_PRIVATE_KEY` и `DATABASE_URL`.

## Структура

- `src/app` - Next.js App Router и страницы;
- `src/server/api` - tRPC router и процедуры;
- `src/server/db.ts` - Prisma Client с PostgreSQL adapter;
- `prisma` - схема, конфигурация и seed;
- `public/sw.js` - минимальный service worker PWA.
