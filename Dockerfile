# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build Next.js
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create config directory for volume mount
RUN mkdir -p /app/config && chown -R nextjs:nodejs /app/config

# Copy default config
COPY --from=builder /app/config ./config

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Environment variables (set at runtime)
# LITELLM_URL=http://localhost:4000
# LITELLM_MASTER_KEY=your-key
# LITELLM_UI_USERNAME=admin
# LITELLM_UI_PASSWORD=your-password

CMD ["node", "server.js"]
