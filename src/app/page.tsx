
"use client";

import { Button } from "@/components/ui/button";
import { 
  Mail, Download, Github, Linkedin, ExternalLink
} from "lucide-react";
import Link from "next/link";
import AnimatedSection from '@/components/animated-section';
import { Badge } from "@/components/ui/badge";

export default function PortfolioPage() {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <main className="flex-1 flex flex-col">
        <section id="home" className="flex-1 flex flex-col justify-center items-center text-center p-4 relative">
          {/* Background Gradient */}
          <div 
            className="absolute inset-x-0 -z-10 h-full w-full bg-black 
            bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,119,255,0.3),rgba(255,255,255,0))]"
          ></div>
          
          <AnimatedSection delay="delay-100" className="flex flex-col items-center">
            <Badge variant="outline" className="mb-6 border-blue-500/50 text-blue-400 bg-blue-900/20">
                Seeking Android Development Internships
            </Badge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-400">
                Komal Eshwara Kumar Konatham
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg md:text-xl text-zinc-400">
                A final-year CSE student and passionate Android Developer creating polished, production-ready mobile applications.
            </p>
          </AnimatedSection>
            
          <AnimatedSection delay="delay-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700">
                  <Link href="mailto:komaleshwarakumarkonatham@gmail.com">
                    Get in Touch <Mail className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white">
                  <Link href="/resume" target="_blank">
                    View Resume <Download className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
            </div>
          </AnimatedSection>

          {/* Social links at the bottom */}
          <div className="absolute bottom-8">
            <div className="flex justify-center gap-x-6">
              <Link href="https://linkedin.com/in/kkek" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="https://github.com/kkek-041405" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="mailto:komaleshwarakumarkonatham@gmail.com" aria-label="Email" className="text-zinc-500 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </Link>
              <Link href="https://play.google.com/store/apps/dev?id=6378119908597517835" aria-label="Google Play Developer Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                <ExternalLink className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
