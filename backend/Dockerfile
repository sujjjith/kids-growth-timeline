# Stage 1: Install dependencies & build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only backend package.json (standalone, no workspace)
COPY package.json ./

# Install deps from public npm registry
RUN npm install --registry https://registry.npmjs.org/

# Copy source
COPY . .

# Build
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy built output and deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nestjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/main"]
