# AWS Deployment Quick Reference Card

## 🚀 Deployment Flow

```
PR → Tests Pass → Merge to main → CodePipeline → CodeDeploy → EC2 → Live
```

## 📋 Essential Commands

### On EC2 Instance

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@<EC2-PUBLIC-IP>

# Check deployment status
sudo systemctl status codedeploy-agent
docker ps

# View application logs
cd /home/ec2-user/app
docker-compose -f docker-compose.prod.yml logs -f

# Restart application
docker-compose -f docker-compose.prod.yml restart

# Full redeploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Check health
curl http://localhost:80/health
```

### Troubleshooting

```bash
# CodeDeploy logs
sudo tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log

# Docker logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend

# Clean up Docker
docker system prune -a

# Fix permissions
sudo chown -R ec2-user:ec2-user /home/ec2-user/app
chmod +x /home/ec2-user/app/scripts/*.sh
```

## 🔗 Important URLs

### AWS Console
- **CodePipeline**: https://console.aws.amazon.com/codesuite/codepipeline/pipelines
- **CodeDeploy**: https://console.aws.amazon.com/codesuite/codedeploy/applications
- **EC2**: https://console.aws.amazon.com/ec2/
- **CloudWatch Logs**: https://console.aws.amazon.com/cloudwatch/

### Application
- **Frontend**: http://YOUR-EC2-IP
- **Grafana**: http://YOUR-EC2-IP:4000

## 📁 Key Files

| File | Purpose |
|------|---------|
| `appspec.yml` | CodeDeploy configuration |
| `docker-compose.prod.yml` | Production containers |
| `scripts/*.sh` | Deployment lifecycle hooks |
| `backend/Dockerfile.prod` | Backend production image |
| `frontend/Dockerfile.prod` | Frontend production image |

## 🔐 IAM Roles

| Role | Used By | Policies |
|------|---------|----------|
| CodeDeployServiceRole | CodeDeploy | AWSCodeDeployRole |
| EC2CodeDeployRole | EC2 Instance | AmazonEC2RoleforAWSCodeDeploy, AmazonSSMManagedInstanceCore |
| CodePipelineServiceRole | CodePipeline | AWSCodePipelineServiceRole |

## 🏷️ EC2 Tags

```
Name: SSW590-Staging
Environment: Staging
Application: SSW590-App
```

## 🔒 Security Groups

| Port | Service | Source |
|------|---------|--------|
| 22 | SSH | Your IP |
| 80 | Frontend | 0.0.0.0/0 |
| 4000 | Grafana | 0.0.0.0/0 |

## 🔄 Deployment Lifecycle

1. **ApplicationStop** → Stop old containers
2. **BeforeInstall** → Install dependencies
3. **AfterInstall** → Setup environment
4. **ApplicationStart** → Start new containers
5. **ValidateService** → Health checks

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| CodeDeploy agent not running | `sudo systemctl start codedeploy-agent` |
| Containers won't start | Check logs: `docker-compose logs` |
| Permission denied | `sudo chown -R ec2-user:ec2-user /home/ec2-user/app` |
| Port already in use | `docker-compose down` then `up -d` |
| Health check fails | Verify services: `docker ps` and `curl localhost/health` |

## 💰 Cost Estimate

| Resource | Monthly Cost |
|----------|--------------|
| t3.medium EC2 (24/7) | ~$30 |
| 30 GB Storage | ~$2.40 |
| Data Transfer | ~$0.90 |
| **Total** | **~$33** |

## 📚 Documentation

- **Full Guide**: [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) - Complete setup and troubleshooting

## 🆘 Emergency Procedures

### Rollback Deployment
1. Go to CodeDeploy Console
2. Select failed deployment
3. Click "Stop and rollback"

### Manual Rollback
```bash
ssh ec2-user@<EC2-IP>
cd /home/ec2-user/app
git checkout <previous-commit>
docker-compose -f docker-compose.prod.yml up -d --build
```

### Stop Application
```bash
docker-compose -f docker-compose.prod.yml down
```

### Check System Resources
```bash
htop  # CPU/Memory
df -h  # Disk space
docker system df  # Docker disk usage
```

## 📞 Support

- **AWS Support**: https://console.aws.amazon.com/support/
- **GitHub Issues**: https://github.com/tchiappa/SSW590/issues
- **Documentation**: See links above

---

**Print this page and keep it handy during deployment!**
