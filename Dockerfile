# Step 1: Use the official Node.js image as the base image
FROM node:16-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Expose the port the application will run on
EXPOSE 3000

# Step 7: Define the environment variables (optional, can also be set in a .env file)
ENV NODE_ENV=production

# Step 8: Build the application
RUN npm run build

# Step 9: Start the application
CMD ["npm", "run", "start:prod"]