# =====================
# Stage 1: Build
# =====================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies including devDependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript
RUN npm run build

# =====================
# Stage 2: Production
# =====================
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy built code + production node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose port
EXPOSE 8000

# Run NestJS production
CMD ["node", "dist/src/main.js"]
