# Use Node.js official image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the root folder
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the consumer application code
COPY ./consumer /app/consumer

# Copy the models folder into the container so that the consumer can use it
COPY ./models /app/models

# Expose the port for the app (optional)
EXPOSE 3001

# Start the consumer application
CMD ["node", "consumer/index.js"]
