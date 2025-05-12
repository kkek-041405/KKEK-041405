
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggleButton() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // On component mount, determine the initial theme
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (storedTheme) {
      setTheme(storedTheme); // Use stored theme if available
    } else {
      setTheme("dark"); // Default to dark mode if no theme is stored
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // This effect applies the theme to the HTML element and persists it
    if (theme === null) return; // Do nothing if theme hasn't been determined yet

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Persist the current theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]); // This effect runs whenever the theme state changes

  const toggleTheme = () => {
    if (theme === null) return; 
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  if (theme === null) {
    // Render a placeholder or a default icon while theme is loading
    // This helps prevent hydration mismatch if server renders one icon and client quickly switches
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Loading theme preferences">
        <Sun className="h-5 w-5 text-muted-foreground" /> 
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}

