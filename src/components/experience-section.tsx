
"use client";

import { Briefcase, Zap } from 'lucide-react'; // Import specific icons needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define a type for known icon names for better type safety
type KnownIconName = "Briefcase" | "Zap";

export interface ExperienceItem {
  role: string;
  organization: string;
  dates: string;
  details: string[];
  iconName?: KnownIconName; // Changed from icon?: LucideIcon to iconName?: string
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

// Helper component to render Lucide icons based on a name prop
const IconRenderer = ({ name, className }: { name?: KnownIconName; className?: string }) => {
  const defaultIconClass = className || "h-3 w-3 sm:h-4 sm:w-4";
  const defaultFallback = <div className={`bg-primary rounded-full ${defaultIconClass}`}></div>;

  if (!name) {
    return defaultFallback;
  }

  switch (name) {
    case "Briefcase":
      return <Briefcase className={className} />;
    case "Zap":
      return <Zap className={className} />;
    default:
      // Optionally, log a warning for unhandled icon names in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`IconRenderer: Unknown icon name "${name}"`);
      }
      return defaultFallback;
  }
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Vertical line for timeline */}
      <div className="absolute left-6 sm:left-8 top-0 h-full w-1 bg-border rounded-full -translate-x-1/2"></div>

      {experiences.map((exp, index) => (
        <div key={index} className="mb-12 flex items-start">
          {/* Icon and Dot */}
          <div className="z-10 flex-shrink-0 mr-4 sm:mr-6">
            <div className="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 border-2 border-primary text-primary">
              <IconRenderer name={exp.iconName} className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>

          {/* Card Content */}
          <Card className="flex-grow shadow-lg hover:shadow-primary/10 transition-shadow duration-300 border-l-4 border-primary">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">{exp.role}</CardTitle>
                <Badge variant="secondary" className="mt-1 sm:mt-0 text-sm">{exp.dates}</Badge>
              </div>
              <CardDescription className="text-md sm:text-lg text-primary font-medium">{exp.organization}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {exp.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
