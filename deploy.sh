#!/bin/bash
set -e  # Exit on any error

echo "Starting deployment..."

# Clean up Docker system
echo "Cleaning up Docker system..."
docker system prune -af --volumes  # Remove all unused containers, networks, images and volumes


# Pull latest changes
git pull

# Export environment variables from server/.env
echo "Loading environment variables from server/.env..."
if [ -f "server/.env" ]; then
    # Read each line from .env file, ignore comments and empty lines
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip comments and empty lines
        if [[ $line =~ ^[^#].+=.+ ]]; then
            # Remove any surrounding quotes and export the variable
            eval "export $line"
        fi
    done < "server/.env"
else
    echo "Error: server/.env file not found!"
    exit 1
fi

# Build and start containers
docker-compose build
docker-compose up -d

# Clean up old images
docker image prune -f

echo "Deployment complete! If you see any errors above, please investigate."
