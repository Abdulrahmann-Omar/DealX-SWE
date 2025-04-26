# Dockerfile for frontend
# Define a valid default value for the ARG NODE_IMAGE
ARG NODE_IMAGE=node:20.18.2

# Use the ARG in the FROM instruction
FROM ${NODE_IMAGE}

# Set the working directory
WORKDIR /frontend

# Install dependencies
COPY frontend/package.json ./
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Install a web server to serve the frontend (e.g., serve)
RUN npm install -g serve

# Expose the frontend port
EXPOSE 3000

# Start the web server
CMD ["serve", "-s", "build", "-l", "3000"]
