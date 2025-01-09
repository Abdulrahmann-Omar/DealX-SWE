# Dockerfile for backend
FROM node:latest

WORKDIR /backend

# Copy package.json and install dependencies
COPY backend/package.json ./
RUN npm install

# Copy the rest of the backend code
COPY backend/ ./

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
