'use server';
/**
 * @fileOverview Service functions for interacting with the tickets table in the database.
 */

import { pool } from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface TicketData {
  name: string;
  email: string;
  category: 'technical' | 'billing' | 'general' | 'bug';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  user_id?: number | null; // Optional: ID of the logged-in user
  // filePath?: string; // Optional file path if handling uploads
}

/**
 * Creates a new ticket record in the database.
 * Associates the ticket with a user if user_id is provided.
 * @param ticketData - The data for the new ticket.
 * @returns The ID of the newly inserted ticket.
 * @throws Throws an error if the database insertion fails.
 */
export async function createTicket(ticketData: TicketData): Promise<number> {
  let connection;
  try {
    connection = await pool.getConnection();
    const sql = `
      INSERT INTO tickets (name, email, category, urgency, subject, description, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      ticketData.name,
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

// Future potential functions:
// export async function getTicketById(id: number): Promise<TicketData | null> { ... }
// export async function updateTicketStatus(id: number, status: string): Promise<boolean> { ... }
// export async function getAllTickets(): Promise<TicketData[]> { ... }
// export async function getTicketsByUserId(userId: number): Promise<TicketData[]> { ... }
