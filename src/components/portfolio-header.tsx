
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PortfolioHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const pathname = usePathname();

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' },
  ];

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = navLinks.map(link => document.getElementById(link.href.substring(1))).filter(Boolean);
      let currentSection = '';

      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
            break;
          }
        }
      }
      if(currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const renderNavLinks = (isMobile = false) => {
    return (
        <>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                className={cn(
                  "nav-link-underline relative text-sm font-medium transition-colors hover:text-primary",
                  activeSection === link.href.substring(1) ? "text-primary active" : "text-muted-foreground",
                  isMobile ? "block p-4 text-lg" : "px-3 py-2"
                )}
              >
                {link.label}
              </a>
            ))}
             <Button asChild variant="outline" className="ml-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary rounded-full">
                <a href="/resume" target="_blank" rel="noopener noreferrer">Resume</a>
            </Button>
        </>
    )
  };
  
  if (pathname !== '/') return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
      <div className="container flex h-20 items-center justify-between">
        <a href="#about" className="text-lg font-bold">
          K. K. Eshwara Kumar <span className="text-primary font-normal hidden sm:inline">| Android Developer</span>
        </a>
        <nav className="hidden md:flex items-center">
          {renderNavLinks()}
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-900 border-l-slate-800 w-full">
                <nav className="flex flex-col pt-10">
                    {renderNavLinks(true)}
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
