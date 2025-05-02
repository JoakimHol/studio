# Firebase Studio - HelpDesk HQ

This is a Next.js starter project for a HelpDesk application, built within Firebase Studio.

## Getting Started

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
        *   `DB_USER`: Your database username.
        *   `DB_PASSWORD`: Your database password.
        *   `DB_NAME`: The name of the database to use (e.g., `helpdesk_db`).
        *   `DB_PORT`: (Optional) The port your database server is running on (defaults to 3306).

3.  **Set up Database:**
    *   Ensure you have a MariaDB or MySQL server running.
    *   Create the database specified in `DB_NAME` (e.g., `CREATE DATABASE helpdesk_db;`).
    *   Connect to your database server using a client (like `mysql`, DBeaver, TablePlus, etc.).
    *   Execute the SQL commands in `schema.sql` against the `helpdesk_db` database to create the `tickets` table.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002).

## Key Features

*   **Ticket Submission:** Users can submit support tickets via a dedicated form (`/submit-ticket`).
*   **Employee Dashboard:** A dashboard for support staff to view and manage tickets (`/employee`). (Currently uses mock data).
*   **Database Integration:** Submitted tickets are stored in a MariaDB/MySQL database.
*   **Styling:** Uses Tailwind CSS and ShadCN UI components for a modern look and feel.
*   **Server Actions:** Utilizes Next.js Server Actions for form handling.

## Project Structure

*   `src/app/`: Contains the application pages and layouts (using Next.js App Router).
    *   `src/app/page.tsx`: Landing page.
    *   `src/app/submit-ticket/`: Ticket submission page and related server action (`actions.ts`).
    *   `src/app/employee/`: Employee dashboard page.
    *   `src/app/layout.tsx`: Root layout.
    *   `src/app/globals.css`: Global styles and ShadCN theme variables.
*   `src/components/`: Reusable UI components.
    *   `src/components/ui/`: ShadCN UI components.
*   `src/lib/`: Utility functions.
    *   `src/lib/db.ts`: Database connection utility.
    *   `src/lib/utils.ts`: General utility functions (like `cn`).
*   `src/services/`: Business logic for interacting with data sources.
    *   `src/services/ticket-service.ts`: Functions for ticket database operations.
*   `src/hooks/`: Custom React hooks.
    *   `src/hooks/use-toast.ts`: Hook for displaying toast notifications.
*   `src/ai/`: (Optional) Code related to Generative AI features using Genkit.
*   `public/`: Static assets.
*   `schema.sql`: SQL schema definition for the database.

## Further Development

*   Implement file uploads for ticket attachments.
*   Fetch real ticket data from the database in the employee dashboard.
*   Add authentication for employees.
*   Implement functionality to update ticket status, assign tickets, etc.
*   Add customer accounts and link tickets to customers.
*   Develop AI features (e.g., ticket summarization, suggested replies) using Genkit.
