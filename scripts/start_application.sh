#!/bin/bash
set -e

echo "Running ApplicationStart hook..."

# Change to application directory
cd /home/ec2-user/app

# Stop and remove any existing containers
echo "Cleaning up old containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down || true

# Build containers
echo "Building Docker containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start containers
echo "Starting Docker containers..."
if ! docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d; then
    echo "ERROR: Failed to start containers"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
    exit 1
fi

# Wait for services to be healthy
echo "Waiting for services to become healthy..."
sleep 30

# Check if containers are running
if ! docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "ERROR: Containers failed to start properly"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
    exit 1
fi

echo "ApplicationStart hook completed successfully."
