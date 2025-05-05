-- schema.sql

-- Ensure the database exists
-- CREATE DATABASE IF NOT EXISTS helpdesk_db;
-- USE helpdesk_db;

-- Drop tables if they exist (optional, for development reset)
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category ENUM('technical', 'billing', 'general', 'bug') NOT NULL,
    urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Closed', 'Resolved') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id INT NULL, -- Foreign key to users table (nullable for guest submissions)
    assigned_to INT NULL, -- Foreign key to users table (for assigning to employees/admins)
    -- file_path VARCHAR(512) NULL, -- Optional: path to an uploaded file
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Add indexes for performance
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_email ON tickets(email); -- If searching by guest email often
CREATE INDEX idx_users_email ON users(email);

-- Insert a default admin user
-- IMPORTANT: The password 'password' is hashed using bcrypt.
-- It is STRONGLY recommended to change this password immediately after setup.
-- You can generate a new hash using a bcrypt tool or library.
-- Example hash generated for 'password':
INSERT INTO users (name, email, password_hash, role) VALUES (
    'Admin User',
    'admin@example.com',
    '$2b$10$KYa8z.N5j.2uJjG8t4PzZu9Z5R6h.s5jX6w4B6v2L7k3P9z.K5g.e', -- Hash for 'password'
    'admin'
);

-- Example of inserting a customer user (optional)
-- INSERT INTO users (name, email, password_hash, role) VALUES (
--    'Customer User',
--    'customer@example.com',
--    '$2b$10$SOMEOTHERHASHEXAMPLE.............', -- Generate a different hash
--    'customer'
-- );
