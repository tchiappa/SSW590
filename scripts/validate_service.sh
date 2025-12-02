#!/bin/bash
set -e

echo "Running ValidateService hook..."

# Change to application directory
cd /home/ec2-user/app

# Function to check if a service is responding
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    echo "Checking $service_name at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s -o /dev/null "$url"; then
            echo "$service_name is responding successfully!"
            return 0
        fi
        
        echo "Attempt $attempt/$max_attempts: $service_name not ready yet..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "ERROR: $service_name failed to respond after $max_attempts attempts"
    return 1
}

# Verify all containers are running
echo "Verifying Docker containers..."
if ! docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "ERROR: Not all containers are running"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
    exit 1
fi

# Check frontend health
check_service "Frontend" "http://localhost:80/health"

# Check Grafana
check_service "Grafana" "http://localhost:4000/api/health" || {
    echo "WARNING: Grafana health check failed, but continuing..."
}

echo "ValidateService hook completed successfully!"
echo "Application is deployed and running."
