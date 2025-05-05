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
    // Ensure both arguments are strings before comparing
    if (typeof plainPassword !== 'string' || typeof hashedPassword !== 'string') {
      console.warn('Invalid input types for password verification.');
      return false;
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    // Treat password verification errors as invalid password for security
    return false;
  }
}

/**
 * Creates a new user record in the database.
 * IMPORTANT: This function expects the `password_hash` field in userData to already contain
 * the securely hashed password. Hashing should occur *before* calling this service function.
 *
 * @param userData - The data for the new user, including the pre-hashed password.
 * @returns The ID of the newly inserted user.
 * @throws Throws an error if the database insertion fails or email exists.
 */
export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  let connection;
  try {
    connection = await pool.getConnection();

    // Check if email already exists BEFORE attempting insert
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('Email address already exists.');
    }

    const sql = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      userData.name,
      userData.email,
      userData.password_hash, // Store the pre-hashed password
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
    // Re-throw specific "Email exists" error or a general DB error
    if (error.message === 'Email address already exists.') {
        throw error;
    }
    // Check for duplicate entry error code just in case the initial check missed due to race condition (less likely with check above)
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


/**
 * Utility function to hash a password (Use this in the Action file before calling createUser)
 * @param plainPassword - The plain text password to hash.
 * @returns The hashed password.
 * @throws Throws an error if hashing fails.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10; // Or read from config
    if (typeof plainPassword !== 'string') {
        throw new Error('Password must be a string.');
    }
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password.');
    }
}


/**
 * Retrieves all users from the database.
 * @returns An array of all user objects.
 * @throws Throws an error if there's a database issue.
 */
export async function getAllUsers(): Promise<User[]> {
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = 'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'; // Exclude password_hash
    const [rows] = await connection.execute<RowDataPacket[]>(sql);
    return rows as User[]; // Cast might be slightly inaccurate without password_hash, but okay for display
  } catch (error) {
    console.error('Error fetching all users from database:', error);
    throw new Error('Database error: Failed to fetch users.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Future potential functions:
// export async function getUserById(id: number): Promise<User | null> { ... }
// export async function updateUserRole(id: number, role: User['role']): Promise<boolean> { ... }
// export async function deleteUser(id: number): Promise<boolean> { ... }
// export async function updateUser(id: number, data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'password_hash'>>): Promise<boolean> { ... }
