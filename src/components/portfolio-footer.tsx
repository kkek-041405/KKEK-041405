
import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink, Code2 } from "lucide-react";

export function PortfolioFooter() {
  return (
    <footer className="border-t bg-background/50">
      <div className="container py-8 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Link href="#home" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">KKEK</span>
          </Link>
        </div>
        <div className="mb-6 flex justify-center gap-x-6">
          <Link href="https://linkedin.com/in/kkek" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link href="https://github.com/kkek-041405" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
          </Link>
          <Link href="mailto:komaleshwarakumarkonatham@gmail.com" aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="h-6 w-6" />
          </Link>
           <Link href="https://play.google.com/store/apps/dev?id=6378119908597517835" aria-label="Google Play Developer Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="h-6 w-6" />
          </Link>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Komal Eshwara Kumar Konatham. All Rights Reserved.</p>
        <div className="text-xs mt-4 flex justify-center items-center gap-x-4">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
