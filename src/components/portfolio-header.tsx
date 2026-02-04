
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
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
  UserCircle,
  LayoutGrid,
  Phone,
  Home,
  LockKeyhole,
  Feather,
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
    { href: "/#about", label: "About", icon: UserCircle },
    { href: "/#projects", label: "Projects", icon: LayoutGrid },
    { href: "/#skills", label: "Skills", icon: Code2 },
    { href: "/stories/why", label: "Stories", icon: Feather },
    { href: "/#contact", label: "Contact", icon: Phone },
    { href: "/notes", label: "Notes", icon: NotebookText, isAuthTrigger: true },
  ];

  useEffect(() => {
    // Close mobile menu on path change, but not if only the auth dialog state changes
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
     // For the "Notes" button, consider it active if on any /notes/* path
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
      setIsAuthDialogOpen(false); // Close dialog on success
      setIsMobileMenuOpen(false); // Close mobile menu if open
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
      variant: isActive(link.href!) ? "secondary" : ("ghost" as "secondary" | "ghost"),
      className: isMobile ? "w-full justify-start text-lg py-3" : "",
    };

    if (link.isAuthTrigger) {
      return (
        <Dialog key={`${link.label}-dialog-${isMobile ? 'mobile' : 'desktop'}`} open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <DialogTrigger asChild>
            <Button {...buttonProps}>
              {link.icon && <link.icon className={isMobile ? "mr-2 h-5 w-5" : "mr-2 h-4 w-4"} />}
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
          {link.icon && <link.icon className={isMobile ? "mr-2 h-5 w-5" : "mr-2 h-4 w-4"} />}
          {link.label}
        </Link>
      </Button>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/#home" className="flex items-center gap-2">
          <Code2 className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl tracking-tight">KKEK</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => renderNavButton(link, false))}
            <Button asChild className="ml-2 shadow-sm">
              <Link href="/resume" target="_blank" download>
                CV <Download className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>

          <ThemeToggleButton />

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
                 <div className="flex justify-between items-center mb-6 pr-6"> {/* Added pr-6 to avoid overlap with potential close button if not using default SheetClose */}
                    <Link href="/#home" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Code2 className="h-7 w-7 text-primary" />
                        <span className="font-bold text-xl tracking-tight">KKEK</span>
                    </Link>
                     <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                           {/* Using X from lucide-react if available, or text */}
                           {/* <X className="h-4 w-4" /> */}
                           <span className="text-2xl">&times;</span>
                           <span className="sr-only">Close</span>
                        </Button>
                    </SheetClose>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map(link => renderNavButton(link, true))}
                  <Button asChild className="w-full justify-start text-lg py-3 mt-4">
                    <Link href="/resume" target="_blank" download onClick={() => setIsMobileMenuOpen(false)}>
                      <Download className="mr-2 h-5 w-5" /> Download CV
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
