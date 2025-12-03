#!/bin/bash
set -e

echo "Running AfterInstall hook..."

# Change to application directory
cd /home/ec2-user/app

# Permissions are handled by appspec.yml
# Add any post-installation tasks here if needed

echo "AfterInstall hook completed successfully."
