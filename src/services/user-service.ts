'use server';
/**
 * @fileOverview Service functions for interacting with the users table in the database.
 */

import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'customer' | 'admin';
  created_at: Date;
  updated_at: Date;
}

/**
 * Finds a user by their email address.
 * @param email - The email address of the user to find.
 * @returns The user object if found, otherwise null.
 * @throws Throws an error if there's a database issue.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [rows] = await connection.execute<RowDataPacket[]>(sql, [email]);

    if (rows.length > 0) {
      return rows[0] as User;
    }
    return null;
  } catch (error) {
    console.error('Error finding user by email in database:', error);
    throw new Error('Database error: Failed to find user.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Verifies a given password against a stored hash.
 * @param plainPassword - The plain text password entered by the user.
 * @param hashedPassword - The hashed password stored in the database.
 * @returns True if the password is valid, false otherwise.
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    // Treat password verification errors as invalid password for security
    return false;
  }
}

/**
 * Creates a new user record in the database.
 * IMPORTANT: Ensure plainPassword is securely hashed before calling this in a real scenario.
 * This function assumes password hashing happens *before* calling it.
 *
 * @param userData - The data for the new user, including the hashed password.
 * @returns The ID of the newly inserted user.
 * @throws Throws an error if the database insertion fails or email exists.
 */
export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  let connection;
  try {
    connection = await pool.getConnection();
    // Hash the password before storing (Example using bcrypt)
    const saltRounds = 10; // Adjust cost factor as needed
    const hashedPassword = await bcrypt.hash(userData.password_hash, saltRounds); // HASH THE PASSWORD HERE

    const sql = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      userData.name,
      userData.email,
      hashedPassword, // Store the hashed password
      userData.role,
    ];

    const [result] = await connection.execute<ResultSetHeader>(sql, values);

    if (result.insertId) {
      console.log(`User created with ID: ${result.insertId}`);
      return result.insertId;
    } else {
      throw new Error('Failed to create user: No insert ID returned.');
    }
  } catch (error: any) {
    console.error('Error creating user in database:', error);
     // Check for duplicate email error (MySQL error code 1062)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new Error('Email address already exists.');
    }
    throw new Error('Database error: Failed to create user.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


// Example function to hash a password (Use this when creating users or updating passwords)
export async function hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10; // Or read from config
    return bcrypt.hash(plainPassword, saltRounds);
}

// Future potential functions:
// export async function getUserById(id: number): Promise<User | null> { ... }
// export async function updateUserRole(id: number, role: User['role']): Promise<boolean> { ... }
// export async function deleteUser(id: number): Promise<boolean> { ... }
