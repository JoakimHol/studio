// src/app/dashboard/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LifeBuoy, Ticket, User } from 'lucide-react';

export default function CustomerDashboard() {
  // In a real app, you'd fetch user-specific data here
  // For now, it's just a placeholder

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LifeBuoy className="h-6 w-6 text-primary" />
            <span className="font-bold">HelpDesk HQ</span>
          </Link>
          <div className="flex items-center gap-4">
             {/* Add profile/logout button later */}
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" /> My Profile
            </Button>
             <Button variant="destructive" size="sm">Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card for Submitting Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Ticket</CardTitle>
              <CardDescription>Need help? Open a new support request.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/submit-ticket">
                  <Ticket className="mr-2 h-4 w-4" /> Create New Ticket
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card for Viewing Tickets (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>My Tickets</CardTitle>
              <CardDescription>View the status of your submitted tickets.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                (Ticket viewing functionality coming soon!)
              </p>
              <Button variant="secondary" className="w-full" disabled>
                View My Tickets
              </Button>
            </CardContent>
          </Card>

          {/* Placeholder for other potential dashboard cards */}
          <Card className="bg-muted/40 border-dashed">
            <CardHeader>
              <CardTitle>Knowledge Base (Coming Soon)</CardTitle>
              <CardDescription>Find answers to common questions.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-sm text-muted-foreground">...</p>
             </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t bg-muted/40">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} HelpDesk HQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
