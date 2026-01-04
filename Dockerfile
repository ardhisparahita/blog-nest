FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Tahap Production ---
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 8000

CMD ["node", "dist/src/main.js"]