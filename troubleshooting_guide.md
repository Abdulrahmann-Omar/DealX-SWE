# DealX-SWE Troubleshooting Guide

This guide helps diagnose and resolve common issues encountered during development, deployment, or runtime of the DealX-SWE application.

## General Debugging Steps

1.  **Check Logs:** This is almost always the first step.
    *   **Local Docker:** `docker-compose logs -f <service_name>` (e.g., `backend`, `frontend`, `db`).
    *   **Production Platform:** Use the platform's logging interface (Heroku logs, Railway logs, `docker logs <container_id>` on VPS).
    *   Look for error messages, stack traces, or unusual activity.
2.  **Verify Container Status:**
    *   **Local Docker:** `docker-compose ps` or `docker ps`. Ensure all required containers (backend, frontend, db) are `Up` or `Healthy`.
    *   **Production Platform:** Check the status of your services/dynos/containers in the platform dashboard.
3.  **Check Environment Variables:**
    *   Ensure all required variables are set correctly in the `.env` file (local) or platform config vars (production).
    *   Verify the application is actually loading them (check startup logs if the app prints loaded vars, or add temporary logging).
    *   Common issues: incorrect database credentials, wrong `CORS_ORIGIN`, missing `SESSION_SECRET`.
4.  **Network Issues:**
    *   **Container Communication (Docker):** Ensure containers are on the same Docker network (`app-network` in the provided `docker-compose.yml`). Services should be able to reach each other using their service names (e.g., `backend` can reach `db` at `db:5432`). Use `docker exec -it <container_name> sh` and tools like `ping` or `nc` (netcat) to test connectivity *inside* the containers.
    *   **External Access:** Check firewall rules (VPS) or platform network settings to ensure traffic is allowed on the necessary ports (e.g., 80, 443).
    *   **DNS:** Ensure your domain name (if used) correctly points to the platform's IP or load balancer.
5.  **Browser Developer Tools:**
    *   **Console:** Check for JavaScript errors, including CORS issues.
    *   **Network Tab:** Inspect API requests. Check status codes (4xx errors indicate client-side issues like bad requests or unauthorized access, 5xx errors indicate server-side problems), request/response headers, and response bodies.

## Common Errors and Solutions

**1. Database Connection Errors**

*   **Symptoms:** Backend fails to start, logs show `Unable to connect to the database`, `ECONNREFUSED`, `password authentication failed`, `database does not exist`.
*   **Causes:**
    *   Incorrect DB credentials (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`) in `.env` or platform config.
    *   Database container (`db`) is not running or healthy.
    *   Network issue preventing backend container from reaching DB container.
    *   Database hasn't been created yet (if `init.sql` failed or wasn't run).
*   **Solutions:**
    *   Double-check all DB environment variables.
    *   Ensure the DB container is running (`docker-compose ps`, platform dashboard).
    *   Check DB logs (`docker-compose logs db`).
    *   Test network connectivity from backend to DB container.
    *   Verify the `init.sql` script ran successfully (check DB logs, connect and check tables).

**2. CORS Errors**

*   **Symptoms:** Frontend fails to fetch data from the backend API. Browser console shows errors like `Access to fetch at 'http://backend:5000/api/...' from origin 'http://localhost:80' has been blocked by CORS policy...`.
*   **Causes:**
    *   Backend `CORS_ORIGIN` environment variable is not set or doesn't match the frontend's actual origin URL.
    *   Backend CORS middleware (`app.use(cors(...))`) is misconfigured or missing.
    *   Nginx proxy configuration (if used) is stripping necessary CORS headers (less common).
*   **Solutions:**
    *   Verify the `CORS_ORIGIN` environment variable in the backend matches the exact URL the frontend is served from (including protocol, domain, and port).
    *   Ensure `app.js` correctly configures and uses the `cors` middleware *before* API routes.
    *   Check Nginx config (`frontend/nginx.conf`) if applicable, ensure it's passing requests correctly.

**3. Frontend Shows Blank Page or Nginx Error (404/50x)**

*   **Symptoms:** Accessing the frontend URL results in a blank white page, an Nginx welcome page, or an Nginx error page.
*   **Causes:**
    *   Frontend build failed or didn't produce files in the expected `/app/build` directory within the frontend container.
    *   Nginx container failed to start or is misconfigured.
    *   Incorrect path mapping in `frontend/Dockerfile` (copying build files) or `frontend/nginx.conf` (root directive).
    *   Issues with React Router configuration (less likely if it works locally).
*   **Solutions:**
    *   Check frontend build logs (during `docker-compose build` or in CI/CD pipeline).
    *   Check Nginx container logs (`docker-compose logs frontend`).
    *   Verify the `COPY --from=builder /app/build /usr/share/nginx/html` step in `frontend/Dockerfile` is correct.
    *   Verify the `root /usr/share/nginx/html;` and `try_files $uri $uri/ /index.html;` directives in `frontend/nginx.conf` are correct.
    *   Use `docker exec -it dealx_frontend sh` to inspect the contents of `/usr/share/nginx/html` inside the running container.

**4. API Requests Return 404 Not Found**

*   **Symptoms:** Frontend makes API calls, but they receive a 404 response.
*   **Causes:**
    *   Incorrect API endpoint URL used in the frontend code.
    *   Backend route is not defined correctly in Express (`app.js` or route files).
    *   Nginx proxy configuration (`location /api`) in `frontend/nginx.conf` is incorrect (wrong `proxy_pass` address/port or path).
*   **Solutions:**
    *   Verify API URLs called by the frontend match the routes defined in the backend.
    *   Check backend logs to see if the request even reaches the backend.
    *   Verify the `proxy_pass http://backend:5000;` directive in `frontend/nginx.conf` points to the correct backend service name and port.

**5. Permission Errors (Docker)**

*   **Symptoms:** Errors related to file access, writing logs, or installing packages during Docker build or runtime.
*   **Causes:**
    *   Running processes as root inside the container when not necessary.
    *   Incorrect file/directory ownership or permissions within the container.
    *   Volume mount issues overwriting necessary files or having wrong permissions.
*   **Solutions:**
    *   Use non-root users in Dockerfiles (as implemented in the provided `backend/Dockerfile`).
    *   Ensure correct ownership (`chown`) and permissions (`chmod`) are set within the Dockerfile.
    *   Be careful with volume mounts, especially in production. Avoid mounting over application code unless specifically for development.

**6. Performance Issues**

*   **Symptoms:** Application is slow, high resource usage (CPU/Memory).
*   **Causes:**
    *   Inefficient database queries (missing indexes, complex joins).
    *   Lack of database connection pooling (addressed in `database.js`).
    *   Large static assets or unoptimized frontend build.
    *   Memory leaks in Node.js application.
    *   Insufficient resources allocated to containers/VPS.
*   **Solutions:**
    *   **Database:** Analyze slow queries (`EXPLAIN ANALYZE`), add appropriate indexes (`init.sql` includes some examples).
    *   **Backend:** Implement caching where appropriate, optimize algorithms, use Node.js profiling tools to find bottlenecks.
    *   **Frontend:** Optimize React components (memoization), code splitting, optimize images, use browser caching headers (via Nginx).
    *   **Infrastructure:** Monitor container resource usage (`docker stats`, platform monitoring tools), scale resources (CPU, RAM) if necessary.

## Debug Commands (Docker)

*   `docker-compose ps`: List status of containers defined in `docker-compose.yml`.
*   `docker ps -a`: List all containers (including stopped ones).
*   `docker-compose logs -f <service_name>`: Tail logs for a specific service.
*   `docker-compose down`: Stop and remove containers, networks defined in the compose file.
*   `docker-compose down -v`: Stop and remove containers, networks, AND volumes.
*   `docker exec -it <container_name_or_id> sh`: Get a shell inside a running container.
*   `docker inspect <container_name_or_id>`: Show detailed information about a container (IP address, mounts, etc.).
*   `docker volume ls`: List Docker volumes.
*   `docker network ls`: List Docker networks.

---
