'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Bell,
  Filter,
  Home,
  LifeBuoy,
  LogOut,
  Search,
  Settings,
  Ticket,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Image from 'next/image';

// Mock ticket data
const mockTickets = [
  { id: 'TKT-001', customer: 'Alice Wonderland', subject: 'Cannot login', status: 'Open', priority: 'High', date: '2024-07-25' },
  { id: 'TKT-002', customer: 'Bob The Builder', subject: 'Billing question', status: 'In Progress', priority: 'Medium', date: '2024-07-24' },
  { id: 'TKT-003', customer: 'Charlie Chaplin', subject: 'Feature request: Dark mode', status: 'Closed', priority: 'Low', date: '2024-07-23' },
  { id: 'TKT-004', customer: 'Diana Prince', subject: 'Website down', status: 'Open', priority: 'Critical', date: '2024-07-25' },
  { id: 'TKT-005', customer: 'Ethan Hunt', subject: 'Password reset issue', status: 'In Progress', priority: 'High', date: '2024-07-25' },
];

type TicketStatus = 'Open' | 'In Progress' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

interface Ticket {
  id: string;
  customer: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
}

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = React.useState<TicketStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = React.useState('');

    const getStatusBadgeVariant = (status: TicketStatus) => {
        switch (status) {
            case 'Open': return 'destructive';
            case 'In Progress': return 'secondary';
            case 'Closed': return 'default';
            default: return 'outline';
        }
    };

     const getPriorityBadgeVariant = (priority: TicketPriority) => {
        switch (priority) {
            case 'Critical': return 'destructive';
            case 'High': return 'destructive'; // Using destructive for visual emphasis
            case 'Medium': return 'secondary';
            case 'Low': return 'outline';
            default: return 'outline';
        }
    };

     const filteredTickets = mockTickets.filter(ticket => {
        const matchesTab = activeTab === 'All' || ticket.status === activeTab;
        const matchesSearch =
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
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
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                prefetch={false}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                prefetch={false}
              >
                <Ticket className="h-4 w-4" />
                Tickets
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {mockTickets.filter(t => t.status !== 'Closed').length}
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                prefetch={false}
              >
                <Users className="h-4 w-4" />
                Customers (Placeholder)
              </Link>
               <Link
                href="#"
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
             <Button size="sm" variant="ghost" className="w-full justify-start">
               <LogOut className="mr-2 h-4 w-4" />
               Logout
             </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
         {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
           {/* Mobile Sidebar Trigger (Optional, needs Sheet component) */}
           {/* <Button variant="outline" size="icon" className="lg:hidden"> <Menu /> </Button> */}

          <div className="flex-1">
             {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets by ID, customer, or subject..."
                className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

         {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-background">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg md:text-2xl">Tickets</h1>
             <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     {/* Add filtering options here */}
                    <DropdownMenuItem>Priority</DropdownMenuItem>
                    <DropdownMenuItem>Date Range</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" className="h-8 gap-1" asChild>
                  <Link href="/submit-ticket">
                     <Ticket className="h-3.5 w-3.5" />
                     <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Create Ticket
                    </span>
                  </Link>
                </Button>
            </div>
          </div>

           {/* Tabs for Ticket Status */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TicketStatus | 'All')}>
            <TabsList className="grid w-full grid-cols-4">
               <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Open">Open</TabsTrigger>
              <TabsTrigger value="In Progress">In Progress</TabsTrigger>
              <TabsTrigger value="Closed">Closed</TabsTrigger>
            </TabsList>

             {/* Ticket Table Area */}
            <TabsContent value={activeTab}> {/* Display content based on active tab */}
              <Card>
                 <CardHeader>
                    <CardTitle>Ticket List</CardTitle>
                    <CardDescription>Manage and view customer support tickets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>
                           <span className="sr-only">Actions</span>
                         </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.customer}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{ticket.subject}</TableCell>
                            <TableCell>
                               <Badge variant={getStatusBadgeVariant(ticket.status)}>
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                               <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{ticket.date}</TableCell>
                            <TableCell>
                               {/* Action Dropdown per Ticket */}
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button aria-haspopup="true" size="icon" variant="ghost">
                                       {/* Use an appropriate icon like MoreHorizontal */}
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                                     <DropdownMenuItem>Assign</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                             No tickets found {searchTerm ? `for "${searchTerm}"` : ''} {activeTab !== 'All' ? `with status "${activeTab}"` : ''}.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                 {/* Optional Card Footer for Pagination or Summary */}
                 {/* <CardFooter> <Pagination /> </CardFooter> */}
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
