
"use client";

import { useState, useEffect } from 'react';
import { Loader2, Terminal, SlidersHorizontal } from "lucide-react";
import type { Command } from '@/lib/types';
import { getCommandsFromFirestore } from '@/services/command-service';
import { useToast } from "@/hooks/use-toast";
import CommandList from './command-list';
import CommandView from './command-view';

export default function PhoneView() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedCommandId, setSelectedCommandId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommands = async () => {
      setIsLoading(true);
      try {
        const firestoreCommands = await getCommandsFromFirestore();
        setCommands(firestoreCommands);
      } catch (error) {
        console.error("Failed to fetch commands:", error);
        toast({
          title: "Error Fetching Commands",
          description: "Could not load commands from the cloud. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommands();
  }, [toast]);
  
  const selectedCommand = commands.find(c => c.id === selectedCommandId) || null;

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading Commands...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-65px)]">
      <section
        aria-labelledby="commands-list-heading"
        className="md:w-80 flex flex-col border-r"
      >
        <h2 id="commands-list-heading" className="sr-only">Available Commands</h2>
        <CommandList
          commands={commands}
          selectedCommandId={selectedCommandId}
          onSelectCommand={setSelectedCommandId}
        />
      </section>

      <div className="flex-1 flex flex-col">
        {selectedCommand ? (
          <section
            aria-labelledby="view-command-heading"
            className="flex-1 flex flex-col min-w-0"
          >
            <h2 id="view-command-heading" className="sr-only">Selected Command: {selectedCommand.id}</h2>
            <CommandView command={selectedCommand} />
          </section>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-card text-card-foreground p-8 text-center">
            <Terminal className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No Command Selected</h3>
            <p className="text-muted-foreground">Select a command from the list to view its details.</p>
          </div>
        )}
        { !selectedCommand && !isLoading && commands.length === 0 && (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-card text-card-foreground p-8 text-center">
              <SlidersHorizontal className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Commands Found</h3>
              <p className="text-muted-foreground">There are no commands configured in Firestore.</p>
            </div>
          )
        }
      </div>
    </main>
  );
}
