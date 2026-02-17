
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Menu,
  Code2,
  Download,
  NotebookText,
  User,
  LayoutGrid,
  Phone,
  Home,
  LockKeyhole,
  Feather,
  Cpu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggleButton } from "./theme-toggle-button";
import { NoteAuthForm, type NoteAuthFormValues } from "@/components/note-auth-form";
import { useToast } from "@/hooks/use-toast";
import { getAccessCodeFromFirestore } from "@/services/config-service";

export function PortfolioHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const navLinks = [
    { href: "/#home", label: "Home", icon: Home },
    { href: "/#about", label: "About", icon: User },
    { href: "/#skills", label: "Skills", icon: Cpu },
    { href: "/#projects", label: "Projects", icon: LayoutGrid },
    { href: "/stories/why", label: "Stories", icon: Feather },
    { href: "/#contact", label: "Contact", icon: Phone },
    { href: "/notes", label: "Notes", icon: NotebookText, isAuthTrigger: true },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      if (typeof window !== "undefined") {
        const currentHash = window.location.hash;
        if (href === "/#home" && pathname === "/" && !currentHash) return true;
        return currentHash === href.substring(1);
      }
      return pathname === "/" && href === "/#home";
    }
    if (href === "/notes") {
      return pathname.startsWith('/notes');
    }
    return pathname.startsWith(href);
  };

  const handleAuthSubmit = async (data: NoteAuthFormValues) => {
    setIsAuthLoading(true);
    const correctAccessCode = await getAccessCodeFromFirestore();

    if (correctAccessCode && data.accessCode === correctAccessCode) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("notesAuthenticated", "true");
      }
      router.push("/notes/content");
      setIsAuthDialogOpen(false);
      setIsMobileMenuOpen(false);
    } else {
      toast({
        title: "Access Denied",
        description: "The access code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
    setIsAuthLoading(false);
  };

  const renderNavButton = (link: (typeof navLinks)[0], isMobile: boolean) => {
    const buttonProps = {
      variant: "ghost" as "ghost",
      className: isMobile ? "w-full justify-start text-lg py-3" : `text-muted-foreground hover:text-foreground ${isActive(link.href) ? 'text-foreground' : ''}`,
    };

    if (link.isAuthTrigger) {
      return (
        <Dialog key={`${link.label}-dialog-${isMobile ? 'mobile' : 'desktop'}`} open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <DialogTrigger asChild>
            <Button {...buttonProps}>
              {isMobile && link.icon && <link.icon className="mr-2 h-5 w-5" />}
              {link.label}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="items-center text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                <LockKeyhole className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl">Access Protected Notes</DialogTitle>
              <DialogDescription>
                Please enter the access code to view your notes.
              </DialogDescription>
            </DialogHeader>
            <NoteAuthForm onAuthenticate={handleAuthSubmit} isLoading={isAuthLoading} />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Button {...buttonProps} asChild key={link.href} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        <Link href={link.href!}>
          {isMobile && link.icon && <link.icon className="mr-2 h-5 w-5" />}
          {link.label}
        </Link>
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/#home" className="flex items-center gap-2">
          <Code2 className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl tracking-tight">KKEK</span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => renderNavButton(link, false))}
          </nav>

          <ThemeToggleButton />

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm p-0">
                 <div className="flex justify-between items-center p-6 border-b">
                    <Link href="/#home" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Code2 className="h-7 w-7 text-primary" />
                        <span className="font-bold text-xl tracking-tight">KKEK</span>
                    </Link>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                           <X className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                  {navLinks.map(link => renderNavButton(link, true))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
