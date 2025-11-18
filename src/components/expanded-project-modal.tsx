
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Trophy, Film, Image as ImageIcon, CaseSensitive, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export interface ProjectScreenshot {
  src: string;
  alt: string;
  hint?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  detailedDescription: string;
  imageSrc: string;
  imageHint: string;
  screenshots: ProjectScreenshot[];
  videoUrl?: string;
  tech: string[];
  achievements?: string[];
  githubLink?: string;
  liveLink?: string;
  caseStudyLink?: string;
}

interface ExpandedProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpandedProjectModal({ project, isOpen, onClose }: ExpandedProjectModalProps) {
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = React.useState(0);

  if (!project) return null;

  const nextScreenshot = () => {
    setCurrentScreenshotIndex((prevIndex) => (prevIndex + 1) % project.screenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentScreenshotIndex((prevIndex) => (prevIndex - 1 + project.screenshots.length) % project.screenshots.length);
  };

  React.useEffect(() => {
    setCurrentScreenshotIndex(0); // Reset when project changes
  }, [project]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
          <DialogDescription className="text-base text-primary">{project.subtitle}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow">
          <div className="px-6 py-4 space-y-6">
            {/* Screenshots and Video Section */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary" /> Screenshots</h3>
                <div className="relative group">
                  <Image
                    src={project.screenshots[currentScreenshotIndex].src}
                    alt={project.screenshots[currentScreenshotIndex].alt}
                    width={800}
                    height={450}
                    className="rounded-lg object-cover aspect-video border"
                    data-ai-hint={project.screenshots[currentScreenshotIndex].hint}
                  />
                  {project.screenshots.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background"
                        onClick={prevScreenshot}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background"
                        onClick={nextScreenshot}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                        {project.screenshots.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentScreenshotIndex(index)}
                            className={`h-2 w-2 rounded-full ${index === currentScreenshotIndex ? 'bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground/80'}`}
                            aria-label={`Go to screenshot ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {project.videoUrl && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center"><Film className="mr-2 h-5 w-5 text-primary" /> Demo Video</h3>
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="100%"
                    src={project.videoUrl}
                    title="Project Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="border-0"
                  ></iframe>
                </div>
              </div>
            )}
            
            <Separator />

            {/* Detailed Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About this project</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.detailedDescription}
              </p>
            </div>

            <Separator />

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(tech => <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">{tech}</Badge>)}
              </div>
            </div>

            {/* Achievements */}
            {project.achievements && project.achievements.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><Trophy className="mr-2 h-5 w-5 text-primary" /> Achievements</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {project.achievements.map(achievement => <li key={achievement}>{achievement}</li>)}
                  </ul>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {project.githubLink && (
              <Button variant="outline" asChild>
                <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </Link>
              </Button>
            )}
            {project.liveLink && (
              <Button variant="outline" asChild>
                <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Link>
              </Button>
            )}
            {project.caseStudyLink && (
              <Button variant="outline" asChild>
                <Link href={project.caseStudyLink} target="_blank" rel="noopener noreferrer">
                  <CaseSensitive className="mr-2 h-4 w-4" /> Case Study
                </Link>
              </Button>
            )}
          </div>
          <Button onClick={onClose} variant="default">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
