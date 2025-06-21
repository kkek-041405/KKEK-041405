
import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function PortfolioFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10 text-center text-muted-foreground px-4 sm:px-6 md:px-8">
        <p className="text-sm font-medium mb-5">Find me on:</p>
        <div className="mb-6 flex justify-center gap-x-6 sm:gap-x-8">
          <Link href="https://linkedin.com/in/kkeshkumar" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="h-7 w-7 sm:h-8 sm:w-8" />
          </Link>
          <Link href="https://github.com/kkeshkumar" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-7 w-7 sm:h-8 sm:w-8" />
          </Link>
          <Link href="mailto:k.komaleshwarakumar@example.com" aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="h-7 w-7 sm:h-8 sm:w-8" />
          </Link>
          <Link href="https://twitter.com/kkeshkumar" aria-label="Twitter Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Twitter className="h-7 w-7 sm:h-8 sm:w-8" />
          </Link>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} K. Komal Eshwara Kumar. All rights reserved.</p>
        <div className="text-xs mt-4 flex justify-center items-center gap-x-4">
          <p>
            Built with <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">Next.js</Link> & <Link href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">Tailwind CSS</Link>.
          </p>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/privacy-policy" className="hover:text-primary underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
