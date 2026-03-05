

"use client";

import { Button } from "@/components/ui/button";
import { 
  User, Download, Zap, TrendingUp, Code2, Users, Mail, MapPin, Linkedin as LinkedinIcon, Github, ExternalLink, Eye, Trophy, Feather,
  FileCode, Palette, Braces, Type, Orbit, Server as ServerIcon, Wind, ServerCog, ToyBrick, Database, Cloud, Wand2, Sparkles, BrainCircuit, Cpu, GitFork, GitCommit, Container, Package as PackageIcon, TerminalSquare, Puzzle, Handshake, Repeat, IterationCcw, MessageCircleIcon, ClipboardList, Crown, UserCheck, Wrench, TabletSmartphone, Share2, Home, Code, ListChecks, Brain, Settings, Lightbulb, Activity, Globe, BarChart, GitBranch, LayoutDashboard, Menu, Search, Info, List, GraduationCap, Pilcrow, ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import type { ExperienceItem } from "@/components/experience-section"; 
import { ExperienceSection } from "@/components/experience-section";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import AnimatedSection from '@/components/animated-section';
import { Separator } from "@/components/ui/separator";


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

const skillsData = [
  {
    category: "Mobile Development",
    icon: TabletSmartphone,
    items: ["Android (Kotlin, Jetpack Compose)", "Play Store deployment", "Realtime multiplayer systems", "Accessibility-based control systems"],
  },
  {
    category: "Programming",
    icon: Code2,
    items: ["Java", "Kotlin", "Python", "JavaScript"],
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
        
        <section id="home" className="w-full py-24 md:py-32 lg:py-40 relative isolate">
          <div 
            className="absolute inset-x-0 -z-10 h-full w-full bg-background 
            bg-[radial-gradient(theme(colors.primary)_1px,transparent_1px)] 
            [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
          ></div>
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection delay="delay-100">
              <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
                Seeking Android Development Internships
              </Badge>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                Komal Eshwara Kumar Konatham
              </h1>
              <p className="max-w-2xl mx-auto mt-4 text-lg md:text-xl text-muted-foreground">
                A final-year CSE student and passionate Android Developer creating polished, production-ready mobile applications. Seeking an internship to apply and grow my skills in a professional environment.
              </p>
            </AnimatedSection>
            <AnimatedSection delay="delay-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" asChild>
                  <Link href="#contact">
                    Get in Touch <Mail className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/resume" target="_blank">
                    View Resume <Download className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-left mb-4">Engineering Overview</h2>
              <p className="text-lg text-muted-foreground text-left">
                As an aspiring Android Engineer, I focus on building native applications that are not only functional but also intuitive and reliable. My approach is to tackle the full development lifecycle, from initial concept and backend integration to UI polish and Play Store deployment.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section id="skills" className="py-16 md:py-24 bg-card/5">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-left mb-4 max-w-4xl mx-auto">Core Competencies</h2>
              <p className="text-lg text-muted-foreground text-left mb-12 max-w-4xl mx-auto">The toolkit I use to transform ideas into functional, production-ready applications.</p>
            </AnimatedSection>
            <AnimatedSection delay="delay-200" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {skillsData.map((skillCategory) => (
                <div key={skillCategory.category} className="p-6 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <skillCategory.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{skillCategory.category}</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    {skillCategory.items.map(skill => (
                      <li key={skill} className="flex items-start">
                        <span className="text-primary mr-2 mt-1">&#8227;</span> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </section>

        <section id="projects" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-left mb-4 max-w-4xl mx-auto">Featured Projects</h2>
              <p className="text-lg text-muted-foreground text-left mb-12 max-w-4xl mx-auto">
                A selection of my work, from production Android apps to full-stack web platforms.
              </p>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {projects.map((project, index) => (
                <AnimatedSection key={project.id} as="div" delay={`delay-${(index + 1) * 100}`}>
                  <div 
                    onClick={() => handleOpenModal(project)}
                    className="h-full rounded-2xl p-[1px] bg-gradient-to-br from-primary/20 to-border/20 hover:from-primary/50 hover:to-border/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-full rounded-[15px] bg-card p-6 flex flex-col">
                      <CardHeader className="p-0">
                        <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
                        <CardDescription className="text-primary">{project.subtitle}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 pt-4 flex-grow">
                        <p className="text-muted-foreground mb-4">{project.shortDescription}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                        </div>
                      </CardContent>
                      <CardFooter className="p-0 pt-6">
                        <span className="text-sm font-medium text-foreground flex items-center group">
                          View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardFooter>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="py-16 md:py-24 bg-card/5">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-left mb-12">Leadership & Impact</h2>
              <ExperienceSection experiences={experiences} />
            </AnimatedSection>
          </div>
        </section>

        <section id="education" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-left mb-12">Education</h2>
              <div className="space-y-6">
                <Card className="bg-card/50">
                  <CardHeader>
                    <CardTitle>B.Tech – Computer Science & Engineering</CardTitle>
                    <CardDescription>Vasireddy Venkatadri Institute of Technology (VVIT), Guntur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">2023 – 2026 | CGPA: 6.86</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardHeader>
                    <CardTitle>Diploma – Computer Engineering</CardTitle>
                    <CardDescription>M.B.T.S Government Polytechnic, Nallapadu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">2020 – 2023 | 75%</p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="philosophy" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-left mb-12">Engineering Philosophy</h2>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <Card className="p-6 bg-card/50 border-border/50"><p>Functional reliability over cosmetic complexity.</p></Card>
                <Card className="p-6 bg-card/50 border-border/50"><p>End-to-end systems over isolated components.</p></Card>
                <Card className="p-6 bg-card/50 border-border/50"><p>Production deployment and real-user validation.</p></Card>
                <Card className="p-6 bg-card/50 border-border/50"><p>Constraints drive better engineering decisions.</p></Card>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="contact" className="py-16 md:py-24 text-center border-t">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold">Let's Build Together</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4 mb-8">
                I'm actively seeking an Android development internship where I can contribute to building great mobile experiences. If you have an opportunity or just want to connect, please reach out.
              </p>
              <Button size="lg" asChild>
                <Link href="mailto:komaleshwarakumarkonatham@gmail.com">
                  <Mail className="mr-2 h-4 w-4" /> komaleshwarakumarkonatham@gmail.com
                </Link>
              </Button>
            </AnimatedSection>
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
