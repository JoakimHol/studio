-- schema.sql

-- Ensure the database exists (optional, as docker-compose usually handles this)
-- CREATE DATABASE IF NOT EXISTS helpdesk_db;
-- USE helpdesk_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL, -- Changed from 'name'
    email VARCHAR(255) NOT NULL,
    category ENUM('technical', 'billing', 'general', 'bug') NOT NULL,
    urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Closed') NOT NULL DEFAULT 'Open',
    user_id INT NULL,                     -- Link to the users table (optional for guests)
    -- file_path VARCHAR(512) NULL,       -- Optional: For file attachments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL -- Set user_id to NULL if user is deleted
);

-- Insert Default Admin User (if it doesn't already exist)
-- IMPORTANT: Change the password 'password' immediately after setup!
-- The password 'password' is hashed using bcrypt with default rounds (usually 10).
-- Use a bcrypt tool to generate a hash for your desired strong password.
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES (
    'Admin User',
    'admin@example.com',
    '$2b$10$T.tW5t5s/3G./Gqjv0Z6DuwH.13K9LcVGCXnUuLo./1D.pV3z.j5q', -- Hashed 'password'
    'admin'
);

-- Optional: Add indexes for performance
-- CREATE INDEX idx_tickets_status ON tickets(status);
-- CREATE INDEX idx_tickets_user_id ON tickets(user_id);
-- CREATE INDEX idx_users_email ON users(email);
```