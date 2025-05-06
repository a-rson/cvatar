FROM node:22

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Expose the backend port
EXPOSE 3001

# Run in dev mode with nodemon
CMD ["npm", "run", "dev"]
