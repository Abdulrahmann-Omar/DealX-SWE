# /backend/Dockerfile

# Use a specific Node.js LTS version on Alpine Linux for a smaller image
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies stage
FROM base AS deps
# Copy package files
COPY package.json package-lock.json* ./
# Install production dependencies using npm ci for reproducibility
# Ensure NODE_ENV is set if scripts behave differently in prod
RUN npm ci --only=production

# Runner stage
FROM base AS runner
# Set working directory
WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Change ownership of the app directory
# We will copy files first, then change ownership

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY . .

# Ensure the app directory and its contents are owned by the app user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the application port (as seen in server.js)
EXPOSE 5000

# Define the command to run the application using the start script from package.json
CMD ["npm", "start"]
