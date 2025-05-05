// src/app/employee/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Bell,
  Home,
  LifeBuoy,
  LogOut,
  Settings,
  Ticket,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { getAllTickets } from '@/services/ticket-service'; // Assuming a function to get tickets count

export const metadata: Metadata = {
  title: 'Employee Dashboard - HelpDesk HQ',
  description: 'Manage tickets and users.',
};

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch data needed for layout (like open ticket count) - replace with actual DB call
  let openTicketCount = 0;
  try {
    const tickets = await getAllTickets();
    openTicketCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  } catch (error) {
      console.error("Failed to fetch ticket count for layout:", error);
      // Handle error appropriately, maybe show 0 or an error indicator
  }


  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-6">
            <Link href="/employee" className="flex items-center gap-2 font-semibold">
              <LifeBuoy className="h-6 w-6 text-primary" />
              <span>HelpDesk HQ</span>
            </Link>
            {/* Notification Bell (Example) */}
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                href="/employee"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                // Add active state logic based on current path if desired
                prefetch={false}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/employee" // Assuming tickets are on the main dashboard page
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                 // Add active state logic based on current path if desired
                prefetch={false}
              >
                <Ticket className="h-4 w-4" />
                Tickets
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {openTicketCount}
                </Badge>
              </Link>
              <Link
                href="/employee/users"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                 // Add active state logic based on current path if desired
                prefetch={false}
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link
                href="#" // Placeholder for settings
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                prefetch={false}
              >
                <Settings className="h-4 w-4" />
                Settings (Placeholder)
              </Link>
            </nav>
          </div>
          {/* Sidebar Footer Example */}
          <div className="mt-auto p-4 border-t">
             {/* Add logout functionality later */}
            <Button size="sm" variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Rendered by page.tsx */}
      <div className="flex flex-col">
        {/* Header - Moved common header elements here */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
          {/* Mobile Sidebar Trigger (Optional, needs Sheet component) */}
          {/* <Button variant="outline" size="icon" className="lg:hidden"> <Menu /> </Button> */}
          <div className="flex-1">
            {/* Search or other header elements can go here if needed globally within /employee */}
          </div>
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                 <Image
                  src="https://picsum.photos/32/32" // Placeholder user image
                  width={32}
                  height={32}
                  alt="User Avatar"
                  className="rounded-full"
                  data-ai-hint="user avatar placeholder"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Add logout functionality later */}
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {/* Page Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
