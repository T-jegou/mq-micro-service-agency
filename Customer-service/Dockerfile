FROM node:16

# Specify the working directory INSIDE the container
WORKDIR /usr/src/app

# Move the package.json and package-lock.json into the container to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the port
EXPOSE 3000

# Start the node server
CMD ["npm", "start"]