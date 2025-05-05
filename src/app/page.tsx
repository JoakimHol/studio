
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheckBig, LifeBuoy, MessageSquare, Users } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Fixed position for buttons */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6">
          {/* Buttons positioned top-right */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center space-x-2">
            <Button asChild variant="outline" className="bg-background/80 hover:bg-background backdrop-blur-sm">
              {/* Changed link to /login */}
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary/90 hover:bg-primary backdrop-blur-sm">
              <Link href="/submit-ticket">Submit Ticket</Link>
            </Button>
          </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-32 md:py-48 min-h-[60vh] flex items-center justify-center text-center overflow-hidden">
          <Image
            src="https://picsum.photos/1600/900"
            alt="Helpdesk background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 -z-10"
            data-ai-hint="customer support team office abstract background"
            priority
          />
          <div className="absolute inset-0 bg-black/30 -z-10" aria-hidden="true" />

          <div className="container relative z-10 text-white px-4"> {/* Added px-4 for padding on small screens */}
            {/* Centered Logo Box */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[-16rem] md:mt-[-18rem]"> {/* Adjust vertical offset as needed */}
              <div className="inline-block bg-background/80 p-6 rounded-lg shadow-xl mx-auto backdrop-blur-sm">
                <Link href="/" className="flex items-center space-x-3">
                  <LifeBuoy className="h-10 w-10 text-primary" />
                  <span className="text-2xl font-bold text-foreground">HelpDesk HQ</span>
                </Link>
              </div>
            </div>


            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-24 md:mt-16"> {/* Adjusted margin top */}
              Need Help? We've Got You Covered.
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
              Welcome to HelpDesk HQ, your central hub for reporting issues and getting support quickly and efficiently.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"> {/* Adjusted for better stacking on small screens */}
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
          <div className="container mx-auto px-4"> {/* Ensure container has mx-auto and padding */}
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose HelpDesk HQ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"> {/* Centered the grid content */}
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
          <div className="container mx-auto px-4 text-center"> {/* Ensure container has mx-auto and padding */}
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
      <footer className="py-6 md:py-8 border-t bg-background">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row"> {/* Ensure container has mx-auto and padding */}
          <p className="text-sm text-muted-foreground text-center md:text-left"> {/* Center text on small screens */}
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
