
"use client";

import type { Command, CommandParameter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Play } from 'lucide-react';

interface CommandViewProps {
  command: Command;
}

export default function CommandView({ command }: CommandViewProps) {

  const handleExecute = () => {
    // We will implement this later
    alert(`Executing command: ${command.id}`);
  };

  const renderParameterInput = (param: CommandParameter) => {
    switch (param.type) {
      case 'String':
        return <Input id={param.name} name={param.name} placeholder={`Enter ${param.name}...`} />;
      case 'Number':
        return <Input id={param.name} name={param.name} type="number" placeholder="0" />;
      case 'Boolean':
        // A checkbox would be better here, but for simplicity, we use a text input for now.
        return <Input id={param.name} name={param.name} placeholder="true or false" />;
      default:
        return <Input id={param.name} name={param.name} disabled placeholder="Unsupported parameter type" />;
    }
  };

  return (
    <div className="bg-card text-card-foreground flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-6 border-b">
        <h2 className="text-2xl font-semibold leading-none tracking-tight break-words">
          {command.id}
        </h2>
        <p className="text-sm text-muted-foreground">
          {command.description}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 pt-4 flex-1 overflow-y-auto space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); handleExecute(); }}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Parameters</h3>
            {command.parameters.length > 0 ? (
              command.parameters.map((param) => (
                <div key={param.name} className="space-y-2">
                  <Label htmlFor={param.name} className="flex items-center">
                    {param.name}
                    {param.isRequired && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderParameterInput(param)}
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">This command requires no parameters.</p>
            )}
          </div>

          <Separator className="my-6" />

          <Button type="submit" className="w-full sm:w-auto">
            <Play className="mr-2 h-4 w-4" />
            Execute
          </Button>
        </form>
      </div>
    </div>
  );
}
