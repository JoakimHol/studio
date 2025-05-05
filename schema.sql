-- Create the tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category ENUM('technical', 'billing', 'general', 'bug') NOT NULL,
    urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Closed') DEFAULT 'Open',
    file_path VARCHAR(512) NULL, -- Optional file path
    user_id INT NULL, -- Foreign key to users table (can be NULL if submitted by guest)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(status),
    INDEX(urgency),
    INDEX(category),
    INDEX(email), -- Index email for faster lookups if needed
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL -- Link to users table
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(email) -- Index email for faster login lookups
);

-- Example: Insert an admin user (replace with a secure password hash in production)
-- Use a tool or script to generate a proper bcrypt hash for the password 'adminpassword'
-- INSERT INTO users (name, email, password_hash, role)
-- VALUES ('Admin User', 'admin@example.com', '$2b$10$...yourGeneratedHashHere...', 'admin')
-- ON DUPLICATE KEY UPDATE name = name; -- Avoid error if admin already exists

-- Example: Insert a customer user (replace with a secure password hash)
-- INSERT INTO users (name, email, password_hash, role)
-- VALUES ('Customer One', 'customer@example.com', '$2b$10$...anotherGeneratedHashHere...', 'customer')
-- ON DUPLICATE KEY UPDATE name = name; -- Avoid error if customer already exists

-- Optional: Add constraint to tickets table after users table is created if needed
-- ALTER TABLE tickets
-- ADD CONSTRAINT fk_user_id
-- FOREIGN KEY (user_id) REFERENCES users(id)
-- ON DELETE SET NULL;
