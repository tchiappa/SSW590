#!/bin/bash
set -e

echo "Running AfterInstall hook..."

# Change to application directory
cd /home/ec2-user/app

# Ensure proper permissions
chown -R ec2-user:ec2-user /home/ec2-user/app
chmod +x /home/ec2-user/app/scripts/*.sh

echo "AfterInstall hook completed successfully."
