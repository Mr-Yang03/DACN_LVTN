# Stage 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:23-alpine AS runner

WORKDIR /app

# Chỉ copy những gì cần thiết cho production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

ENV NODE_ENV=production

CMD ["npm", "start"]
