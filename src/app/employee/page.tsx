'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Filter,
  Search,
  Ticket as TicketIcon, // Renamed to avoid conflict with type
  MoreHorizontal,
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
import { getAllTickets, type Ticket } from '@/services/ticket-service'; // Import service and type
import { format } from 'date-fns'; // For formatting dates

// Define types explicitly if not imported or different from service
type TicketStatus = 'Open' | 'In Progress' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';


// Component now focuses on the main content area
export default function EmployeeDashboardPage() {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState<TicketStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        async function fetchTickets() {
            setLoading(true);
            setError(null);
            try {
                const fetchedTickets = await getAllTickets();
                setTickets(fetchedTickets);
            } catch (err) {
                console.error("Failed to fetch tickets:", err);
                setError(err instanceof Error ? err.message : 'Failed to load tickets.');
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, []); // Fetch tickets on component mount

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

     const filteredTickets = tickets.filter(ticket => {
        const matchesTab = activeTab === 'All' || ticket.status === activeTab;
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch =
            (ticket.id?.toString() ?? '').toLowerCase().includes(lowerSearchTerm) || // Check id exists
            (ticket.customer_name || '').toLowerCase().includes(lowerSearchTerm) || // Use customer_name
            (ticket.subject || '').toLowerCase().includes(lowerSearchTerm) ||
            (ticket.email || '').toLowerCase().includes(lowerSearchTerm);
        return matchesTab && matchesSearch;
    });

    if (loading) {
        return <p>Loading tickets...</p>; // Add a proper skeleton loader later
    }

    if (error) {
        return <p className="text-destructive">Error: {error}</p>;
    }

  return (
    <>
      {/* Header Elements Specific to this Page */}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl">Tickets</h1>
        <div className="flex items-center gap-4">
           {/* Search Bar */}
           <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                 <TicketIcon className="h-3.5 w-3.5" />
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
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
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
                        <TableCell>{ticket.customer_name}</TableCell>
                        <TableCell>{ticket.email}</TableCell>
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
                        <TableCell>{ticket.created_at ? format(new Date(ticket.created_at), 'PPp') : 'N/A'}</TableCell>
                        <TableCell>
                           {/* Action Dropdown per Ticket */}
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button aria-haspopup="true" size="icon" variant="ghost">
                                   <MoreHorizontal className="h-4 w-4" />
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
                      <TableCell colSpan={8} className="h-24 text-center">
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
    </>
  );
}
