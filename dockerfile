# Use an official Node.js runtime as a parent image
# Using alpine for a smaller image size
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock, etc.)
# This step is cached, so 'npm install' only runs when dependencies change
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Vite's dev server runs on port 5173 by default
EXPOSE 5173

# The command to start the Vite development server
# The '--host' flag is crucial to expose the server outside the container
CMD ["npm", "run", "dev", "--", "--host"]


