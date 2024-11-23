# Use Node.js official image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the root folder
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./producer /app/producer

# Expose the port for the app (optional if your producer listens on a port)
EXPOSE 3000

# Start the producer application
CMD ["node", "producer/index.js"]
