
"use client";

import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Zap, Link as LinkIcon, Eye, ExternalLink, Trophy, CaseSensitive } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';
import React, { useState } from 'react';
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal'; // Import the new modal

// Metadata should be defined outside the component if it's static
// export const metadata: Metadata = { // This needs to be handled at the top level or in a server component
//   title: 'Projects - K. Komal Eshwara Kumar | Portfolio',
//   description: 'Explore a collection of projects by K. Komal Eshwara Kumar (KKEK), showcasing skills in web development and AI.',
// };

const initialProjects: Project[] = [
  {
    id: "project-alpha",
    title: "Project Alpha",
    subtitle: "Advanced Task Management",
    shortDescription: "A revolutionary web application for advanced task management, built with Next.js and Firebase, featuring real-time collaboration.",
    detailedDescription: "Project Alpha is a cutting-edge task management solution designed for modern teams. It leverages the power of Next.js for a reactive frontend and Firebase for real-time database and authentication. Key features include customizable Kanban boards, real-time updates across all connected clients, user role management, and an intuitive drag-and-drop interface. The project aimed to solve common pain points in team collaboration by providing a centralized, efficient, and visually appealing platform for managing tasks and projects.",
    imageSrc: "https://picsum.photos/seed/project1/600/400",
    imageHint: "modern dashboard",
    screenshots: [
        { src: "https://picsum.photos/seed/alpha-ss1/800/600", alt: "Project Alpha Dashboard", hint: "dashboard overview" },
        { src: "https://picsum.photos/seed/alpha-ss2/800/600", alt: "Project Alpha Kanban Board", hint: "kanban board tasks" },
        { src: "https://picsum.photos/seed/alpha-ss3/800/600", alt: "Project Alpha Settings", hint: "user settings" },
    ],
    videoUrl: undefined, // "https://www.youtube.com/embed/your_video_id"
    tech: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Genkit", "ShadCN UI"],
    achievements: ["Winner - University Hackathon '23", "Featured on DevPost"],
    githubLink: "https://github.com/kkeshkumar/project-alpha-example",
    liveLink: "https://project-alpha.example.com",
    caseStudyLink: undefined, // "https://blog.example.com/project-alpha"
  },
  {
    id: "ai-image-analyzer",
    title: "AI Image Analyzer",
    subtitle: "Intelligent Image Recognition",
    shortDescription: "An AI-powered tool to analyze and categorize images using cutting-edge machine learning models and cloud vision APIs.",
    detailedDescription: "The AI Image Analyzer utilizes Google Cloud Vision API and custom-trained TensorFlow models to provide deep insights into image content. It can detect objects, identify landmarks, read printed and handwritten text, and even understand emotional sentiment in faces. The frontend, built with React, allows users to upload images and view detailed analysis reports. This project showcases the practical application of AI in image processing and data extraction.",
    imageSrc: "https://picsum.photos/seed/project2/600/400",
    imageHint: "ai interface",
     screenshots: [
        { src: "https://picsum.photos/seed/analyzer-ss1/800/600", alt: "AI Analyzer Upload", hint: "image upload interface" },
        { src: "https://picsum.photos/seed/analyzer-ss2/800/600", alt: "AI Analyzer Results", hint: "analysis results" },
    ],
    videoUrl: undefined,
    tech: ["Python", "TensorFlow", "Google Cloud Vision", "React", "Flask"],
    achievements: ["Published Research Paper", "Open Source Contributor Award"],
    githubLink: "https://github.com/kkeshkumar/ai-image-analyzer-example",
    liveLink: "https://ai-analyzer.example.com",
    caseStudyLink: "https://blog.example.com/ai-image-analyzer"
  },
  {
    id: "e-commerce-platform-x",
    title: "E-commerce Platform X",
    subtitle: "Full-Stack Online Store",
    shortDescription: "A full-featured online store with secure payment integration, admin dashboard, and personalized recommendations.",
    detailedDescription: "Platform X is a comprehensive e-commerce solution built from the ground up. It features a robust backend powered by Node.js and Express, with MongoDB for data storage. Secure payment processing is handled by Stripe integration. The platform includes an administrative dashboard for managing products, orders, and customers. A recommendation engine, using collaborative filtering, provides personalized product suggestions to users. The frontend is built with React for a dynamic shopping experience.",
    imageSrc: "https://picsum.photos/seed/project3/600/400",
    imageHint: "online store",
    screenshots: [
        { src: "https://picsum.photos/seed/ecomm-ss1/800/600", alt: "E-commerce Homepage", hint: "storefront homepage" },
        { src: "https://picsum.photos/seed/ecomm-ss2/800/600", alt: "E-commerce Product Page", hint: "product detail" },
        { src: "https://picsum.photos/seed/ecomm-ss3/800/600", alt: "E-commerce Admin Panel", hint: "admin dashboard" },
    ],
    videoUrl: undefined,
    tech: ["Node.js", "Express", "MongoDB", "Stripe API", "React", "Redux"],
    achievements: ["Processed 10k+ Orders", "5-Star User Rating"],
    githubLink: "https://github.com/kkeshkumar/ecommerce-x-example",
    liveLink: "https://ecommerce-x.example.com",
    caseStudyLink: undefined
  },
];


export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All"); // Example filter state

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const allTechStacks = Array.from(new Set(initialProjects.flatMap(p => p.tech)));

  const filteredProjects = filter === "All" 
    ? initialProjects 
    : initialProjects.filter(p => p.tech.includes(filter));

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1">
        <section id="projects" className="py-16 md:py-24 bg-secondary/10 dark:bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                    <Zap className="h-10 w-10 text-primary" /> Featured Projects
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    A selection of my work. Click on a project to learn more.
                </p>
            </div>

            {/* Filter Buttons Placeholder */}
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              <Button 
                variant={filter === "All" ? "default" : "outline"} 
                onClick={() => setFilter("All")}
                className="shadow-sm"
              >
                All
              </Button>
              {allTechStacks.slice(0, 5).map(tech => ( // Limiting to 5 for brevity
                <Button 
                  key={tech} 
                  variant={filter === tech ? "default" : "outline"} 
                  onClick={() => setFilter(tech)}
                  className="shadow-sm"
                >
                  {tech}
                </Button>
              ))}
            </div>
            
            {/* Project Gallery */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="flex flex-col overflow-hidden shadow-xl hover:shadow-primary/20 transition-all duration-300 rounded-lg transform hover:-translate-y-1">
                  <CardHeader className="p-0 relative">
                    <Image src={project.imageSrc} alt={project.title} width={600} height={400} className="object-cover aspect-video" data-ai-hint={project.imageHint} />
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <CardTitle className="mb-1 text-xl">{project.title}</CardTitle>
                    <p className="text-sm text-primary font-medium mb-2">{project.subtitle}</p>
                    <CardDescription className="mb-4 text-base leading-relaxed min-h-[4.5em] text-muted-foreground">{project.shortDescription}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 4).map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                      {project.tech.length > 4 && <Badge variant="secondary">+{project.tech.length - 4}</Badge>}
                    </div>
                    {project.achievements && project.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Achievements</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.achievements.slice(0,2).map(achievement => (
                            <Badge key={achievement} variant="outline" className="text-primary border-primary/50 bg-primary/10">
                              <Trophy className="mr-1.5 h-3 w-3" /> {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t pt-4 pb-4 bg-secondary/20 dark:bg-secondary/10 rounded-b-lg px-4">
                    <div className="flex gap-2">
                        {project.githubLink && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-1.5 h-4 w-4" /> GitHub
                                </Link>
                            </Button>
                        )}
                        {project.liveLink && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-1.5 h-4 w-4" /> Live
                                </Link>
                            </Button>
                        )}
                    </div>
                    <Button size="sm" onClick={() => handleOpenModal(project)} className="w-full sm:w-auto">
                        <Eye className="mr-1.5 h-4 w-4" /> View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {filteredProjects.length === 0 && (
                <p className="text-center text-muted-foreground mt-10 text-lg">No projects found for the selected filter.</p>
            )}
          </div>
        </section>
      </main>
      <PortfolioFooter />
      {selectedProject && (
        <ExpandedProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// It's better to move Metadata to a Server Component layout or page if possible, 
// or use `use client` boundary carefully. For now, as this is a client component,
// dynamic metadata or document.title changes would be done via useEffect.
// For static metadata, it should be exported from a server component.
// We will rely on the RootLayout for general metadata.
// Individual page metadata for client components is tricky.
// If truly needed here:
// import Head from 'next/head';
// <Head><title>Projects - K. Komal Eshwara Kumar</title></Head>
// but this is generally not the preferred App Router way.
