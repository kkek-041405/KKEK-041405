
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, MapPin, MessageSquare, Send } from "lucide-react"; // Added Send for form
import Link from "next/link";
import type { Metadata } from 'next';
// import { ContactForm } from '@/components/contact-form'; // Assuming a contact form component might be added later

export const metadata: Metadata = {
  title: 'Contact - K. Komal Eshwara Kumar | Portfolio',
  description: 'Get in touch with K. Komal Eshwara Kumar (KKEK). Open for collaborations and new opportunities.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1">
        <section id="contact" className="py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-12 flex items-center justify-center gap-3">
              <MessageSquare className="h-10 w-10 text-primary" /> Get In Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              I'm actively seeking new opportunities and collaborations. If you have a project in mind, a question, or just want to connect, feel free to reach out! I typically respond within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-primary/50 transition-shadow">
                <Link href="mailto:k.komaleshwarakumar@example.com"> {/* Updated email */}
                  <Mail className="mr-2 h-5 w-5" /> Send an Email
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto shadow-lg hover:shadow-accent/50 transition-shadow">
                <Link href="https://linkedin.com/in/kkeshkumar" target="_blank" rel="noopener noreferrer"> {/* Updated LinkedIn URL */}
                  <Linkedin className="mr-2 h-5 w-5" /> Connect on LinkedIn
                </Link>
              </Button>
            </div>
            
            {/* Placeholder for a potential contact form component */}
            {/* <div className="max-w-lg mx-auto mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-center">Or Send a Message Directly</h2>
              <ContactForm />
            </div> */}

            <div className="mt-16 text-muted-foreground flex flex-col items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Based in Guntur, Andhra Pradesh, India</span> {/* Updated location */}
              <span className="text-sm">(Open to remote opportunities)</span>
            </div>
          </div>
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
