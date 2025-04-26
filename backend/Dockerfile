# Dockerfile for backend
# Define a valid default value for the ARG NODE_IMAGE
ARG NODE_IMAGE=node:20.18.2

# Use the ARG in the FROM instruction
FROM ${NODE_IMAGE}

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
