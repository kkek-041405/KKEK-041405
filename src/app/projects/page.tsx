
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - Your Name | Portfolio',
  description: 'Explore a collection of projects by Your Name, showcasing skills in web development and AI.',
};

const projects = [
  {
    title: "Project Alpha",
    description: "A revolutionary web application for advanced task management, built with Next.js and Firebase, featuring real-time collaboration.",
    imageSrc: "https://picsum.photos/seed/project1/600/400",
    imageHint: "modern dashboard",
    tech: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Genkit"],
    githubLink: "#",
    liveLink: "#",
  },
  {
    title: "AI Image Analyzer",
    description: "An AI-powered tool to analyze and categorize images using cutting-edge machine learning models and cloud vision APIs.",
    imageSrc: "https://picsum.photos/seed/project2/600/400",
    imageHint: "ai interface",
    tech: ["Python", "TensorFlow", "Google Cloud Vision", "React"],
    githubLink: "#",
    liveLink: "#",
  },
  {
    title: "E-commerce Platform X",
    description: "A full-featured online store with secure payment integration, admin dashboard, and personalized recommendations.",
    imageSrc: "https://picsum.photos/seed/project3/600/400",
    imageHint: "online store",
    tech: ["Node.js", "Express", "MongoDB", "Stripe API", "React"],
    githubLink: "#",
    liveLink: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1">
        <section id="projects" className="py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-16 flex items-center justify-center gap-3">
              <Zap className="h-10 w-10 text-primary" /> Featured Projects
            </h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="flex flex-col overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <Image src={project.imageSrc} alt={project.title} width={600} height={400} className="object-cover aspect-video" data-ai-hint={project.imageHint} />
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <CardTitle className="mb-2 text-xl">{project.title}</CardTitle>
                    <CardDescription className="mb-4 text-base leading-relaxed min-h-[6em]">{project.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-start gap-4 border-t pt-6">
                    <Button variant="outline" asChild>
                        <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            Live Demo
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
