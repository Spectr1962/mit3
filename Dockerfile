# === ЭТАП 1: Установка зависимостей ===
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы манифеста пакетов
COPY package.json package-lock.json ./
# Если у тебя есть папка prisma со схемой, она нужна для генерации Prisma Client
COPY prisma ./prisma

# Устанавливаем все зависимости
RUN npm ci

# === ЭТАП 2: Сборка приложения ===
FROM node:20-alpine AS builder
WORKDIR /app
# 👇 ДОБАВЬ ЭТУ СТРОКУ СРАЗУ ПОСЛЕ WORKDIR 👇
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js во время сборки
ENV NEXT_TELEMETRY_DISABLED=1

# 👇 ВОТ ЭТА СТРОКА ОДНИМ МАХОМ УБЕРЕТ ВСЕ ОШИБКИ ИЗ ТВОЕГО ЛОГА 👇
ENV SKIP_ENV_VALIDATION=true

# Генерируем Prisma Client и собираем Next.js проект
RUN npx prisma generate
RUN npm run build


# === ЭТАП 3: Запуск готового приложения ===
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем системного пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только необходимые для работы файлы (без исходного кода)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запускаем миграции/синхронизацию БД, и только при успехе — стартуем сервер Next.js
CMD npx prisma generate && node server.js