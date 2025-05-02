'use server';

import * as z from 'zod';
import { createTicket } from '@/services/ticket-service';

// Define the form schema using Zod (should match the one in the client component)
const ticketFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  category: z.enum(['technical', 'billing', 'general', 'bug']),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.'}),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).max(500, {message: 'Description cannot exceed 500 characters.'}),
  // file: z.any().optional(), // Ignoring file for now
});

export type TicketFormState = {
  message: string;
  errors?: {
    [K in keyof z.infer<typeof ticketFormSchema>]?: string[];
  };
  success: boolean;
};

export async function submitTicketAction(
  prevState: TicketFormState | undefined, // Changed to allow undefined initial state
  formData: FormData,
): Promise<TicketFormState> {
  // Validate form data
  const validatedFields = ticketFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    category: formData.get('category'),
    urgency: formData.get('urgency'),
    subject: formData.get('subject'),
    description: formData.get('description'),
    // file: formData.get('file'), // Ignoring file for now
  });

  // Return errors if validation fails
  if (!validatedFields.success) {
    console.log('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check the form fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // Prepare data for database insertion
  const ticketData = validatedFields.data;

  try {
    // Call the service function to create the ticket
    const newTicketId = await createTicket(ticketData);
    console.log(`Ticket successfully created with ID: ${newTicketId}`);
    return {
      message: `Ticket submitted successfully! Your ticket ID is ${newTicketId}.`,
      success: true,
    };
  } catch (error) {
    console.error('Error submitting ticket:', error);
    let errorMessage = 'An unexpected error occurred while submitting the ticket.';
    if (error instanceof Error) {
        errorMessage = error.message; // Use specific error message if available
    }
     // Provide a generic error message to the user for database errors
    if (errorMessage.startsWith('Database error:')) {
        errorMessage = 'Could not save ticket to the database. Please try again later.';
    }
    return {
      message: errorMessage,
      success: false,
    };
  }
}
