# Specify the base image for the backend
FROM node:14 as backend

# Set the working directory for the backend
WORKDIR /app

# Copy the backend code into the container
COPY ./backend/ .

# Install backend dependencies and build the backend (adjust based on your backend)
RUN npm install

# Expose the backend port (e.g., 5000 or whatever your app uses)
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]

# Specify the base image for the frontend
FROM node:14 as frontend

# Set the working directory for the frontend
WORKDIR /app

# Copy the frontend code into the container
COPY ./frontend/ .

# Install frontend dependencies and build the frontend
RUN npm install && npm run build

# Expose the frontend port (e.g., 3000)
EXPOSE 3000

# Serve the frontend
CMD ["npm", "start"]
