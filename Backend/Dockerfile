# Use the official Node.js image as the base image
FROM node:17-alpine3.12

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Command to start your Node.js app
CMD ["node", "server.js"]