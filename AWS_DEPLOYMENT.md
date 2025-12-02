# AWS Deployment Guide

Complete guide for setting up continuous deployment from GitHub to AWS EC2 using CodePipeline and CodeDeploy.

> **Quick Reference**: For commands and troubleshooting, see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

## Table of Contents
- [Overview](#overview)
- [Quick Setup (30 min)](#quick-setup-30-min)
- [Detailed Setup](#detailed-setup)
- [Monitoring & Troubleshooting](#monitoring--troubleshooting)
- [Next Steps](#next-steps)

---

## Overview

### What This Sets Up

Continuous deployment pipeline that automatically deploys to EC2 when code is merged to `main`, while preserving your existing GitHub Actions testing workflow.

**Deployment Flow:**
```
PR → Tests (GitHub Actions) → Merge to main → CodePipeline → CodeDeploy → EC2 → Live
```

### Architecture

**EC2 Instance** (t3.medium recommended)
- Port 80 → Frontend (Nginx)
- Port 3000 → Backend (Express.js)
- Port 4000 → Grafana (Monitoring)
- Internal: MySQL, MongoDB, Prometheus, cAdvisor

### Prerequisites
- [ ] AWS Account with admin access
- [ ] GitHub repository access
- [ ] SSH key pair for EC2 access

### Cost Estimate
- **EC2 t3.medium (24/7)**: ~$30/month
- **Storage (30 GB)**: ~$2.40/month
- **Data Transfer**: ~$0.90/month
- **Total**: **~$33/month**

---

## Quick Setup (30 min)

### 1. Create IAM Roles (5 min)

Create three roles in **IAM Console** → **Roles** → **Create Role**:

#### CodeDeployServiceRole
- **Service**: CodeDeploy
- **Policy**: `AWSCodeDeployRole` (auto-attached)

#### EC2CodeDeployRole
- **Service**: EC2
- **Policies**: 
  - `AmazonEC2RoleforAWSCodeDeploy`
  - `AmazonSSMManagedInstanceCore`

#### CodePipelineServiceRole
- **Service**: CodePipeline
- **Policy**: Auto-generated during pipeline creation

### 2. Launch EC2 Instance (10 min)

**EC2 Console** → **Launch Instance**:

```
Name: SSW590-Staging
AMI: Amazon Linux 2023
Instance Type: t3.medium
Storage: 30 GB gp3
IAM Role: EC2CodeDeployRole

Security Group:
  - SSH (22) - Your IP only
  - HTTP (80) - 0.0.0.0/0
  - TCP (3000) - 0.0.0.0/0
  - TCP (4000) - 0.0.0.0/0

Tags:
  - Name: SSW590-Staging
  - Environment: Staging
  - Application: SSW590
```

### 3. Setup CodeDeploy (5 min)

**CodeDeploy Console** → **Create Application**:

```
Application Name: SSW590-App
Compute Platform: EC2/On-premises
```

**Create Deployment Group**:
```
Name: SSW590-Staging-DeploymentGroup
Service Role: CodeDeployServiceRole
Deployment Type: In-place
Environment: EC2 instances with tag Environment=Staging
Deployment Config: CodeDeployDefault.AllAtOnce
```

### 4. Setup CodePipeline (10 min)

**CodePipeline Console** → **Create Pipeline**:

```
Pipeline Name: SSW590-Pipeline
Service Role: New service role (or CodePipelineServiceRole)

Source Stage:
  - Provider: GitHub (Version 2)
  - Repository: tchiappa/SSW590
  - Branch: main
  - Change detection: CloudWatch Events

Build Stage:
  - Skip this stage

Deploy Stage:
  - Provider: AWS CodeDeploy
  - Application: SSW590-App
  - Deployment Group: SSW590-Staging-DeploymentGroup
```

### 5. Verify Deployment (5 min)

1. Pipeline will auto-trigger on creation
2. Monitor in **CodePipeline Console**
3. Once complete, access:
   - Frontend: `http://<EC2-PUBLIC-IP>`
   - Backend: `http://<EC2-PUBLIC-IP>:3000`
   - Grafana: `http://<EC2-PUBLIC-IP>:4000`

**Verification Commands** (SSH into EC2):
```bash
ssh -i your-key.pem ec2-user@<EC2-PUBLIC-IP>

# Check services
docker ps
curl http://localhost:80/health
curl http://localhost:3000/health
```

---

## Detailed Setup

### EC2 Instance Configuration

#### Initial Setup Script

SSH into your EC2 instance and run:

```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/tchiappa/SSW590/main/scripts/ec2_initial_setup.sh
chmod +x ec2_initial_setup.sh
sudo ./ec2_initial_setup.sh
```

This script installs:
- Docker and Docker Compose
- CodeDeploy agent
- Required system packages

#### Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install CodeDeploy agent
sudo yum install -y ruby wget
cd /home/ec2-user
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
wget https://aws-codedeploy-${REGION}.s3.${REGION}.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo systemctl start codedeploy-agent
sudo systemctl enable codedeploy-agent
```

### Environment Variables

Create `.env` file on EC2 (not in git):

```bash
ssh ec2-user@<EC2-IP>
cd /home/ec2-user/app
nano .env
```

Add:
```bash
# Database Configuration
MYSQL_ROOT_PASSWORD=YourSecurePassword123!
MYSQL_DATABASE=ssw590
MYSQL_USER=express
MYSQL_PASSWORD=YourExpressPassword123!

# MongoDB Configuration
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=YourMongoPassword123!

# Grafana Configuration
GRAFANA_PASSWORD=YourGrafanaPassword123!

# Application Configuration
NODE_ENV=production
```

**Important**: Change all passwords from defaults!

### GitHub Connection

1. **CodePipeline Console** → **Settings** → **Connections**
2. Find your GitHub connection
3. If status is "Pending", click **Update pending connection**
4. Authorize AWS to access your GitHub account
5. Verify webhook created in GitHub repo settings

### Deployment Lifecycle

The deployment follows these hooks (defined in `appspec.yml`):

1. **ApplicationStop** (`scripts/stop_application.sh`)
   - Stops running Docker containers
   - Cleans up old images

2. **BeforeInstall** (`scripts/before_install.sh`)
   - Installs Docker, Docker Compose, CodeDeploy agent
   - Ensures services are running

3. **AfterInstall** (`scripts/after_install.sh`)
   - Creates `.env` file if missing
   - Sets proper permissions

4. **ApplicationStart** (`scripts/start_application.sh`)
   - Builds and starts Docker containers
   - Waits for services to be ready

5. **ValidateService** (`scripts/validate_service.sh`)
   - Checks all containers are running
   - Validates health endpoints

---

## Monitoring & Troubleshooting

### View Logs

**On EC2 Instance:**
```bash
# CodeDeploy agent logs
sudo tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log

# Deployment logs
sudo tail -f /opt/codedeploy-agent/deployment-root/deployment-logs/codedeploy-agent-deployments.log

# Application logs
cd /home/ec2-user/app
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

**In AWS Console:**
- **CloudWatch Logs**: `/aws/codedeploy/SSW590-App`
- **CodePipeline**: View pipeline execution history
- **CodeDeploy**: View deployment details and logs

### Common Issues

| Issue | Solution |
|-------|----------|
| CodeDeploy agent not running | `sudo systemctl start codedeploy-agent` |
| Docker not running | `sudo systemctl start docker` |
| Permission denied | `sudo chown -R ec2-user:ec2-user /home/ec2-user/app` |
| Containers won't start | Check logs: `docker-compose -f docker-compose.prod.yml logs` |
| Health check fails | Verify: `docker ps` and `curl localhost/health` |
| Port already in use | `docker-compose -f docker-compose.prod.yml down` |

### Rollback Deployment

**Via AWS Console:**
1. Go to **CodeDeploy Console**
2. Select the failed deployment
3. Click **Stop and rollback**

**Manual Rollback:**
```bash
ssh ec2-user@<EC2-IP>
cd /home/ec2-user/app
docker-compose -f docker-compose.prod.yml down
# Optionally checkout previous commit
docker-compose -f docker-compose.prod.yml up -d --build
```

### Health Checks

Test endpoints:
```bash
# Frontend
curl http://localhost:80/health

# Backend
curl http://localhost:3000/health

# Grafana
curl http://localhost:4000/api/health
```

### System Resources

```bash
# CPU/Memory
htop

# Disk space
df -h

# Docker disk usage
docker system df

# Clean up Docker
docker system prune -a
```

---

## Next Steps

### Immediate (Security)
- [ ] Change all default passwords in `.env`
- [ ] Restrict SSH to your IP only
- [ ] Review IAM policies for least privilege
- [ ] Enable MFA on AWS account

### Short Term (Recommended)
- [ ] Set up HTTPS with Application Load Balancer + ACM
- [ ] Configure CloudWatch alarms:
  - High CPU/Memory usage
  - Failed deployments
  - Application errors
- [ ] Set up automated EBS snapshots
- [ ] Configure log retention policies

### Long Term (Optional)
- [ ] Implement blue/green deployments for zero downtime
- [ ] Set up Auto Scaling Group for high availability
- [ ] Add CDN (CloudFront) for static assets
- [ ] Move secrets to AWS Secrets Manager
- [ ] Configure WAF rules
- [ ] Set up multiple environments (staging, production)

### Testing Production Config Locally

Before deploying to AWS, test locally:

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check containers
docker-compose -f docker-compose.prod.yml ps

# Test endpoints
curl http://localhost:80/health
curl http://localhost:3000/health

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop containers
docker-compose -f docker-compose.prod.yml down
```

---

## Additional Resources

- **Quick Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Commands and troubleshooting
- **AWS CodeDeploy Docs**: https://docs.aws.amazon.com/codedeploy/
- **AWS CodePipeline Docs**: https://docs.aws.amazon.com/codepipeline/
- **Docker Compose Docs**: https://docs.docker.com/compose/

---

**Questions or Issues?** Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) or open a GitHub issue.
