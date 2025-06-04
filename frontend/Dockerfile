# /frontend/Dockerfile

# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json and potentially package-lock.json if it exists
COPY package.json package-lock.json* ./

# Install dependencies - Use npm install as package-lock.json might be missing
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the API URL environment variable during build time (optional, can be set at runtime too)
# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the React application for production
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:stable-alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage to the Nginx web root directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
