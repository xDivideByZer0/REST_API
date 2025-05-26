# Use LTS Node
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first to optimize Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Set the environment port (required by App Runner)
ENV PORT=8080

# Expose the port App Runner expects
EXPOSE 8080

# Start your Node server
CMD ["npm", "start"]
