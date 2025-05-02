
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, LifeBuoy, MessageSquare, Users, CircleCheckBig } from 'lucide-react'; // Corrected icon import
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Now transparent and absolutely positioned */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container flex h-14 items-center justify-end">
          {/* Logo removed from here */}
          <nav className="flex flex-1 items-center space-x-4">
            {/* Add future nav items here if needed */}
          </nav>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" className="bg-background/80 hover:bg-background">
              <Link href="/employee">Employee Login</Link>
            </Button>
            <Button asChild className="bg-primary/90 hover:bg-primary">
              <Link href="/submit-ticket">Submit Ticket</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-32 md:py-48 min-h-[60vh] flex items-center justify-center text-center overflow-hidden"> {/* Increased padding, added min-height, flex centering */}
          {/* Background Image */}
          <Image
            src="https://picsum.photos/1600/900" // Larger image for background
            alt="Helpdesk background"
            layout="fill" // Changed to fill
            objectFit="cover" // Changed to cover
            className="absolute inset-0 -z-10" // Positioned as background
            data-ai-hint="customer support team office abstract background"
            priority
          />
          {/* Optional overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 -z-10" aria-hidden="true" />

          <div className="container relative z-10 text-white"> {/* Changed text color to white for contrast */}
            {/* Logo Box - Centered on Image */}
            <div className="inline-block bg-background/80 p-6 rounded-lg shadow-xl mx-auto mb-10 backdrop-blur-sm">
              <Link href="/" className="flex items-center space-x-3">
                <LifeBuoy className="h-10 w-10 text-primary" />
                <span className="text-2xl font-bold text-foreground">HelpDesk HQ</span>
              </Link>
            </div>

            {/* Hero Text - Adjusted margins */}
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl drop-shadow-md">
              Need Help? We've Got You Covered.
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto drop-shadow-sm">
              Welcome to HelpDesk HQ, your central hub for reporting issues and getting support quickly and efficiently.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
               {/* Buttons - Maybe adjust variants/colors if needed against image */}
              <Button size="lg" asChild>
                <Link href="/submit-ticket">Submit a Ticket Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20 backdrop-blur-sm" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose HelpDesk HQ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Easy Ticket Submission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Quickly submit your issues through our simple and intuitive form. Attach files if needed.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                   <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                    {/* Use CircleCheckBig or another valid Check icon */}
                    <CircleCheckBig className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Track Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay updated on the status of your tickets from submission to resolution. (Feature coming soon!)
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Efficient Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our employee dashboard provides powerful tools to manage and resolve tickets effectively.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Don't let technical issues slow you down. Submit a ticket today and let our team help you out.
            </p>
            <Button size="lg" asChild>
              <Link href="/submit-ticket">Submit Your First Ticket</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 md:px-8 md:py-8 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HelpDesk HQ. All rights reserved.
          </p>
           <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
