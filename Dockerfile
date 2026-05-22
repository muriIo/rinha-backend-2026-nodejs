# Use the official Node.js LTS image on Alpine for a smaller footprint
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application source
COPY . .

# Expose the port your server listens on (change if needed)
EXPOSE 3000

# Run the app
CMD ["node", "src/index.ts"]