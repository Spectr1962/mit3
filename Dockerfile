##### ЭТАП 1: Инициализация окружения и скачивание npm-пакетов #####
FROM node:20-alpine AS deps
# Установка libc6-compat обязательна для бинарников Prisma в Alpine Linux
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем ключи кэширования пакетов для Docker
COPY package.json package-lock.json ./
# Бережно переносим всю папку prisma (со схемой и новым конфигурационным файлом)
COPY prisma ./prisma/

# Вшиваем временную строку подключения для прохождения WASM-валидации Prisma v7 при сборке
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
# Отключаем валидацию переменных среды T3-env на этапе компиляции докера
ENV SKIP_ENV_VALIDATION=1

# Чистая и строгая установка всех зависимостей проекта
RUN npm ci
##### ЭТАП 2: Генерация типов базы данных и перенос исходного кода #####
FROM node:20-alpine AS builder
WORKDIR /app

# Переносим установленные node_modules и схему Prisma из предыдущего слоя
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Продублируем переменные сборки для стабильности компилятора Next.js
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_TELEMETRY_DISABLED=1

# Запуск генерации типов Prisma Client перед началом компиляции кода
RUN npx prisma generate

# Продолжение ЭТАПА 2: Сборка статических и standalone-файлов приложения
RUN npm run build

# Если в вашем package.json команда build не включает prisma generate, 
# то финал сборки выглядит как: RUN npx prisma generate && npm run build

# Очищаем dev-зависимости, оставляя в node_modules только продакшн-пакеты
RUN npm prune --production

##### ЭТАП 3: Минимальный изолированный образ для запуска на сервере #####
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем системную группу и пользователя для защиты от root-уязвимостей
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только те легковесные результаты, которые нужны для работы Next.js Standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# Nodemailer is imported by Auth.js at runtime but may be omitted by standalone tracing.
COPY --from=builder /app/node_modules/nodemailer ./node_modules/nodemailer

# Переключаем управление на безопасного пользователя
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Команда запуска автономного нод-сервера вашего PWA приложения
CMD ["node", "server.js"]

