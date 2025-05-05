'use server';
/**
 * @fileOverview Service functions for interacting with the tickets table in the database.
 */

import { pool } from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Interface for data received when creating a ticket
export interface CreateTicketData {
  name: string;
  email: string;
  category: 'technical' | 'billing' | 'general' | 'bug';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  user_id?: number | null; // Optional: ID of the logged-in user
  // filePath?: string; // Optional file path if handling uploads
}

// Interface representing a full ticket record from the database
export interface Ticket {
    id: number;
    customer_name: string; // Use customer_name as it's in the DB
    email: string;
    category: 'technical' | 'billing' | 'general' | 'bug';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    subject: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Closed';
    user_id: number | null;
    created_at: Date;
    updated_at: Date;
    // file_path?: string | null; // Uncomment if used
}


/**
 * Creates a new ticket record in the database.
 * Associates the ticket with a user if user_id is provided.
 * @param ticketData - The data for the new ticket.
 * @returns The ID of the newly inserted ticket.
 * @throws Throws an error if the database insertion fails.
 */
export async function createTicket(ticketData: CreateTicketData): Promise<number> {
  let connection;
  try {
    connection = await pool.getConnection();
    // Note: SQL uses `customer_name`, not `name` from the input interface
    const sql = `
      INSERT INTO tickets (customer_name, email, category, urgency, subject, description, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      ticketData.name, // Map input 'name' to 'customer_name' column
      ticketData.email,
      ticketData.category,
      ticketData.urgency,
      ticketData.subject,
      ticketData.description,
      'Open', // Default status
      ticketData.user_id ?? null, // Use provided user_id or null if guest
      // ticketData.filePath || null, // Uncomment if handling file uploads
    ];

    const [result] = await connection.execute<ResultSetHeader>(sql, values);

    if (result.insertId) {
      console.log(`Ticket created with ID: ${result.insertId} (User ID: ${ticketData.user_id ?? 'Guest'})`);
      return result.insertId;
    } else {
      throw new Error('Failed to create ticket: No insert ID returned.');
    }
  } catch (error) {
    console.error('Error creating ticket in database:', error);
    // Consider more specific error handling or logging
    throw new Error('Database error: Failed to create ticket.');
  } finally {
    if (connection) {
      connection.release(); // Ensure the connection is always released
    }
  }
}

/**
 * Retrieves all tickets from the database.
 * @returns An array of all ticket objects.
 * @throws Throws an error if there's a database issue.
 */
export async function getAllTickets(): Promise<Ticket[]> {
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = 'SELECT * FROM tickets ORDER BY created_at DESC'; // Order by newest first
    const [rows] = await connection.execute<RowDataPacket[]>(sql);
    return rows as Ticket[];
  } catch (error) {
    console.error('Error fetching all tickets from database:', error);
    throw new Error('Database error: Failed to fetch tickets.');
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


// Future potential functions:
// export async function getTicketById(id: number): Promise<Ticket | null> { ... }
// export async function updateTicketStatus(id: number, status: string): Promise<boolean> { ... }
// export async function getTicketsByUserId(userId: number): Promise<Ticket[]> { ... }
