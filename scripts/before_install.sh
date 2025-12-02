#!/bin/bash
set -e

echo "Running BeforeInstall hook..."

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    yum update -y
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    usermod -a -G docker ec2-user
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
fi

# Ensure Docker service is running
systemctl start docker
systemctl enable docker

# Install CodeDeploy agent if not already installed
if ! systemctl is-active --quiet codedeploy-agent; then
    echo "Installing CodeDeploy agent..."
    yum install -y ruby wget
    cd /home/ec2-user
    wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
    chmod +x ./install
    ./install auto
    systemctl start codedeploy-agent
    systemctl enable codedeploy-agent
fi

echo "BeforeInstall hook completed successfully."
