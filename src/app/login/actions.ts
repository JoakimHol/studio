'use server';

import * as z from 'zod';
import { findUserByEmail, verifyPassword } from '@/services/user-service';
import type { User } from '@/services/user-service'; // Import User type

// Define the form schema using Zod
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }), // Basic check, service validates length
});

export type LoginFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[]; // For general errors not tied to a specific field
  };
  success: boolean;
  role?: User['role']; // Add role to the state
};

export async function loginAction(
  prevState: LoginFormState | undefined,
  formData: FormData,
): Promise<LoginFormState> {
  // Validate form data
  const validatedFields = loginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // Return errors if basic client-side validation fails
  if (!validatedFields.success) {
    console.log('Client Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 1. Find user by email
    const user = await findUserByEmail(email);

    if (!user) {
      return {
        message: 'Invalid email or password.',
        success: false,
        errors: { general: ['Invalid email or password.'] }, // Generic error
      };
    }

    // 2. Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return {
        message: 'Invalid email or password.',
        success: false,
        errors: { general: ['Invalid email or password.'] }, // Generic error
      };
    }

    // 3. Login successful - return success state with role
    console.log(`Login successful for user: ${user.email}, Role: ${user.role}`);

    // Here you would typically:
    // - Create a session (e.g., using JWT, cookies, or a session library)
    // - Store user ID and role in the session
    // For this example, we'll just return the success state and role.
    // The client-side useEffect will handle redirection based on the role.

    return {
      message: `Login successful! Welcome, ${user.name}.`,
      success: true,
      role: user.role, // Return the user's role
    };

  } catch (error) {
    console.error('Error during login:', error);
    let errorMessage = 'An unexpected error occurred during login.';
    if (error instanceof Error && error.message.startsWith('Database error:')) {
        errorMessage = 'Could not connect to the authentication service. Please try again later.';
    } else if (error instanceof Error) {
        // Don't expose detailed internal errors to the user
        // errorMessage = error.message;
    }

    return {
      message: errorMessage,
      success: false,
      errors: { general: [errorMessage] },
    };
  }
}
