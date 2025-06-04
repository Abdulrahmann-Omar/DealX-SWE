# DealX-SWE Testing Guide

This guide provides instructions for testing the DealX-SWE application both locally using Docker and after deployment to a production environment.

## Local Testing with Docker

Testing locally ensures the application components work together correctly before deploying.

**Prerequisites:**

*   Docker and Docker Compose installed.
*   Repository cloned (`git clone <repo-url> && cd DealX-SWE`).
*   `.env` file created from `.env.example` and configured for local development (database credentials, `NODE_ENV=development`, `CORS_ORIGIN=http://localhost:<FRONTEND_PORT>`, etc.).

**Steps:**

1.  **Build and Start Containers:**
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: Rebuilds images if Dockerfiles or code have changed.
    *   `-d`: Runs containers in the background.
    *   Wait for all containers (backend, frontend, db) to start and become healthy. Check `docker-compose ps` and the database healthcheck.

2.  **Initial Database Check:**
    *   Verify the database container (`dealx_db`) is running and healthy: `docker ps` (check status) or `docker-compose ps`.
    *   Check database logs for initialization messages: `docker-compose logs db`.
    *   (Optional) Connect to the database using a tool like `psql` or a GUI client to verify tables were created by `init.sql`:
        ```bash
        # Find the host port mapped to the DB container (e.g., 5432)
        docker exec -it dealx_db psql -U <DB_USER> -d <DB_NAME>
        # Inside psql:
        \dt # List tables
        \q # Quit
        ```
        *(Replace `<DB_USER>` and `<DB_NAME>` with values from your `.env` file)*

3.  **Backend Health Check:**
    *   Verify the backend container (`dealx_backend`) is running: `docker-compose ps`.
    *   Check backend logs for startup messages and database connection success: `docker-compose logs backend`.
    *   Access the health check endpoint (defined in `backend/src/app.js`):
        *   Via Nginx proxy: `curl http://localhost:<FRONTEND_PORT>/api/health` (e.g., `curl http://localhost:80/api/health`)
        *   Directly (if port mapped): `curl http://localhost:<BACKEND_PORT>/api/health` (e.g., `curl http://localhost:5000/api/health`)
    *   Expected output: `{"status":"UP","message":"Backend is running"}`

4.  **Frontend Access:**
    *   Verify the frontend container (`dealx_frontend`) is running: `docker-compose ps`.
    *   Check Nginx logs: `docker-compose logs frontend`.
    *   Open the application in your browser: `http://localhost:<FRONTEND_PORT>` (e.g., `http://localhost:80`).
    *   The React application should load.

5.  **Core Functionality Testing (Manual):**
    *   **Navigation:** Click through different pages/routes defined in the React app.
    *   **API Interaction:**
        *   Open browser developer tools (usually F12) and go to the "Network" tab.
        *   Perform actions that trigger API calls (e.g., viewing products, searching, logging in, adding to cart).
        *   Check if requests to `/api/...` endpoints return successful status codes (e.g., 200 OK, 201 Created) and expected data.
        *   Verify there are no CORS errors in the browser console.
    *   **User Authentication:**
        *   Register a new user.
        *   Log out.
        *   Log in with the newly registered user.
        *   Access protected routes/profile pages.
    *   **Product Interaction:**
        *   View product lists.
        *   View individual product details.
        *   (If implemented) Add products to the cart.
        *   (If implemented) View the cart.
    *   **Form Submissions:** Test any forms (registration, login, profile updates) for correct submission and validation.

6.  **Check Logs During Testing:** Keep an eye on container logs for any errors during interaction:
    ```bash
    docker-compose logs -f backend
    docker-compose logs -f frontend
    ```

7.  **Stop Containers:**
    ```bash
    docker-compose down
    ```
    *   Use `docker-compose down -v` to remove the database volume if you want a completely fresh start next time.

## Production Deployment Verification

After deploying to a platform (Heroku, Railway, VPS):

1.  **Access Public URL:** Open the application using the public domain name provided by the platform.
2.  **Basic Checks:**
    *   Does the frontend load correctly?
    *   Is HTTPS enabled and working (if configured)? Check the browser's security indicator (padlock icon).
3.  **Core Functionality Testing:** Repeat the manual functionality tests described in the local testing section (Navigation, API Interaction, Authentication, Product Interaction, Forms).
4.  **Platform Logs:** Check the application logs using the platform's dashboard or CLI tools (e.g., `heroku logs`, Railway logs interface, `docker logs` on VPS).
5.  **Environment Check:** Verify that the application is running in `production` mode (check logs or specific endpoints if available) and using the correct production database and other service configurations.
6.  **Health Check Endpoint:** Access the backend health check endpoint via the public URL (e.g., `https://yourdomain.com/api/health`) to confirm the backend is operational.

---
