
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notebook, Home, Music, KeyRound, ChevronDown, Bell } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggleButton } from './theme-toggle-button';

interface AppBarProps {
  activeView: 'notes' | 'spotify' | 'notifications';
  onViewChange: (view: 'notes' | 'spotify' | 'notifications') => void;
}

export function AppBar({ activeView, onViewChange }: AppBarProps) {
  
  const viewOptions = {
    notes: { label: 'NoteNest', icon: Notebook },
    spotify: { label: 'Spotify', icon: Music },
    notifications: { label: 'Notifications', icon: Bell },
  };

  const ActiveViewIcon = viewOptions[activeView].icon;
  const activeViewLabel = viewOptions[activeView].label;
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center group" aria-label="Go to Portfolio Home Page">
            <Home className="h-7 w-7 text-primary group-hover:text-primary/80 transition-colors" />
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-2xl font-bold text-primary">
                <ActiveViewIcon className="h-8 w-8" />
                <h1>{activeViewLabel}</h1>
                <ChevronDown className="h-6 w-6 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem onSelect={() => onViewChange('notes')}>
                <Notebook className="mr-2 h-4 w-4" />
                <span>NoteNest</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onViewChange('spotify')}>
                <Music className="mr-2 h-4 w-4" />
                <span>Spotify</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onViewChange('notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
           <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
