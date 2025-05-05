# Firebase Studio - HelpDesk HQ

This is a Next.js starter project for a HelpDesk application, built within Firebase Studio.

## Getting Started (Manual Setup)

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Set up Environment Variables:**
    *   Copy the `.env.example` file to a new file named `.env`.
    *   Fill in the required environment variables:
        *   `GOOGLE_GENAI_API_KEY`: (Optional) Your API key if using Google AI features.
        *   `DB_HOST`: Hostname of your MariaDB/MySQL server (e.g., `localhost`).
        *   `DB_USER`: Your database username (e.g., `helpdesk_user`).
        *   `DB_PASSWORD`: Your database password.
        *   `DB_NAME`: The name of the database to use (e.g., `helpdesk_db`).
        *   `DB_PORT`: (Optional) The port your database server is running on (defaults to 3306).
        *   `MARIADB_ROOT_PASSWORD`: Required only if using Docker Compose setup (see below).

3.  **Set up Database:**
    *   Ensure you have a MariaDB or MySQL server running.
    *   Create the database specified in `DB_NAME` (e.g., `CREATE DATABASE helpdesk_db;`).
    *   Create the database user specified in `DB_USER` with the password from `DB_PASSWORD`, granting necessary privileges on `helpdesk_db`.
    *   Connect to your database server using a client (like `mysql`, DBeaver, TablePlus, etc.).
    *   Execute the SQL commands in `schema.sql` against the `helpdesk_db` database. This will create the `users` and `tickets` tables and insert a default admin user.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002).

## Getting Started (Docker Compose)

This is the recommended method for easy setup and consistent environments.

1.  **Install Docker and Docker Compose:** Ensure you have Docker and Docker Compose installed on your system.

2.  **Set up Environment Variables:**
    *   Copy the `.env.example` file to a new file named `.env`.
    *   Fill in the **required** environment variables:
        *   `DB_USER`: Your desired database username (e.g., `helpdesk_user`).
        *   `DB_PASSWORD`: Your desired database password.
        *   `DB_NAME`: Your desired database name (e.g., `helpdesk_db`).
        *   `MARIADB_ROOT_PASSWORD`: A **strong** password for the MariaDB root user (used only by the container setup).
        *   `GOOGLE_GENAI_API_KEY`: (Optional) Your Google AI API key if needed.
    *   **Important:** `DB_HOST` should **not** be set to `localhost` in the `.env` file for Docker Compose, as the container will connect to the `db` service name. The `docker-compose.yml` file handles setting `DB_HOST=db`.

3.  **Build and Run:**
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: Builds the Next.js application image. Only needed the first time or when code changes.
    *   `-d`: Runs the containers in detached mode (in the background).
    *   Docker Compose will:
        *   Build the Next.js app image.
        *   Start a MariaDB container.
        *   Create the database (`DB_NAME`) and user (`DB_USER`) using the provided credentials.
        *   Run the `schema.sql` script to set up tables and the default admin user.
        *   Start the Next.js application container, connecting it to the database container.

4.  **Access the Application:** The application will be available at [http://localhost:9002](http://localhost:9002).

5.  **Stopping:**
    ```bash
    docker-compose down
    ```
    *   Use `docker-compose down -v` to also remove the database data volume.

## Key Features

*   **Ticket Submission:** Users can submit support tickets via a dedicated form (`/submit-ticket`).
*   **Login:** Combined login page for customers and administrators (`/login`).
*   **Admin Account:** Default admin user (`admin@example.com` / `password`) created by `schema.sql`. **CHANGE THIS PASSWORD!**
*   **Employee Dashboard:** A dashboard for support staff (admins) to view and manage tickets (`/employee`). (Currently uses mock data).
*   **Customer Dashboard:** A basic dashboard for logged-in customers (`/dashboard`).
*   **Database Integration:** Submitted tickets and user accounts are stored in a MariaDB/MySQL database.
*   **Docker Support:** Includes `Dockerfile` and `docker-compose.yml` for easy containerized deployment.
*   **Styling:** Uses Tailwind CSS and ShadCN UI components for a modern look and feel.
*   **Server Actions:** Utilizes Next.js Server Actions for form handling (login, signup, ticket submission).

## Default Admin User

The `schema.sql` script creates a default administrator account:

*   **Email:** `admin@example.com`
*   **Password:** `password`

**It is critical that you change this password immediately after setting up the application.** You can do this by:
1.  Hashing a new password using a bcrypt tool/library.
2.  Connecting to your database and updating the `password_hash` for the `admin@example.com` user in the `users` table.

## Project Structure

*   `src/app/`: Contains the application pages and layouts (using Next.js App Router).
    *   `src/app/page.tsx`: Landing page.
    *   `src/app/submit-ticket/`: Ticket submission page and related server action (`actions.ts`).
    *   `src/app/employee/`: Employee dashboard page.
    *   `src/app/dashboard/`: Customer dashboard page.
    *   `src/app/login/`: Login page and server action (`actions.ts`).
    *   `src/app/signup/`: Signup page and server action (`actions.ts`).
    *   `src/app/layout.tsx`: Root layout.
    *   `src/app/globals.css`: Global styles and ShadCN theme variables.
*   `src/components/`: Reusable UI components.
    *   `src/components/ui/`: ShadCN UI components.
*   `src/lib/`: Utility functions.
    *   `src/lib/db.ts`: Database connection utility.
    *   `src/lib/utils.ts`: General utility functions (like `cn`).
*   `src/services/`: Business logic for interacting with data sources.
    *   `src/services/ticket-service.ts`: Functions for ticket database operations.
    *   `src/services/user-service.ts`: Functions for user database operations (creation, lookup, password verification).
*   `src/hooks/`: Custom React hooks.
    *   `src/hooks/use-toast.ts`: Hook for displaying toast notifications.
*   `src/ai/`: (Optional) Code related to Generative AI features using Genkit.
*   `public/`: Static assets.
*   `schema.sql`: SQL schema definition for the database (includes default admin).
*   `Dockerfile`: Defines the Next.js application container image.
*   `docker-compose.yml`: Defines the application and database services for Docker Compose.
*   `.env.example`: Example environment variables file.
*   `.dockerignore`: Specifies files/directories to ignore when building the Docker image.

## Further Development

*   Implement file uploads for ticket attachments.
*   Fetch real ticket data from the database in the employee dashboard.
*   Add proper session management/authentication beyond simple redirection.
*   Implement functionality to update ticket status, assign tickets, add comments, etc. in the employee dashboard.
*   Display user's tickets in the customer dashboard.
*   Add password reset functionality.
*   Develop AI features (e.g., ticket summarization, suggested replies) using Genkit.
*   Improve error handling and user feedback.
