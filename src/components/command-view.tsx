
"use client";

import type { Command, CommandParameter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Play, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';

interface CommandViewProps {
  command: Command;
  onExecute: (params: Record<string, any>) => Promise<void>;
  isExecuting: boolean;
}

export default function CommandView({ command, onExecute, isExecuting }: CommandViewProps) {
  // Dynamically create a Zod schema from the command parameters
  const generateSchema = (parameters: CommandParameter[]) => {
    const schemaShape: Record<string, z.ZodType<any, any>> = {};
    parameters.forEach(param => {
      let fieldSchema;
      switch (param.type) {
        case 'Number':
          fieldSchema = z.coerce.number(); // Coerce string from input to number
          break;
        case 'Boolean':
          fieldSchema = z.preprocess(val => val === 'true' || val === true, z.boolean());
          break;
        case 'String':
        default:
          fieldSchema = z.string();
          break;
      }
      if (param.isRequired) {
        if (fieldSchema instanceof z.ZodString) {
          fieldSchema = fieldSchema.min(1, { message: `${param.name} is required.` });
        }
      } else {
        fieldSchema = fieldSchema.optional();
      }
      schemaShape[param.name] = fieldSchema;
    });
    return z.object(schemaShape);
  };

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(generateSchema(command.parameters)),
    defaultValues: command.parameters.reduce((acc, param) => ({ ...acc, [param.name]: '' }), {}),
  });
  
  // Reset the form whenever the selected command changes
  useEffect(() => {
    form.reset(command.parameters.reduce((acc, param) => ({ ...acc, [param.name]: '' }), {}));
  }, [command, form]);


  const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
    await onExecute(data);
  };

  const renderParameterInput = (param: CommandParameter, field: any) => {
    switch (param.type) {
      case 'Number':
        return <Input id={param.name} type="number" placeholder="0" {...field} />;
      case 'Boolean':
        // For simplicity, we use a text input that accepts 'true' or 'false'.
        // A Switch or Checkbox could be used for a better UX.
        return <Input id={param.name} placeholder="true or false" {...field} />;
      case 'String':
      default:
        return <Input id={param.name} placeholder={`Enter ${param.name}...`} {...field} />;
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Parameters</h3>
                {command.parameters.length > 0 ? (
                  command.parameters.map((param) => (
                    <FormField
                        key={param.name}
                        control={form.control}
                        name={param.name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center">
                                    {param.name}
                                    {param.isRequired && <span className="text-destructive ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    {renderParameterInput(param, field)}
                                </FormControl>
                                <p className="text-xs text-muted-foreground">{param.description}</p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">This command requires no parameters.</p>
                )}
              </div>

              <Separator className="my-6" />

              <Button type="submit" disabled={isExecuting} className="w-full sm:w-auto">
                {isExecuting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Play className="mr-2 h-4 w-4" />
                        Execute
                    </>
                )}
              </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}
