
"use client";

import { Briefcase, Zap, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type KnownIconName = "Briefcase" | "Zap" | "Crown";

export interface ExperienceItem {
  role: string;
  organization: string;
  dates: string;
  details: string[];
  iconName?: KnownIconName;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

const IconRenderer = ({ name, className }: { name?: KnownIconName; className?: string }) => {
  const defaultIconClass = className || "h-5 w-5";
  switch (name) {
    case "Briefcase": return <Briefcase className={defaultIconClass} />;
    case "Zap": return <Zap className={defaultIconClass} />;
    case "Crown": return <Crown className={defaultIconClass} />;
    default: return <Briefcase className={defaultIconClass} />;
  }
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div 
        className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent"
      ></div>

      {experiences.map((exp, index) => (
        <div key={index} className="relative pl-12 pb-12">
          <div className="absolute left-6 top-1 -translate-x-1/2">
            <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>
          </div>
          <Card className="bg-card/50 shadow-lg shadow-black/10">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">{exp.role}</CardTitle>
                <Badge variant="outline" className="mt-2 sm:mt-0 text-sm border-primary/30 text-primary">{exp.dates}</Badge>
              </div>
              <CardDescription className="text-md sm:text-lg text-muted-foreground font-medium">{exp.organization}</CardDescription>
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
