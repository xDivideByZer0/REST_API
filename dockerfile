# Use LTS Node
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Set the environment port (required by App Runner)
ENV PORT=8080

# Expose the port App Runner expects
EXPOSE 8080

# Start your Node server
CMD ["npm", "start"]
