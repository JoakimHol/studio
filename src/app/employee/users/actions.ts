// src/app/employee/users/actions.ts
'use server';

import * as z from 'zod';
import { createUser, hashPassword } from '@/services/user-service';
import type { User } from '@/services/user-service';

// Define the form schema using Zod (must match client-side)
const createUserFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  role: z.enum(['customer', 'admin'], {
    required_error: 'Please select a role.',
  }),
});

export type CreateUserFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    general?: string[]; // For general errors like database connection
  };
  success: boolean;
};

export async function createUserAction(
  prevState: CreateUserFormState | undefined,
  formData: FormData,
): Promise<CreateUserFormState> {
  // Validate form data
  const validatedFields = createUserFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
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

  const { name, email, password, role } = validatedFields.data;

  try {
    // Hash the password securely
    const hashedPassword = await hashPassword(password);

    // Prepare user data for database insertion
    const userData = {
      name,
      email,
      password_hash: hashedPassword, // Store the HASHED password
      role: role as User['role'], // Assert the role type
    };

    // Call the service function to create the user
    const newUserId = await createUser(userData);
    console.log(`User successfully created with ID: ${newUserId}`);
    return {
      message: `User account created successfully for ${email}!`,
      success: true,
    };
  } catch (error) {
    console.error('Error during user creation:', error);
    let errorMessage = 'An unexpected error occurred during user creation.';
     if (error instanceof Error) {
        // Check for specific errors from the service
        if (error.message === 'Email address already exists.') {
            return {
                message: error.message,
                success: false,
                errors: { email: [error.message] },
            };
        }
         if (error.message.startsWith('Database error:')) {
             errorMessage = 'Could not create account due to a database issue. Please try again later.';
         }
    }
    // Return general error
    return {
      message: errorMessage,
      success: false,
      errors: { general: [errorMessage] },
    };
  }
}

// TODO: Add actions for updating and deleting users
// export async function updateUserAction(...) { ... }
// export async function deleteUserAction(...) { ... }
```