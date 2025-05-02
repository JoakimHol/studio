'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, LifeBuoy } from 'lucide-react';
import { submitTicketAction, type TicketFormState } from './actions'; // Import the server action and state type
import { useFormState } from 'react-dom'; // Import useFormState

// Define the form schema using Zod (ensure this matches the action's schema)
const ticketFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  category: z.enum(['technical', 'billing', 'general', 'bug'], {
    required_error: 'Please select a category.',
  }),
  urgency: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'Please select an urgency level.',
  }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.'}),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).max(500, {message: 'Description cannot exceed 500 characters.'}),
  file: z.any().optional(), // Keep for potential future use, but not sent to action
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

// Default values for the form
const defaultValues: Partial<TicketFormValues> = {
  name: '',
  email: '',
  subject: '',
  description: '',
  category: undefined, // Ensure select placeholders work
  urgency: undefined,
};

const initialState: TicketFormState = {
    message: '',
    success: false,
    errors: {},
}

export default function TicketSubmissionPage() {
  const { toast } = useToast();
  const [formState, formAction] = useFormState(submitTicketAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
    mode: 'onChange', // Validate on change for better UX
  });

 React.useEffect(() => {
    if (formState?.success) {
      toast({
        title: 'Success!',
        description: formState.message,
        variant: 'default',
      });
      form.reset(); // Reset form on successful submission
    } else if (formState && formState.message && !formState.success) {
      // Display server-side validation errors or general submission errors
       toast({
        title: 'Submission Error',
        description: formState.message,
        variant: 'destructive', // Use destructive style for errors
      });
       // Optionally set form errors from server state if needed for specific fields
       if (formState.errors) {
            Object.entries(formState.errors).forEach(([key, value]) => {
                if (value && value.length > 0) {
                   form.setError(key as keyof TicketFormValues, {
                       type: 'server',
                       message: value[0], // Show the first error message
                   });
                }
            });
       }
    }
  }, [formState, toast, form]);


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
         <Card className="w-full max-w-2xl shadow-lg">
           <CardHeader>
             <CardTitle className="text-2xl text-center">Submit a New Ticket</CardTitle>
           </CardHeader>
           <CardContent>
             <Form {...form}>
               <form
                  ref={formRef}
                  action={formAction} // Use the server action
                  className="space-y-6"
                  // We don't need onSubmit handler anymore when using useFormState
               >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
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
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select urgency level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 </div>

                 <FormField
                   control={form.control}
                   name="subject"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Subject</FormLabel>
                       <FormControl>
                         <Input placeholder="Briefly describe the issue" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="description"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Description</FormLabel>
                       <FormControl>
                         <Textarea
                           placeholder="Please provide detailed information about the issue..."
                           className="resize-y min-h-[100px]"
                           {...field}
                         />
                       </FormControl>
                        <FormDescription>
                          Please be as specific as possible. Max 500 characters.
                        </FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                  {/* Basic File Input - Kept for UI, but not processed by action yet */}
                 <FormField
                    control={form.control} // Need control for React Hook Form
                    name="file"
                    render={({ field: { onChange, onBlur, name, ref } }) => ( // Destructure correctly for file input
                      <FormItem>
                        <FormLabel>Attach File (Optional)</FormLabel>
                        <FormControl>
                          <Input
                             type="file"
                             ref={ref} // Pass the ref
                             name={name} // Pass the name
                             onBlur={onBlur} // Pass onBlur
                             onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} // Use onChange from RHF field
                             className="pt-1.5"
                           />
                        </FormControl>
                        <FormDescription>
                          File upload not yet implemented on the server.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                 <SubmitButton />
               </form>
             </Form>
           </CardContent>
         </Card>
       </main>

       {/* Footer */}
      <footer className="py-6 md:px-8 md:py-8 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HelpDesk HQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Extracted SubmitButton to use useFormStatus
function SubmitButton() {
    const { pending } = useFormState(); // Get pending state directly

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                </>
            ) : (
                'Submit Ticket'
            )}
        </Button>
    );
}
