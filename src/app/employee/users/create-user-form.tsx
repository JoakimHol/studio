// src/app/employee/users/create-user-form.tsx
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createUserAction, type CreateUserFormState } from './actions';
import { useFormState } from 'react-dom';
import { UserPlus } from 'lucide-react';

// Define the form schema using Zod (must match server action)
const createUserFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  role: z.enum(['customer', 'admin'], {
    required_error: 'Please select a role.',
  }),
});

type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

// Default values for the form
const defaultValues: Partial<CreateUserFormValues> = {
  name: '',
  email: '',
  password: '',
  role: 'customer', // Default to customer
};

const initialState: CreateUserFormState = {
    message: '',
    success: false,
    errors: {},
}

export function CreateUserForm({ onUserCreated }: { onUserCreated: () => void }) {
  const { toast } = useToast();
  const [formState, formAction] = useFormState(createUserAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues,
    mode: 'onChange',
  });

 React.useEffect(() => {
    if (formState?.success) {
      toast({
        title: 'Success!',
        description: formState.message,
        variant: 'default',
      });
      form.reset(); // Reset form on successful submission
      onUserCreated(); // Notify parent component to potentially close dialog/refresh list
    } else if (formState && formState.message && !formState.success) {
       toast({
        title: 'Creation Error',
        description: formState.message,
        variant: 'destructive',
      });
       if (formState.errors) {
            Object.entries(formState.errors).forEach(([key, value]) => {
                if (value && value.length > 0) {
                   form.setError(key as keyof CreateUserFormValues, {
                       type: 'server',
                       message: value[0],
                   });
                }
            });
       }
    }
  }, [formState, toast, form, onUserCreated]);


  return (
     <Form {...form}>
       <form
          ref={formRef}
          action={formAction}
          className="space-y-4"
       >
         <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

         <SubmitButton />
       </form>
     </Form>
  );
}

// Extracted SubmitButton to use useFormStatus
function SubmitButton() {
    const { pending } = useFormState();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating User...
                </>
            ) : (
                 <>
                    <UserPlus className="mr-2 h-4 w-4" /> Create User
                 </>
            )}
        </Button>
    );
}
```