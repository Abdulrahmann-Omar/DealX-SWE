# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the React frontend
RUN npm run build --prefix frontend

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "backend/src/server.js"]