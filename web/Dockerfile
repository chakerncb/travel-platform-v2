FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
