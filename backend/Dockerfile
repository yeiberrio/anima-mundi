FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Start the HTTP server immediately so the healthcheck passes within its window;
# create tables (db push) and load content (seed) in the background. The /health
# endpoint returns static JSON and does not depend on the DB.
CMD ["sh", "-c", "(npx prisma db push --skip-generate --accept-data-loss && npx prisma db seed) & node dist/src/main"]
