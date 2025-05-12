
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code2, Download, NotebookText, UserCircle, LayoutGrid, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { ThemeToggleButton } from './theme-toggle-button'; // Added import

export function PortfolioHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/#about", label: "About", icon: UserCircle },
    { href: "/projects", label: "Projects", icon: LayoutGrid },
    { href: "/skills", label: "Skills", icon: Code2 },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/notes", label: "Notes", icon: NotebookText },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.includes("#")) {
      return pathname === "/" || pathname === href.split("#")[0];
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl tracking-tight">KKEK</span>
        </Link>
        
        <div className="flex items-center gap-1">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button variant={isActive(link.href) ? "secondary" : "ghost"} asChild key={link.href}>
                <Link href={link.href}>
                  {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                  {link.label}
                </Link>
              </Button>
            ))}
            <Button asChild className="ml-2 shadow-sm">
              <Link href="/resume.pdf" target="_blank" download>
                  CV <Download className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>

          <ThemeToggleButton /> {/* Added Theme Toggle Button */}

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
                <nav className="flex flex-col gap-4 pt-8">
                  {navLinks.map((link) => (
                    <Button 
                      variant={isActive(link.href) ? "secondary" : "ghost"} 
                      asChild 
                      key={link.href} 
                      className="w-full justify-start text-lg py-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={link.href}>
                        {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                  <Button asChild className="w-full text-lg py-3 mt-4">
                    <Link href="/resume.pdf" target="_blank" download onClick={() => setIsMobileMenuOpen(false)}>
                      Download CV <Download className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
