# ---------------------------
# Stage 1: Base
# ---------------------------
FROM node:20-alpine AS base
WORKDIR /app
# Ensure local binaries (e.g. from node_modules/.bin) are in PATH
ENV PATH=/app/node_modules/.bin:$PATH

# ---------------------------
# Stage 2: Builder
# ---------------------------
FROM base AS builder

# Copy the monorepo directories into the image
COPY server ./server
COPY client ./client

#############################
# Build the Client
#############################
WORKDIR /app/client
RUN npm install
RUN npm run build
# At this point, the Vite build outputs are in /app/client/dist

#############################
# Prepare the Server Build
#############################
WORKDIR /app/server
# Copy the built client files into the server's public folder
RUN mkdir -p public && cp -R ../client/dist/* public/
# Install server dependencies and build (e.g. transpile TypeScript)
RUN npm install
RUN npm run build

# ---------------------------
# Stage 3: Production
# ---------------------------
FROM node:20-alpine AS production
WORKDIR /app/server
# Copy the built server (including the public folder with client assets) from the builder stage
COPY --from=builder /app/server . 
# Expose the port
EXPOSE 3030
# Run the application
CMD ["npm", "start"]

# ---------------------------
# Stage 4: Development
# ---------------------------
FROM base AS development
WORKDIR /app
# Copy the full source code for live development
COPY server ./server
COPY client ./client

# Install dependencies for both server and client
RUN cd client && npm install
RUN cd server && npm install

# Expose ports for the Express server and Vite dev server
EXPOSE 3030
EXPOSE 5173

# In development you might run both the server and client concurrently.
# For example, if you have a custom "dev" script in your root package (using concurrently or similar),
# you can use that command here. Otherwise, you can adjust to start just one process.
CMD ["npm", "run", "dev"]