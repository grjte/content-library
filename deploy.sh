#!/bin/bash
set -e  # Exit on any error

echo "Starting deployment..."

# Pull latest changes
git pull

# Build and start containers
docker-compose build
docker-compose up -d

# Clean up old images
docker image prune -f

echo "Deployment complete! If you see any errors above, please investigate."