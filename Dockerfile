# Use the official lightweight Node.js 20 image.
# https://hub.docker.com/_/node
FROM node:20-alpine AS base

# Set the working directory in the container to /app
WORKDIR /app

# Install node modules using npm (instead of pnpm)
# First, only copy package.json and package-lock.json (if available)
COPY package*.json ./

# Use npm ci for potentially faster and more reliable installs in CI/CD
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build


# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Copy built assets from the 'base' stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Expose the port the app runs on (make sure it matches docker-compose.yml and dev script if needed)
EXPOSE 9002

# Define the command to run the app
# Use the PORT environment variable provided by docker-compose.yml or default to 9002
ENV PORT 9002
CMD ["node", "server.js"]
