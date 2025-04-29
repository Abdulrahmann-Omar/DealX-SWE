# Use an official Node.js runtime as a parent image
FROM node:22.11

# Set the working directory in the container
WORKDIR /app

# Copy the backend code into the container
COPY backend ./backend

# Install backend dependencies
RUN cd backend && npm install

# Copy the frontend build files into the container
COPY frontend/build ./frontend/build

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "backend/src/server.js"]