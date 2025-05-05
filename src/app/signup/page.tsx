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
import { ArrowLeft, LifeBuoy, UserPlus } from 'lucide-react';
import { signupAction, type SignupFormState } from './actions';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

// Define the form schema using Zod
const signupFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

// Default values for the form
const defaultValues: Partial<SignupFormValues> = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialState: SignupFormState = {
    message: '',
    success: false,
    errors: {},
}

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formState, formAction] = useFormState(signupAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues,
    mode: 'onChange', // Validate on change
  });

 React.useEffect(() => {
    if (formState?.success) {
      toast({
        title: 'Signup Successful!',
        description: formState.message + ' Redirecting to login...',
        variant: 'default',
      });
      form.reset(); // Reset form on successful submission
      // Redirect to login page after a short delay
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000); // 2 second delay
      return () => clearTimeout(timer); // Cleanup timer on component unmount

    } else if (formState && formState.message && !formState.success) {
       toast({
        title: 'Signup Error',
        description: formState.message,
        variant: 'destructive',
      });
       if (formState.errors) {
            Object.entries(formState.errors).forEach(([key, value]) => {
                if (value && value.length > 0) {
                   form.setError(key as keyof SignupFormValues, {
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
             <CardTitle className="text-2xl">Create Account</CardTitle>
             <CardDescription>Sign up to start submitting tickets.</CardDescription>
           </CardHeader>
           <CardContent>
             <Form {...form}>
               <form
                  ref={formRef}
                  action={formAction} // Use the server action
                  className="space-y-4" // Reduced vertical space
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                 <SubmitButton />

                 <div className="text-center text-sm text-muted-foreground pt-4">
                  Already have an account?{" "}
                  <Link href="/login" className="underline text-primary hover:text-primary/80">
                    Log in
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
    const { pending } = useFormState();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                </>
            ) : (
                 <>
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                 </>
            )}
        </Button>
    );
}
