

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, Download, Zap, TrendingUp, Briefcase, Code2, Users, MessageSquare, Mail, MapPin, Linkedin as LinkedinIcon, Github, ExternalLink, Eye, Trophy, CaseSensitive,
  FileCode, Palette, Braces, Type, Orbit, Server as ServerIcon, Wind, Feather, ServerCog, ToyBrick, Database, Cloud, Wand2, Sparkles, BrainCircuit, Cpu, GitFork, GitCommit, Container, Package as PackageIcon, TerminalSquare, Puzzle, Handshake, Repeat, IterationCcw, MessageCircle as MessageCircleIcon, ClipboardList, Crown, UserCheck, Wrench, TabletSmartphone, Share2, Home, Code, ListChecks, Brain, Settings, Lightbulb, Activity, Globe, BarChart, GitBranch, LayoutDashboard, Menu, Search, Info, List, GraduationCap, Pilcrow
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import type { ExperienceItem } from "@/components/experience-section"; 
import { ExperienceSection } from "@/components/experience-section";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import AnimatedSection from '@/components/animated-section';


// Experience Data
const experiences: ExperienceItem[] = [
  {
    role: "Technical Head",
    organization: "VVISC (VVIT IUCEE Student Chapter)",
    dates: "Aug 2024 – Present",
    details: [
      "Orchestrated a 24-hour inter-college hackathon with 300+ participants.",
      "Organized multiple intra-college technical and non-technical events.",
      "Represented chapter at inter-college hackathons.",
      "Awarded Special Mention at Ideathon, Malnad College of Engineering, Hassan.",
    ],
    iconName: "Crown",
  }
];

// Projects Data
const projects: Project[] = [
  {
    id: "chess",
    title: "Multiplayer Chess Application",
    subtitle: "Published on Google Play Store",
    shortDescription: "A production-ready Android chess app with real-time multiplayer using Firebase, and an integrated Stockfish AI for offline play.",
    detailedDescription: "Developed and deployed a real-time multiplayer chess application enabling synchronized gameplay across devices. Implemented real-time move synchronization using Firebase Realtime Database. Designed game state validation logic to prevent illegal moves and built matchmaking logic for pairing online players. Designed responsive UI using Jetpack Compose. Managed production deployment on Google Play Store.",
    imageSrc: "https://picsum.photos/seed/chess-app/600/400",
    imageHint: "chess game mobile",
    screenshots: [{ src: "https://picsum.photos/seed/chess-ss1/800/450", alt: "Chess App Screenshot 1", hint: "mobile game interface" }],
    tech: ["Kotlin", "Jetpack Compose", "Firebase Realtime Database"],
    achievements: ["Live on Google Play Store", "Real-time move sync", "State validation", "Matchmaking logic"],
    githubLink: "https://github.com/kkek-041405/chess",
    liveLink: "https://play.google.com/store/apps/dev?id=6378119908597517835",
  },
  {
    id: "zencontrol",
    title: "ZenControl – Accessibility App",
    subtitle: "Hardware-Constraint Accessibility App",
    shortDescription: "An Android application enabling device control using volume buttons when touch input is non-functional. Built to solve a real personal hardware failure problem.",
    detailedDescription: "Developed an Android application enabling device control using volume buttons when touch input is non-functional. Built to solve a real personal hardware failure problem. Implemented a background service for system-level interaction and used Accessibility APIs to trigger navigation commands. Designed lightweight event-based control logic with a focus on minimal resource consumption. This project demonstrates practical problem-solving under constraints.",
    imageSrc: "https://picsum.photos/seed/zencontrol-app/600/400",
    imageHint: "android accessibility",
    screenshots: [{ src: "https://picsum.photos/seed/zen-ss1/800/450", alt: "ZenControl Screenshot 1", hint: "android settings code" }],
    tech: ["Kotlin", "Android Accessibility Services"],
    achievements: ["System-level interaction", "Lightweight event logic", "Minimal resource consumption"],
    githubLink: "https://github.com/kkek-041405/ZenControl",
  },
  {
    id: "campus-companion",
    title: "Campus Companion",
    subtitle: "University Collaboration Platform",
    shortDescription: "A web platform for university students to collaborate, share resources, and participate in structured discussions, built with React and Firebase.",
    detailedDescription: "A web platform designed for university students to collaborate, share resources, and participate in structured discussions. System design features include a role-based authentication system, public/private resource visibility model, structured discussion forums (no anonymous posting), Firebase-backed storage and database integration, and a modular React component architecture.",
    imageSrc: "https://picsum.photos/seed/campus-app/600/400",
    imageHint: "university social network",
    screenshots: [{ src: "https://picsum.photos/seed/campus-ss1/800/450", alt: "Campus Companion Screenshot", hint: "web app interface" }],
    tech: ["React", "Firebase", "Firestore", "Firebase Storage"],
    achievements: ["Role-based auth", "Resource visibility model", "Structured discussion forums"],
    githubLink: "https://github.com/kkek-041405/CampusCompanion",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio Website",
    subtitle: "The very website you are on.",
    shortDescription: "A responsive portfolio website to showcase engineering projects and technical depth, built with Next.js and deployed on Vercel.",
    detailedDescription: "Designed and developed a responsive portfolio website to showcase engineering projects and technical depth. Built with Next.js for performance and SEO, styled with Tailwind CSS, and deployed via Vercel for continuous integration and delivery.",
    imageSrc: "https://picsum.photos/seed/portfolio-site/600/400",
    imageHint: "developer portfolio website",
    screenshots: [{ src: "https://picsum.photos/seed/portfolio-ss1/800/450", alt: "Portfolio Screenshot", hint: "website screenshot" }],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    achievements: ["Responsive Design", "Server-Side Rendering", "CI/CD with Vercel"],
    githubLink: "https://github.com/kkek-041405/KKEK-041405",
    liveLink: "https://kkek.me",
  }
];

// Skills Data
const skillsData = [
  {
    category: "Programming",
    icon: Code2,
    items: ["Java", "Kotlin", "Python", "JavaScript"],
  },
  {
    category: "Mobile Development",
    icon: TabletSmartphone,
    items: ["Android (Kotlin, Jetpack Compose)", "Play Store deployment", "Realtime multiplayer systems", "Accessibility-based control systems"],
  },
  {
    category: "Web & Full Stack",
    icon: Globe,
    items: ["React.js", "Next.js", "Firebase Authentication", "Firestore / Realtime Database", "REST-style architecture"],
  },
  {
    category: "Tools & Workflow",
    icon: Wrench,
    items: ["Git", "GitHub", "Firebase Hosting", "Vercel"],
  },
];


export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const pathname = usePathname();

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const allTechStacks = Array.from(new Set(projects.flatMap(p => p.tech)));

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.tech.includes(filter));
    
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       {pathname !== '/lm' && <PortfolioHeader />}

      <main className="flex-1">
        {/* Hero Section (Home) */}
        <AnimatedSection as="div" triggerOnce={true} initialClassName="opacity-0" animateClassName="opacity-100" duration="duration-1000" delay="delay-100">
          <section id="home" className="w-full py-12 md:py-16 lg:py-20 xl:py-20 bg-gradient-to-br from-background to-secondary/10 dark:from-background dark:to-secondary/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center space-y-6 lg:col-span-2 xl:col-span-1">
                  <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-primary shadow-xl">
                    <AvatarImage src="https://picsum.photos/seed/avatar-kkek/200" alt="Komal Eshwara Kumar Konatham" data-ai-hint="professional portrait" />
                    <AvatarFallback>KKEK</AvatarFallback>
                  </Avatar>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    <span className="block">Komal Eshwara Kumar Konatham</span>
                    <span className="block text-primary text-2xl sm:text-3xl md:text-4xl mt-2">Software Engineer</span>
                  </h1>
                   <p className="max-w-2xl text-base sm:text-lg text-muted-foreground md:mx-0">
                    Computer Science engineer building production-ready Android and web systems with real-time synchronization and scalable backend architecture.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full sm:w-auto">
                    <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow w-full sm:w-auto">
                      <Link href="#contact">
                        <Mail className="mr-2 h-5 w-5" /> Get in Touch
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/50 transition-shadow w-full sm:w-auto">
                      <Link href="/resume" target="_blank">
                        <Download className="mr-2 h-5 w-5" /> View Resume
                      </Link>
                    </Button>
                  </div>
                </div>
            </div>
          </section>
        </AnimatedSection>

        {/* About Me Section */}
        <AnimatedSection as="section" id="about" triggerOnce={true} className="py-12 md:py-16 bg-secondary/20 dark:bg-secondary/10" delay="delay-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <UserCircle className="h-10 w-10 text-primary" /> Professional Overview
            </h2>
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-center">
              <div className="md:col-span-2">
                <Image
                  src="https://picsum.photos/seed/about-me-kkek/500/600"
                  alt="K. Komal Eshwara Kumar working on a project"
                  width={500}
                  height={600}
                  className="rounded-xl shadow-2xl object-cover aspect-[6/7]"
                  data-ai-hint="person coding"
                />
              </div>
              <div className="md:col-span-3 text-lg space-y-5 text-muted-foreground">
                <p>
                  I build software to solve real problems — not just to complete assignments. My focus is on creating production-ready Android and web systems that are both scalable and reliable. 
                </p>
                <p>
                  Experienced in deploying live applications, designing Firebase-based infrastructures, and leading technical initiatives at a university scale. I enjoy tackling the full lifecycle of a product, from backend architecture to frontend polish.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

         {/* Skills Section */}
        <AnimatedSection as="section" id="skills" triggerOnce={true} className="py-12 md:py-16 bg-background dark:bg-background" delay="delay-200">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                      <Cpu className="h-10 w-10 text-primary" /> Technical Competencies
                  </h2>
                  <p className="text-muted-foreground mt-2 text-lg">
                      My toolkit for building reliable and performant applications.
                  </p>
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl mx-auto">
                {skillsData.map((skillCategory) => (
                  <div key={skillCategory.category}>
                    <div className="flex items-center gap-3 mb-6">
                      {skillCategory.icon && <skillCategory.icon className="h-8 w-8 text-primary" />}
                      <h3 className="text-2xl font-semibold text-foreground">{skillCategory.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.items.map(skill => (
                         <Badge key={skill} variant="secondary" className="text-sm px-3 py-1.5">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </AnimatedSection>

        {/* Projects Section */}
        <AnimatedSection as="section" id="projects" triggerOnce={true} className="py-12 md:py-16 bg-secondary/10 dark:bg-secondary/5" delay="delay-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                    <Zap className="h-10 w-10 text-primary" /> Featured Engineering Projects
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">
                    A selection of my work. Click on a project to learn more.
                </p>
            </div>
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <Button 
                variant={filter === "All" ? "default" : "outline"} 
                onClick={() => setFilter("All")}
                className="shadow-sm"
              >
                All
              </Button>
              {allTechStacks.slice(0, 5).map(tech => (
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <AnimatedSection key={project.id} as="div" initialClassName="opacity-0 translate-y-4" animateClassName="opacity-100 translate-y-0" triggerOnce={false} duration="duration-500">
                  <Card className="flex flex-col overflow-hidden shadow-xl hover:shadow-primary/20 transition-all duration-300 rounded-lg transform hover:-translate-y-1 h-full">
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
                    </CardContent>
                    <CardFooter className="flex justify-center items-center gap-3 border-t pt-4 pb-4 bg-secondary/20 dark:bg-secondary/10 rounded-b-lg px-4 mt-auto">
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
                        <Button size="sm" onClick={() => handleOpenModal(project)} className="w-full sm:w-auto">
                            <Eye className="mr-1.5 h-4 w-4" /> View Details
                        </Button>
                    </CardFooter>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
            {filteredProjects.length === 0 && (
                <p className="text-center text-muted-foreground mt-10 text-lg">No projects found for the selected filter.</p>
            )}
          </div>
        </AnimatedSection>
        {selectedProject && (
          <ExpandedProjectModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={handleCloseModal}
          />
        )}

        {/* Experience Section */}
        <AnimatedSection as="section" id="experience" triggerOnce={true} className="py-12 md:py-16 bg-background dark:bg-background" delay="delay-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <TrendingUp className="h-10 w-10 text-primary" /> Experience & Leadership
            </h2>
            <ExperienceSection experiences={experiences} />
          </div>
        </AnimatedSection>

        {/* Education Section */}
        <AnimatedSection as="section" id="education" triggerOnce={true} className="py-12 md:py-16 bg-secondary/20 dark:bg-secondary/10" delay="delay-200">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <GraduationCap className="h-10 w-10 text-primary" /> Education
            </h2>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>B.Tech – Computer Science & Engineering</CardTitle>
                  <CardDescription>Vasireddy Venkatadri Institute of Technology (VVIT), Guntur</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">2023 – 2026 | CGPA: 6.86</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Diploma – Computer Engineering</CardTitle>
                  <CardDescription>M.B.T.S Government Polytechnic, Nallapadu</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">2020 – 2023 | 75%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>

        {/* Philosophy Section */}
        <AnimatedSection as="section" id="philosophy" triggerOnce={true} className="py-12 md:py-16 bg-background" delay="delay-200">
           <div className="container mx-auto px-4 max-w-4xl">
             <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
               <Pilcrow className="h-10 w-10 text-primary" /> Engineering Philosophy
             </h2>
             <div className="grid md:grid-cols-2 gap-6 text-center">
                <Card className="p-6">
                  <p className="text-lg text-foreground">I prioritize functional reliability over cosmetic complexity.</p>
                </Card>
                <Card className="p-6">
                  <p className="text-lg text-foreground">I prefer building end-to-end systems rather than isolated components.</p>
                </Card>
                 <Card className="p-6">
                  <p className="text-lg text-foreground">I value production deployment and real-user validation.</p>
                </Card>
                 <Card className="p-6">
                  <p className="text-lg text-foreground">I believe constraints drive better engineering decisions.</p>
                </Card>
             </div>
           </div>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection as="section" id="contact" triggerOnce={true} className="py-12 md:py-16 bg-secondary/30 dark:bg-secondary/10" delay="delay-200">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 flex items-center justify-center gap-3">
              <MessageSquare className="h-10 w-10 text-primary" /> Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              I'm actively seeking opportunities to contribute to product-driven engineering teams. If you have a project in mind, a question, or just want to connect, feel free to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-primary/50 transition-shadow">
                <Link href="mailto:komaleshwarakumarkonatham@gmail.com">
                  <Mail className="mr-2 h-5 w-5" /> Send an Email
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto shadow-lg hover:shadow-accent/50 transition-shadow">
                <Link href="https://linkedin.com/in/kkek" target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="mr-2 h-5 w-5" /> Connect on LinkedIn
                </Link>
              </Button>
            </div>
            <div className="mt-12 text-muted-foreground flex flex-col items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Tenali, Andhra Pradesh, India</span>
              <span className="text-sm">(Open to Relocation)</span>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <PortfolioFooter />
    </div>
  );
}
