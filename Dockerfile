# Stage 1 — Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Stage 2 — Production
FROM node:18-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

EXPOSE 3000
CMD ["npm", "start"]
