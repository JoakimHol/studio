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

// Define the form schema using Zod
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
  // file: z.instanceof(File).optional(), // File upload handling would require server action/API
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

// Default values for the form
const defaultValues: Partial<TicketFormValues> = {
  name: '',
  email: '',
  subject: '',
  description: '',
};

export default function TicketSubmissionPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: TicketFormValues) {
    setIsSubmitting(true);
    console.log(data); // Log data for now, replace with actual submission logic

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    toast({
      title: 'Ticket Submitted!',
      description: 'Your request has been received. We will get back to you shortly.',
      variant: 'default', // Use default style
    });
    form.reset(); // Reset form after successful submission
  }

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
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                  {/* Basic File Input - Styling might need adjustment */}
                 <FormField
                    name="file" // Assuming you add 'file' to your schema if needed
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attach File (Optional)</FormLabel>
                        <FormControl>
                           {/* Basic file input. For better UX, consider a dedicated file upload component */}
                          <Input
                             type="file"
                             onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                             className="pt-1.5" // Adjust padding for file input
                           />
                        </FormControl>
                        <FormDescription>
                          You can attach relevant screenshots or documents.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                 <Button type="submit" className="w-full" disabled={isSubmitting}>
                   {isSubmitting ? (
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
