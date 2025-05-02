-- SQL Schema for HelpDesk HQ Tickets Table (MariaDB/MySQL)

-- Create database if it doesn't exist (optional, often done separately)
-- CREATE DATABASE IF NOT EXISTS helpdesk_db;
-- USE helpdesk_db;

-- Drop table if it exists (useful for development/resetting)
-- DROP TABLE IF EXISTS tickets;

-- Create the tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category ENUM('technical', 'billing', 'general', 'bug') NOT NULL,
    urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Closed', 'Resolved', 'Pending') NOT NULL DEFAULT 'Open',
    -- file_path VARCHAR(1024) NULL, -- Optional: Store path to uploaded file
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    assigned_to INT NULL, -- Optional: Foreign key to an 'employees' or 'users' table
    customer_id INT NULL -- Optional: Foreign key to a 'customers' table

    -- Optional: Add foreign key constraints if you have users/employees/customers tables
    -- FOREIGN KEY (assigned_to) REFERENCES employees(id),
    -- FOREIGN KEY (customer_id) REFERENCES customers(id)

    -- Optional: Add indexes for faster lookups
    -- INDEX idx_status (status),
    -- INDEX idx_email (email),
    -- INDEX idx_created_at (created_at)
);

-- Example Insert (for testing)
/*
INSERT INTO tickets (name, email, category, urgency, subject, description) VALUES
('Alice Wonderland', 'alice@example.com', 'technical', 'high', 'Cannot login', 'I am unable to log into my account using my credentials.'),
('Bob The Builder', 'bob@example.com', 'billing', 'medium', 'Billing question', 'I have a question about my recent invoice.'),
('Charlie Chaplin', 'charlie@example.com', 'general', 'low', 'Feature request: Dark mode', 'It would be great to have a dark mode option for the interface.');
*/

-- Note: Ensure your database user has the necessary privileges (CREATE, INSERT, SELECT, UPDATE, etc.)
-- on the `helpdesk_db` database and the `tickets` table.
