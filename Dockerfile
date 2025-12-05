# Build stage for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy client source
COPY client/ ./

# Build the frontend (static export)
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy server source
COPY server/ ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/client/out ./public

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["node", "server.js"]
