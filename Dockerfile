##### ЭТАП 1: Установка зависимостей #####
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем только файлы манифестов для кэширования слоев Docker
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Чистая установка всех зависимостей (включая devDependencies для сборки)
RUN npm ci

##### ЭТАП 2: Генерация Prisma и сборка приложения #####
FROM node:20-alpine AS builder
WORKDIR /app

# Переносим установленные node_modules и файлы из предыдущего шага
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Объявляем аргументы сборки для валидатора t3-env
ARG DATABASE_URL
ARG AUTH_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG NEXTAUTH_URL

# Переводим аргументы в переменные окружения для процесса npm run build
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_TELEMETRY_DISABLED=1

# ПРИНУДИТЕЛЬНАЯ ГЕНЕРАЦИЯ КЛИЕНТА
RUN npx prisma generate

# Сборка Next.js приложения
RUN npm run build

##### ЭТАП 3: Финальный продакшн-образ #####
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем системного пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем собранный проект и необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Копируем собранный Next.js (standalone режим оптимизирует размер)
# Если у вас в next.config.js не настроен output: 'standalone', 
# то эти строки скопируют стандартную сборку:
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]