

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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, LifeBuoy, LogIn } from 'lucide-react';
import { loginAction, type LoginFormState } from './actions'; // Import the server action and state type
import { useFormState, useFormStatus } from 'react-dom'; // Import useFormState and useFormStatus
import { useRouter } from 'next/navigation'; // Import useRouter

// Define the form schema using Zod
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// Default values for the form
const defaultValues: Partial<LoginFormValues> = {
  email: '',
  password: '',
};

const initialState: LoginFormState = {
    message: '',
    success: false,
    errors: {},
}

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [formState, formAction] = useFormState(loginAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: 'onChange', // Validate on change
  });

 React.useEffect(() => {
    if (formState?.success) {
      toast({
        title: 'Login Successful!',
        description: formState.message + ' Redirecting...',
        variant: 'default',
      });
      form.reset(); // Reset form on successful submission

      // Redirect based on role
      const redirectPath = formState.role === 'admin' ? '/employee' : '/dashboard';
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, 1500); // 1.5 second delay
      return () => clearTimeout(timer); // Cleanup timer on component unmount

    } else if (formState && formState.message && !formState.success) {
       toast({
        title: 'Login Error',
        description: formState.message,
        variant: 'destructive',
      });
       // Optionally set form errors from server state if needed for specific fields
       if (formState.errors) {
            Object.entries(formState.errors).forEach(([key, value]) => {
                if (value && value.length > 0 && (key === 'email' || key === 'password' || key === 'general')) {
                   // Set error only for valid form fields or general error
                   form.setError(key as keyof LoginFormValues | 'general', {
                       type: 'server',
                       message: value[0], // Show the first error message
                   });
                }
            });
       }
    }
  }, [formState, toast, form, router]);


  return (
    <div className="flex flex-col min-h-screen bg-secondary">
       {/* Simple Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
             <LifeBuoy className="h-6 w-6 text-primary" />
             <span className="font-bold">HelpDesk HQ</span>
          </Link>
           <Button variant="ghost" size="sm" asChild>
             <Link href="/">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Home
             </Link>
           </Button>
        </div>
      </header>

       <main className="flex-1 flex items-center justify-center py-12 px-4">
         <Card className="w-full max-w-md shadow-lg">
           <CardHeader className="text-center">
             <CardTitle className="text-2xl">Login</CardTitle>
             <CardDescription>Enter your credentials to access your account.</CardDescription>
           </CardHeader>
           <CardContent>
             <Form {...form}>
               <form
                  ref={formRef}
                  action={formAction} // Use the server action
                  className="space-y-6"
               >
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
                         {/* Optional: Add forgot password link here */}
                         <div className="text-right text-sm">
                             <Link href="#" className="underline text-muted-foreground hover:text-primary">
                                Forgot password?
                             </Link>
                         </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Display general errors */}
                  {formState?.errors?.general && (
                      <FormMessage className="text-destructive">
                        {formState.errors.general[0]}
                      </FormMessage>
                    )}

                 <SubmitButton />

                 <div className="text-center text-sm text-muted-foreground pt-4">
                  Don't have an account?{" "}
                  <Link href="/signup" className="underline text-primary hover:text-primary/80">
                    Sign up
                  </Link>
                </div>
               </form>
             </Form>
           </CardContent>
         </Card>
       </main>

       {/* Footer */}
      <footer className="py-6 md:px-8 md:py-8 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} HelpDesk HQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Extracted SubmitButton to use useFormStatus
function SubmitButton() {
    const { pending } = useFormStatus(); // Corrected hook

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                </>
            ) : (
                 <>
                    <LogIn className="mr-2 h-4 w-4" /> Login
                 </>
            )}
        </Button>
    );
}
