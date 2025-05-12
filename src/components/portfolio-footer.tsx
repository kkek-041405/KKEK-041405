
import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function PortfolioFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-center text-muted-foreground px-4 sm:px-6 md:px-8">
        <div className="mb-4 flex justify-center gap-6">
          <Link href="https://linkedin.com/in/kkeshkumar" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
          </Link>
          <Link href="https://github.com/kkeshkumar" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer">
            <Github className="h-6 w-6 hover:text-primary transition-colors" />
          </Link>
          <Link href="mailto:k.komaleshwarakumar@example.com" aria-label="Email">
            <Mail className="h-6 w-6 hover:text-primary transition-colors" />
          </Link>
          <Link href="https://twitter.com/kkeshkumar" aria-label="Twitter Profile" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-6 w-6 hover:text-primary transition-colors" />
          </Link>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} K. Komal Eshwara Kumar. All rights reserved.</p>
        <p className="text-xs mt-2">
          Built with <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">Next.js</Link> & <Link href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">Tailwind CSS</Link>.
        </p>
      </div>
    </footer>
  );
}
