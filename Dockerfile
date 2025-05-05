# Dockerfile

# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables if needed (optional)
# ARG NEXT_PUBLIC_VARIABLE
# ENV NEXT_PUBLIC_VARIABLE=${NEXT_PUBLIC_VARIABLE}

# Build the application
RUN pnpm build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

# Set runtime environment variables
# These should be passed via docker run -e or docker-compose environment section
ENV NODE_ENV=production
# Set default port if not provided by environment
ENV PORT=9002

COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 9002

# Run the application
CMD ["node", "server.js"]
