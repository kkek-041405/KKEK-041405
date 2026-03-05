
import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink, Code2 } from "lucide-react";

export function PortfolioFooter() {
  return (
    <footer id="contact" className="border-t border-slate-800/50 bg-slate-950/50">
      <div className="container py-12 text-center text-muted-foreground">
        <div className="mb-8 inline-block">
          <h2 className="text-3xl font-bold text-slate-100">Get in Touch</h2>
          <div className="mt-2 h-1 w-16 bg-primary rounded-full mx-auto"></div>
        </div>
        <p className="max-w-md mx-auto mb-6">
            I'm currently seeking Android Developer internship opportunities. Feel free to reach out via email or connect with me on social media.
        </p>
        <div className="mb-8 flex justify-center gap-x-6">
          <a href="https://linkedin.com/in/kkek" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="https://github.com/kkek-041405" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
          </a>
          <a href="mailto:komaleshwarakumarkonatham@gmail.com" aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="h-6 w-6" />
          </a>
           <a href="https://play.google.com/store/apps/dev?id=6378119908597517835" aria-label="Google Play Developer Profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="h-6 w-6" />
          </a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Komal Eshwara Kumar Konatham. All Rights Reserved.</p>
        <div className="text-xs mt-4 flex justify-center items-center gap-x-4">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
