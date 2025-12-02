#!/bin/bash
set -e

echo "Running ApplicationStop hook..."

# Change to application directory
cd /home/ec2-user/app || {
    echo "Application directory does not exist yet. Skipping stop."
    exit 0
}

# Stop and remove existing containers if docker-compose.yml exists
if [ -f "docker-compose.yml" ]; then
    echo "Stopping existing containers..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml down || true
    
    # Remove dangling images to free up space
    echo "Cleaning up dangling Docker images..."
    docker image prune -f || true
else
    echo "No docker-compose.yml found. Skipping container stop."
fi

echo "ApplicationStop hook completed successfully."
