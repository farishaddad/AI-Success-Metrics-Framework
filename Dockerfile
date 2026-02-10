# Multi-stage build for production

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm ci --only=production

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-build

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source
COPY server/ ./

# Stage 3: Production image
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy backend from build stage
COPY --from=backend-build --chown=nodejs:nodejs /app/server ./server

# Copy frontend build from build stage
COPY --from=frontend-build --chown=nodejs:nodejs /app/dist ./dist

# Create necessary directories
RUN mkdir -p /app/server/database /app/server/logs && \
    chown -R nodejs:nodejs /app/server/database /app/server/logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start server
CMD ["node", "server/server-production.js"]
