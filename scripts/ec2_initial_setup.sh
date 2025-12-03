#!/bin/bash
# EC2 Initial Setup Script
# Run this script on a fresh Amazon Linux 2023 or Amazon Linux 2 EC2 instance
# Usage: curl -O https://raw.githubusercontent.com/tchiappa/SSW590/main/scripts/ec2_initial_setup.sh && chmod +x ec2_initial_setup.sh && sudo ./ec2_initial_setup.sh

set -e

echo "=========================================="
echo "SSW590 EC2 Initial Setup"
echo "=========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Update system packages
echo "Updating system packages..."
yum update -y

# Install Docker
echo "Installing Docker..."
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Install Docker Buildx
echo "Installing Docker Buildx..."
BUILDX_VERSION=$(curl -s https://api.github.com/repos/docker/buildx/releases/latest | grep 'tag_name' | cut -d\" -f4)
mkdir -p /usr/local/lib/docker/cli-plugins
curl -L "https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-amd64" -o /usr/local/lib/docker/cli-plugins/docker-buildx
chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

# Install CodeDeploy agent
echo "Installing CodeDeploy agent..."
yum install -y ruby

# Detect region from availability zone
AVAIL_ZONE=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
REGION=${AVAIL_ZONE:0:-1}
echo "Detected region: $REGION"

cd /home/ec2-user
wget https://aws-codedeploy-${REGION}.s3.${REGION}.amazonaws.com/latest/install
chmod +x ./install
./install auto

# Start and enable CodeDeploy agent
systemctl start codedeploy-agent
systemctl enable codedeploy-agent

# Install useful tools
echo "Installing additional tools..."
yum install -y git htop curl wget

# Create application directory
echo "Creating application directory..."
mkdir -p /home/ec2-user/app
chown -R ec2-user:ec2-user /home/ec2-user/app

# Configure firewall (if firewalld is running)
if systemctl is-active --quiet firewalld; then
    echo "Configuring firewall..."
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=3000/tcp
    firewall-cmd --permanent --add-port=4000/tcp
    firewall-cmd --reload
fi

# Verify installations
echo ""
echo "=========================================="
echo "Verifying installations..."
echo "=========================================="
echo "Docker version:"
docker --version
echo ""
echo "Docker Compose version:"
docker-compose --version
echo ""
echo "CodeDeploy agent status:"
systemctl status codedeploy-agent --no-pager
echo ""

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Log out and log back in for Docker group changes to take effect"
echo "2. Verify Docker works without sudo: docker ps"
echo "3. Continue with AWS CodeDeploy setup in AWS Console"
echo ""
echo "Useful commands:"
echo "  - Check CodeDeploy logs: sudo tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log"
echo "  - Check Docker containers: docker ps"
echo "  - View application logs: cd /home/ec2-user/app && docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
echo ""
