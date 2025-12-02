# SSW590
Class project for SSW590 - DevOps Principles and Practices.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Docker Compose Configuration](#docker-compose-configuration)
- [Managing Docker Containers](#managing-docker-containers)
- [Accessing Services](#accessing-services)
- [Running Commands in Containers](#running-commands-in-containers)
- [Stopping the Application](#stopping-the-application)
- [AWS Deployment](#aws-deployment)

## Prerequisites

Before you begin, ensure you have the following installed:

### Mac
1. **Docker Desktop for Mac**
   - Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Install and launch Docker Desktop
   - Verify installation by opening Terminal and running:
     ```bash
     docker --version
     docker compose version
     ```

2. **Git**
   - Usually pre-installed on Mac
   - Verify by running: `git --version`
   - If not installed, download from [https://git-scm.com/downloads](https://git-scm.com/downloads)

### Windows
1. **Docker Desktop for Windows**
   - Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Install and launch Docker Desktop
   - Ensure WSL 2 is enabled (Docker Desktop will prompt if needed)
   - Verify installation by opening PowerShell or Command Prompt and running:
     ```powershell
     docker --version
     docker compose version
     ```

2. **Git**
   - Download from [https://git-scm.com/downloads](https://git-scm.com/downloads)
   - Install with default settings
   - Verify by running: `git --version`

## Getting Started

### 1. Clone the Repository

**Mac (Terminal):**
```bash
cd ~/Documents  # or your preferred directory
git clone https://github.com/tchiappa/SSW590.git
cd SSW590
```

**Windows (PowerShell or Command Prompt):**
```powershell
cd C:\Users\YourUsername\Documents  # or your preferred directory
git clone https://github.com/tchiappa/SSW590.git
cd SSW590
```

### 2. Start the Application with Docker Compose

Make sure Docker Desktop is running, then execute:

**Development Mode (Mac/Windows):**
```bash
docker compose up -d
```

This automatically uses:
- `docker-compose.yml` (base configuration)
- `docker-compose.override.yml` (development overrides - auto-loaded)

**Production Mode (for deployment):**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

The `-d` flag runs containers in detached mode (background). On first run, this will:
- Download required Docker images
- Build the backend and frontend containers
- Create necessary volumes
- Start all services

**Note:** The initial build may take 5-10 minutes depending on your internet connection.

### 3. Verify Containers are Running

**Using Docker Desktop:**
- Open Docker Desktop
- Navigate to the "Containers" tab
- You should see 5 containers running:
  - `frontend` (port 5173)
  - `backend` (port 3000)
  - `database` (MySQL on port 3306)
  - `mongo` (port 27017)
  - `reporting` (Grafana on port 4000)

**Using Command Line:**

**Mac/Windows:**
```bash
docker compose ps
```

You should see all containers with status "Up".

## Docker Compose Configuration

This project uses a **base + override** pattern to eliminate duplication between development and production configurations:

### File Structure

| File | Purpose | Usage |
|------|---------|-------|
| `docker-compose.yml` | **Base configuration** - Shared settings for all environments | Always loaded |
| `docker-compose.override.yml` | **Development overrides** - Dev-specific settings (volumes, ports) | Auto-loaded in development |
| `docker-compose.prod.yml` | **Production overrides** - Prod-specific settings (restart policies, build targets) | Explicitly loaded with `-f` flag |

### How It Works

**Development (default):**
```bash
docker compose up -d
```
Automatically merges: `docker-compose.yml` + `docker-compose.override.yml`

**Production:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
Explicitly merges: `docker-compose.yml` + `docker-compose.prod.yml`

### Key Differences

| Feature | Development | Production |
|---------|-------------|------------|
| **Volumes** | Source code mounted for hot-reload | No volumes (code baked into image) |
| **Ports** | All ports exposed (3000, 5173, 3306, etc.) | Only frontend on port 80 |
| **Restart Policy** | No restart policy | `restart: unless-stopped` |
| **Dockerfiles** | `Dockerfile` (dev server) | `Dockerfile.prod` (optimized builds) |

## Managing Docker Containers

### Using Docker Desktop (Recommended for Beginners)

1. **View Container Logs:**
   - Click on any container name
   - View real-time logs in the "Logs" tab
   - Use the search box to filter logs

2. **Stop/Start Individual Containers:**
   - Hover over a container
   - Click the stop/start button

3. **Restart Containers:**
   - Click the restart icon next to the container

4. **View Container Stats:**
   - See CPU, memory, and network usage in real-time

### Using Command Line

**View Logs:**
```bash
# All services
docker compose logs

# Specific service
docker compose logs frontend
docker compose logs backend

# Follow logs in real-time
docker compose logs -f backend
```

**Restart Services:**
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

**Stop Services:**
```bash
# Stop all services
docker compose stop

# Stop specific service
docker compose stop frontend
```

**Start Stopped Services:**
```bash
# Start all services
docker compose start

# Start specific service
docker compose start backend
```

**Rebuild Containers (after code changes):**
```bash
# Rebuild and restart all services
docker compose up -d --build

# Rebuild specific service
docker compose up -d --build backend
```

## Accessing Services

Once all containers are running, you can access the following services:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:5173](http://localhost:5173) | React application (Vite dev server) |
| **Backend API** | [http://localhost:3000](http://localhost:3000) | Express.js REST API |
| **Grafana** | [http://localhost:4000](http://localhost:4000) | Reporting and monitoring dashboard |
| **MySQL** | `localhost:3306` | MySQL database (use database client) |
| **MongoDB** | `localhost:27017` | MongoDB database (use database client) |

### Database Connection Details

**MySQL:**
- Host: `localhost`
- Port: `3306`
- Database: `ssw590`
- Username: `express`
- Password: `Express!23`
- Root Password: `Docker!23`

**MongoDB:**
- Connection String: `mongodb://localhost:27017/mydb`

## Running Commands in Containers

### Using Docker Desktop

1. Click on the container you want to access
2. Click the "Exec" tab
3. Type your command in the terminal interface

### Using Command Line

**General Syntax:**
```bash
docker compose exec <service-name> <command>
```

**Common Examples:**

**Frontend Container:**
```bash
# Access bash shell
docker compose exec frontend sh

# Install npm package
docker compose exec frontend npm install <package-name>

# Run tests
docker compose exec frontend npm test

# Check Node version
docker compose exec frontend node --version
```

**Backend Container:**
```bash
# Access bash shell
docker compose exec backend sh

# Install npm package
docker compose exec backend npm install <package-name>

# Run tests
docker compose exec backend npm test

# Run database migrations (if applicable)
docker compose exec backend npm run migrate
```

**MySQL Container:**
```bash
# Access MySQL CLI
docker compose exec mysql mysql -u express -pExpress!23 ssw590

# Access as root
docker compose exec mysql mysql -u root -pDocker!23

# Run SQL file
docker compose exec mysql mysql -u express -pExpress!23 ssw590 < path/to/file.sql
```

**MongoDB Container:**
```bash
# Access MongoDB shell
docker compose exec mongo mongosh mydb

# Run MongoDB commands
docker compose exec mongo mongosh --eval "db.stats()"
```

**Grafana Container:**
```bash
# Access shell
docker compose exec reporting sh

# View Grafana version
docker compose exec reporting grafana-cli --version
```

## Stopping the Application

### Stop and Remove Containers

**Mac/Windows:**
```bash
# Stop and remove containers (preserves volumes/data)
docker compose down

# Stop and remove containers AND volumes (deletes all data)
docker compose down -v
```

### Using Docker Desktop

1. Go to the "Containers" tab
2. Click the stop button next to the project group
3. Optionally, click the delete button to remove containers

**Note:** Stopping containers preserves your data in Docker volumes. To completely reset the application, use `docker compose down -v` to remove volumes as well.

## Troubleshooting

### Port Already in Use
If you see an error about ports already being in use:
1. Check if another application is using the port
2. Stop the conflicting application or change the port in `docker-compose.yml`

### Containers Won't Start
1. Ensure Docker Desktop is running
2. Check container logs: `docker compose logs <service-name>`
3. Try rebuilding: `docker compose up -d --build`

### Database Connection Issues
1. Verify database containers are running: `docker compose ps`
2. Check database logs: `docker compose logs mysql` or `docker compose logs mongo`
3. Ensure you're using the correct credentials

### Changes Not Reflecting
1. For code changes, the volumes should auto-sync
2. If changes don't appear, try: `docker compose restart <service-name>`
3. For dependency changes, rebuild: `docker compose up -d --build <service-name>`

## AWS Deployment

This project includes AWS CodePipeline and CodeDeploy configuration for continuous deployment to EC2.

### Quick Links
- **[Deployment Guide](./AWS_DEPLOYMENT.md)** - Complete setup guide with quick start section
- **[Quick Reference](./QUICK_REFERENCE.md)** - Commands and troubleshooting

### Deployment Flow
```
GitHub (main) → CodePipeline → CodeDeploy → EC2 → Docker Compose
```

When code is merged to `main`:
1. GitHub Actions runs tests (existing workflow)
2. After tests pass and PR is merged, CodePipeline detects the change
3. CodeDeploy deploys to EC2 staging environment
4. Application is automatically updated with zero manual intervention

### Key Files
- `appspec.yml` - CodeDeploy configuration
- `docker-compose.prod.yml` - Production Docker Compose configuration
- `scripts/` - Deployment lifecycle scripts
- `backend/Dockerfile.prod` - Production backend image
- `frontend/Dockerfile.prod` - Production frontend image with Nginx

### Prerequisites for AWS Deployment
- AWS Account
- EC2 instance with Docker installed
- IAM roles configured (see deployment guides)
- GitHub connection to AWS CodePipeline

**Setup Instructions**: See [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for complete deployment guide.
