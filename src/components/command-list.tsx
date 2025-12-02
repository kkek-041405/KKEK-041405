
"use client";

import type { Command } from "@/lib/types";
import { ScrollArea } from '@/components/ui/scroll-area';
import { TerminalSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "./ui/button";

interface CommandListItemProps {
  command: Command;
  isSelected: boolean;
  onSelect: () => void;
}

function CommandListItem({ command, isSelected, onSelect }: CommandListItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 group",
        isSelected ? "bg-primary/10 border border-primary" : "border border-transparent"
      )}
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <TerminalSquare className={cn("h-5 w-5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
        <div className="overflow-hidden">
            <p className={cn("font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>{command.id}</p>
        </div>
      </div>
    </div>
  );
}

interface CommandListProps {
  commands: Command[];
  selectedCommandId: string | null;
  onSelectCommand: (id: string) => void;
}

export default function CommandList({ 
  commands, 
  selectedCommandId, 
  onSelectCommand,
}: CommandListProps) {

  return (
    <div className="bg-card text-card-foreground flex flex-col flex-1 h-full">
      <div className="p-4 border-b flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
            <TerminalSquare className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-xl font-semibold text-foreground truncate">
                Commands
            </h3>
        </div>
      </div>
      
      {commands.length === 0 ? (
        <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
          <p className="text-muted-foreground py-4">No commands found in Firestore.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-3"> 
            {commands.map((command) => (
              <CommandListItem
                key={command.id}
                command={command}
                isSelected={command.id === selectedCommandId}
                onSelect={() => onSelectCommand(command.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
