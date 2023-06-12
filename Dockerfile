FROM node:18-alpine AS base

ARG ARKE_SERVER_SSR_URL="http://host.docker.internal:4000/lib"
ARG ARKE_SERVER_URL="http://0.0.0.0:4000/lib"
ARG NEXTAUTH_URL="http://localhost:3100/api/auth"
ARG PROJECT_ID

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
RUN apk add openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build .env file
RUN echo NEXTAUTH_SECRET=\" | tr -d '\n' > .env.production \
    && openssl rand -base64 32 | tr -d '\n' >> .env.production \
    && echo \" >> .env.production \
    && echo NEXT_PUBLIC_ARKE_SERVER_URL= | tr -d '\n' >> .env.production \
    && echo $ARKE_SERVER_URL >> .env.production \
    && echo NEXT_PUBLIC_ARKE_SERVER_SSR_URL= | tr -d '\n' >> .env.production \
    && echo $ARKE_SERVER_SSR_URL >> .env.production \
    && echo NEXTAUTH_URL= | tr -d '\n' >> .env.production \
    && echo $NEXTAUTH_URL >> .env.production

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3100

ENV PORT 3100

CMD ["node", "server.js"]
