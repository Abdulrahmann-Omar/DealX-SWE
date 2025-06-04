# DealX-SWE Deployment Guide

This guide provides instructions for deploying the DealX-SWE PERN stack application using Docker and Docker Compose across various platforms.

## Prerequisites

Before deploying, ensure you have the following:

1.  **Docker and Docker Compose:** Installed on your local machine or deployment target.
2.  **Git:** Installed for cloning the repository.
3.  **Code Repository:** Access to the finalized `DealX-SWE` repository containing all Dockerfiles, `docker-compose.yml`, configuration files, and application code.
4.  **Environment Variables:** A `.env` file created based on the `.env.example` template, containing all necessary production secrets and configurations (Database credentials, `SESSION_SECRET`, `CORS_ORIGIN`, etc.). **Never commit your `.env` file to Git.**
5.  **Container Registry:** Access to a container registry (like Docker Hub or GitHub Container Registry - ghcr.io) where the built frontend and backend images will be pushed (as configured in the CI/CD pipeline).
6.  **Platform Accounts:** Accounts for the chosen deployment platform(s) (Heroku, Railway, VPS provider like DigitalOcean/AWS).

## Local Testing with Docker

Before deploying to production, always test the application locally using Docker Compose:

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd DealX-SWE
    ```
2.  **Create `.env` File:** Copy `.env.example` to `.env` and fill in the required values for your local development environment.
    ```bash
    cp .env.example .env
    # Edit .env with your local settings (e.g., DB_PASS, SESSION_SECRET)
    # Ensure DB_HOST is set to 'db' (the service name in docker-compose)
    # Ensure CORS_ORIGIN is set to 'http://localhost:FRONTEND_PORT' (e.g., http://localhost:80)
    ```
3.  **Build and Run Containers:**
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: Forces Docker to rebuild the images based on the Dockerfiles.
    *   `-d`: Runs the containers in detached mode (in the background).
4.  **Access the Application:**
    *   Frontend: Open your browser to `http://localhost:<FRONTEND_PORT>` (e.g., `http://localhost:80` or `http://localhost:3000` if you changed the port mapping in `docker-compose.yml`).
    *   Backend API (for direct testing): Can be accessed via the Nginx proxy at `http://localhost:<FRONTEND_PORT>/api` or directly at `http://localhost:<BACKEND_PORT>` (e.g., `http://localhost:5000`).
5.  **Check Logs:**
    ```bash
    docker-compose logs -f # View logs for all services
    docker-compose logs -f backend # View logs for backend only
    docker-compose logs -f frontend # View logs for frontend (Nginx) only
    docker-compose logs -f db # View logs for database only
    ```
6.  **Stop Containers:**
    ```bash
    docker-compose down
    ```
    *   Add `-v` to remove the database volume (`db_data`) if you want a clean start next time: `docker-compose down -v`

## Deployment Platforms

This section outlines deployment steps for specific platforms. Remember to configure your CI/CD pipeline (like the provided GitHub Actions workflow) to automate the build and push steps to your container registry.

**(Instructions for Heroku, Railway, and VPS will be added in subsequent steps)**

## Post-Deployment Verification

After deploying to any platform:

1.  **Access the Public URL:** Open the public URL provided by the platform in your browser.
2.  **Test Core Functionality:**
    *   Navigate through different pages.
    *   Test user registration and login.
    *   Verify product listing and details.
    *   Test adding items to the cart (if applicable).
    *   Check if API calls are successful (use browser developer tools network tab).
3.  **Check Logs:** Access the logging interface provided by the deployment platform to monitor for any errors.
4.  **Verify Environment Variables:** Ensure the application is using the correct production environment variables (check logs or specific admin endpoints if available).

## Zero-Downtime Deployment Considerations

Achieving true zero-downtime deployment often requires platform-specific features or more advanced orchestration:

*   **Rolling Updates:** Platforms like Kubernetes, Heroku (with preboot), or managed services often support rolling updates, where new instances are started before old ones are stopped.
*   **Blue-Green Deployment:** Maintain two identical production environments (Blue and Green). Deploy to the inactive environment, test, and then switch traffic.
*   **Canary Releases:** Gradually roll out the new version to a small subset of users before releasing it to everyone.
*   **Database Migrations:** Handle database schema changes carefully to be backward compatible during the transition period.
*   **Load Balancers:** Essential for distributing traffic and managing transitions between old and new application versions.

The provided `docker-compose.yml` setup is suitable for single-instance deployments. For zero-downtime on platforms like a generic VPS, you would typically need a load balancer (like Nginx or HAProxy) in front of multiple instances of your application containers and script the deployment process to update instances sequentially.

## Database Backup and Restore (PostgreSQL)

Regular backups are crucial for production databases.

**Backup:**

Use `pg_dump` to create a backup of your PostgreSQL database. If running the database in Docker:

```bash
# Replace <container_name_or_id> with your DB container name (e.g., dealx_db)
# Replace <db_user> with your DB user (e.g., dealx_user)
# Replace <db_name> with your DB name (e.g., dealx_db)
# Replace backup_YYYYMMDD.sql with your desired backup filename

docker exec -t <container_name_or_id> pg_dump -U <db_user> -d <db_name> -F c -b -v -f /tmp/backup.dump
docker cp <container_name_or_id>:/tmp/backup.dump ./backup_YYYYMMDD.dump
```
*   `-F c`: Custom format (compressed, suitable for `pg_restore`).
*   Store backups securely off-server (e.g., S3, Google Cloud Storage).
*   Automate this process using cron jobs or platform features.

**Restore:**

Use `pg_restore` to restore a backup. You might need to drop and recreate the database first.

```bash
# 1. Copy the backup file into the container
docker cp ./backup_YYYYMMDD.dump <container_name_or_id>:/tmp/backup.dump

# 2. Execute pg_restore inside the container
# Ensure the database exists but is empty, or use --clean option
docker exec -i <container_name_or_id> pg_restore -U <db_user> -d <db_name> --clean --if-exists -v /tmp/backup.dump

# OR, if restoring to a new/empty database:
docker exec -i <container_name_or_id> pg_restore -U <db_user> -d <db_name> -v /tmp/backup.dump
```
*   `--clean`: Drop database objects before recreating them.
*   `--if-exists`: Use `DROP...IF EXISTS` to avoid errors if objects don't exist.
*   Consult PostgreSQL documentation for detailed `pg_dump` and `pg_restore` options.

---



### Platform: Heroku

Heroku can deploy Docker containers using the `heroku.yml` file.

**Prerequisites:**

*   Heroku CLI installed and logged in (`heroku login`).
*   A Heroku app created (`heroku create your-app-name`).
*   Heroku stack set to `container` (`heroku stack:set container -a your-app-name`).
*   A PostgreSQL add-on provisioned (e.g., `heroku addons:create heroku-postgresql:hobby-dev -a your-app-name`). Heroku will provide a `DATABASE_URL` config var.
*   All other required environment variables (e.g., `SESSION_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`) set as Config Vars in the Heroku app settings dashboard or via CLI (`heroku config:set KEY=VALUE -a your-app-name`).
    *   **Important:** You will need to parse the `DATABASE_URL` provided by Heroku in your backend's `database.js` config or set individual `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` config vars based on the `DATABASE_URL` components.
*   Your code pushed to a Git repository connected to Heroku (or use the GitHub integration).

**Deployment Steps:**

1.  **Ensure `heroku.yml` is present:** The `heroku.yml` file created earlier defines the build and run phases.
2.  **Push to Heroku:** Pushing your code to the Heroku remote (usually named `heroku`) will trigger the build and deployment process based on `heroku.yml`.
    ```bash
    git push heroku main # Or your deployment branch
    ```
3.  **Monitor Deployment:** Check the build and deployment logs in the Heroku dashboard or via CLI:
    ```bash
    heroku logs --tail -a your-app-name
    ```
4.  **Database Migrations (if applicable):** If you configured a `release` phase in `heroku.yml` for migrations, they will run automatically. Otherwise, run them manually:
    ```bash
    # Example: Run migration command in a one-off dyno
    heroku run npm run db:migrate -a your-app-name # Adjust command as needed
    ```

**Notes:**

*   Heroku's Docker support works best when the `web` process defined in `heroku.yml` binds to the `$PORT` environment variable provided by Heroku. The Nginx container listens on 80 internally, and Heroku maps external traffic to this port.
*   Running multi-container setups like this (frontend + backend + db) can be complex on Heroku compared to platforms designed for Docker Compose. The `heroku.yml` primarily defines how to build images and what command to run for each process type (`web`, `worker`, etc.). Inter-container communication relies on Heroku's internal networking.
*   Consider using Heroku's native buildpacks if Docker deployment becomes too complex for your needs on this platform.

---



### Platform: Railway.app

Railway is well-suited for deploying Docker-based applications and often simplifies the process compared to Heroku.

**Prerequisites:**

*   Railway account created.
*   Railway CLI installed (optional, but useful: `npm i -g @railway/cli`) and logged in (`railway login`).
*   Project code pushed to a GitHub repository.
*   A Railway project created.

**Deployment Steps:**

1.  **Connect Repository:** Link your GitHub repository to your Railway project.
2.  **Add Services:** Railway will likely detect the `Dockerfile`s or `docker-compose.yml`. If not, manually add services:
    *   **Backend Service:** Add a new service, choose "Docker > Deploy from Dockerfile", point it to your repository, set the Dockerfile path to `./backend/Dockerfile`.
    *   **Frontend Service:** Add another service, choose "Docker > Deploy from Dockerfile", point it to your repository, set the Dockerfile path to `./frontend/Dockerfile`.
    *   **Database Service:** Add a new service, choose "Database > Add PostgreSQL". Railway will provide connection details as environment variables.
3.  **Configure Environment Variables:**
    *   In the **Backend Service** settings -> Variables:
        *   Add all variables from your `.env` file (e.g., `SESSION_SECRET`, `NODE_ENV=production`).
        *   Railway automatically injects database connection variables (like `DATABASE_URL` or individual `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`). Ensure your `backend/src/config/database.js` can use these (you might need to adjust it to parse `DATABASE_URL` or use Railway's variable names).
        *   Set `CORS_ORIGIN` to the public URL of your deployed frontend service (Railway provides this).
    *   In the **Frontend Service** settings -> Variables (if needed for build args):
        *   Add any `REACT_APP_*` variables if your frontend build requires them.
4.  **Configure Networking:**
    *   In the **Frontend Service** settings -> Networking:
        *   Ensure it's exposed to the public internet (Generate Domain).
        *   The internal port should be `80` (Nginx's port).
    *   In the **Backend Service** settings -> Networking:
        *   It typically does *not* need to be exposed publicly if the frontend proxies API requests.
        *   The internal port should be `5000` (as defined in `backend/Dockerfile`).
5.  **Deployment Trigger:** Railway automatically deploys when you push changes to the connected GitHub repository branch (usually `main`).
6.  **Monitor Deployment:** Check the deployment logs for each service in the Railway dashboard.

**Notes:**

*   Railway's Nixpacks might automatically build and deploy your Node.js backend and React frontend without explicit Dockerfiles if configured correctly, but using the Dockerfiles provides more control.
*   Ensure the Nginx configuration (`frontend/nginx.conf`) correctly proxies `/api` requests to the backend service. Railway service discovery usually allows referencing services by name (e.g., `http://backend:5000` if your backend service is named `backend`). Check Railway's documentation for current service discovery details.

---



### Platform: Generic VPS (e.g., DigitalOcean, AWS EC2, Linode)

Deploying to a generic Virtual Private Server gives you the most control but requires more manual setup.

**Prerequisites:**

*   A VPS provisioned with a Linux distribution (e.g., Ubuntu 22.04).
*   SSH access to the VPS.
*   Docker and Docker Compose installed on the VPS.
*   A domain name pointed to your VPS IP address (optional, for HTTPS).
*   A way to securely transfer files to the VPS (e.g., `scp` or `rsync`).
*   (Recommended) A reverse proxy like Nginx or Caddy installed directly on the VPS host to handle SSL termination and potentially serve static files if not using the Dockerized Nginx for the frontend.

**Deployment Steps (Manual Example):**

1.  **Connect to VPS:**
    ```bash
    ssh your_user@your_vps_ip
    ```
2.  **Install Docker & Docker Compose:** Follow official Docker documentation for your Linux distribution.
3.  **Clone Repository or Copy Files:**
    *   Option A (Clone): `git clone <your-repository-url>`
    *   Option B (Copy): Securely copy the entire project directory (including Dockerfiles, docker-compose.yml, etc.) to the VPS using `scp` or `rsync`.
    ```bash
    # Example using scp from your local machine
    scp -r /path/to/local/DealX-SWE your_user@your_vps_ip:/path/on/vps/
    ```
4.  **Create `.env` File on VPS:** Navigate to the project directory on the VPS and create the `.env` file with your production configuration. **Ensure file permissions restrict access.**
    ```bash
    cd /path/on/vps/DealX-SWE
    nano .env # Or use another editor
    # Paste your production environment variables
    chmod 600 .env # Restrict permissions
    ```
5.  **Build and Run Containers:**
    ```bash
    docker-compose up --build -d
    ```
6.  **Configure Host Reverse Proxy (Recommended for HTTPS):**
    *   If you installed Nginx/Caddy directly on the VPS host:
    *   Configure it to proxy requests to the frontend container (running on the host port mapped in `docker-compose.yml`, e.g., port 80 or 3000).
    *   Configure it to handle SSL termination (e.g., using Let's Encrypt via Certbot or Caddy's automatic HTTPS).
    *   Example Nginx host config snippet (proxying to frontend on host port 80):
        ```nginx
        server {
            listen 80;
            server_name yourdomain.com www.yourdomain.com;

            # Redirect HTTP to HTTPS (if using SSL)
            # return 301 https://$host$request_uri;

            location / {
                proxy_pass http://localhost:80; # Assuming frontend mapped to host port 80
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
        # Add another server block for listen 443 ssl ... if using HTTPS
        ```
7.  **Access Application:** Access via your VPS IP address or configured domain name.

**Deployment Steps (Using CI/CD - GitHub Actions SSH Example):**

1.  **Configure SSH Secrets:** Add your VPS IP (`VPS_HOST`), SSH username (`VPS_USERNAME`), and private SSH key (`VPS_SSH_KEY`) as secrets in your GitHub repository settings.
2.  **Update GitHub Actions Workflow:** Add the `Deploy to VPS via SSH` step (commented out in the example `deploy.yml`) to your workflow file. Adjust paths and commands as needed.
    ```yaml
      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /path/on/vps/DealX-SWE # Navigate to your app directory
            git pull # Pull the latest code
            # Copy production .env file if not in repo (manual step or secure transfer needed)
            # cp /path/to/secure/production.env .env
            docker-compose pull # Pull latest images built by CI/CD
            docker-compose up -d --remove-orphans # Start services
            echo "Deployment to VPS complete!"
    ```

**Notes:**

*   Ensure your VPS firewall allows traffic on the necessary ports (e.g., 80, 443 for HTTP/S, potentially the mapped frontend/backend/db ports if accessed directly).
*   Managing updates requires pulling new code/images and restarting containers (`docker-compose pull && docker-compose up -d`).
*   Consider security best practices for your VPS (firewall rules, regular updates, SSH key authentication, fail2ban, etc.).

---
