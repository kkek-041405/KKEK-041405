

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  UserCircle2 as UserCircle, Download, Zap, TrendingUp, Briefcase, Code2, Users, MessageSquare, Mail, MapPin, Linkedin as LinkedinIcon, Github, ExternalLink, Eye, Trophy, CaseSensitive,
  FileCode, Palette, Braces, Type, Orbit, Server as ServerIcon, Wind, Feather, ServerCog, ToyBrick, Database, Cloud, Wand2, Sparkles, BrainCircuit, Cpu, GitFork, GitCommit, Container, Package as PackageIcon, TerminalSquare, Puzzle, Handshake, Repeat, IterationCcw, MessageCircle as MessageCircleIcon, ClipboardList, Crown, UserCheck, Wrench, TabletSmartphone, Share2, Home, Code, ListChecks, Brain, Settings, Lightbulb, Activity, Globe, BarChart, GitBranch, LayoutDashboard, Menu, Search, Info, List
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SkillBadgeWithAnimation from '@/components/skill-badge-with-animation';
import AnimatedSection from '@/components/animated-section';


// Experience Data
const experiences: ExperienceItem[] = [
  {
    role: "Technical Head",
    organization: "IUCEE VVIT Student Chapter",
    dates: "2024 – Present",
    details: [
      "Orchestrated a 24-hour Inter-College Hackathon with over 300 participants, managing logistics and mentorship.",
      "Represented the institute at external summits to foster cross-campus collaboration.",
      "Led technical workshops on modern web development and competitive programming for 200+ students.",
    ],
    iconName: "Briefcase",
  }
];

// Projects Data
const initialProjects: Project[] = [
  {
    id: "zencontrol",
    title: "ZenControl – AI Agent for Headless Android",
    subtitle: "A headless automation framework for Android devices.",
    shortDescription: "An automation layer that enables complete phone operation (calls, navigation, media) without a display, driven by remote commands and AI.",
    detailedDescription: "ZenControl is an automation framework that converts a standard Android phone into a fully usable, display-less device. It uses a custom Accessibility Service to traverse the view hierarchy and inject gestures, enabling remote operation. The system is built on a modular AiTool architecture using Clean Architecture and Hilt, allowing for scalable and maintainable task execution. The primary goal is to enable complex device interactions without human intervention, supporting a truly headless workflow.",
    imageSrc: "https://picsum.photos/seed/zencontrol-banner/600/400",
    imageHint: "headless android automation",
    screenshots: [
        { src: "https://picsum.photos/seed/zen-ss1/800/450", alt: "ZenControl Screenshot 1", hint: "android automation code" },
        { src: "https://picsum.photos/seed/zen-ss2/800/450", alt: "ZenControl Screenshot 2", hint: "accessibility service diagram" },
    ],
    videoUrl: undefined,
    tech: ["Kotlin", "Hilt", "Accessibility API", "Clean Architecture"],
    achievements: ["Enables full device control without a screen", "Modular AiTool system for scalable tasks"],
    githubLink: "https://github.com/kkek-041405/ZenControl",
    liveLink: undefined,
    storyLink: "/stories/why?project=zencontrol",
  },
  {
    id: "chess",
    title: "Multiplayer Chess Application",
    subtitle: "Real-time chess with friends or AI.",
    shortDescription: "A production-ready Android chess app with real-time multiplayer, optimized UI, and an integrated Stockfish AI for offline play.",
    detailedDescription: "This feature-rich chess application, live on the Google Play Store, was built using Kotlin and Jetpack Compose with a focus on performance and modern UI. It features a low-latency multiplayer backend using WebSockets for real-time move synchronization. For offline practice, the app integrates the adaptive Stockfish chess engine, providing a challenging AI opponent. The project demonstrates end-to-end product delivery, from design to deployment.",
    imageSrc: "https://picsum.photos/seed/chess-banner/600/400",
    imageHint: "chess game",
    screenshots: [
        { src: "https://picsum.photos/seed/chess-ss1/800/450", alt: "Online Chess Arena Screenshot 1", hint: "mobile app screenshot" },
        { src: "https://picsum.photos/seed/chess-ss2/800/450", alt: "Online Chess Arena Screenshot 2", hint: "mobile app screenshot" },
    ],
    videoUrl: undefined,
    tech: ["Kotlin", "Jetpack Compose", "WebSockets", "Stockfish"],
    achievements: ["Sub-120ms latency on mobile networks", "Published on Google Play Store"],
    githubLink: "https://github.com/kkek-041405/Chess",
    liveLink: "https://play.google.com/store/apps/details?id=com.KKEK.chess",
    storyLink: "/stories/why?project=chess",
  },
   {
    id: "notenest",
    title: "Portfolio + NoteNest",
    subtitle: "A personal portfolio with a secure, AI-powered notes module.",
    shortDescription: "A secure workspace with AI-powered summarization for notes, supporting a headless workflow for information management without visual screen usage.",
    detailedDescription: "This project is a dual-purpose application serving as a professional portfolio and a private notes-taking module called NoteNest. Built with Next.js, TypeScript, and Firebase, it provides a secure, password-protected area for personal notes. A key feature is the integration of Google Genkit to offer AI-powered summarization and insights, designed to support a headless workflow where information can be managed without constant visual interaction. Data is persisted securely using Firestore with real-time synchronization.",
    imageSrc: "https://picsum.photos/seed/notenest-banner/600/400",
    imageHint: "portfolio notes app",
    screenshots: [
        { src: "https://picsum.photos/seed/notenest-ss1/800/450", alt: "NoteNest Screenshot 1", hint: "notes app interface" },
    ],
    videoUrl: undefined,
    tech: ["Next.js", "TypeScript", "Firebase", "Google Genkit", "Tailwind CSS"],
    achievements: ["AI-powered note summarization", "Secure, real-time data persistence"],
    githubLink: "https://github.com/kkek-041405/",
    liveLink: "https://kkek.vercel.app",
    storyLink: "/stories/why?project=notenest",
  },
];

// Skills Data
const skillsData = [
  {
    category: "Languages & Core Technologies",
    icon: Code2,
    items: [
      { name: "Kotlin", skillIcon: ToyBrick, proficiency: 90 },
      { name: "TypeScript", skillIcon: Type, proficiency: 85 },
      { name: "JavaScript", skillIcon: Braces, proficiency: 80 },
      { name: "Java", skillIcon: FileCode, proficiency: 75 },
      { name: "Python", skillIcon: FileCode, proficiency: 70 },
      { name: "SQL", skillIcon: Database, proficiency: 65 },
    ],
  },
   {
    category: "Frameworks & Libraries",
    icon: ServerIcon,
    items: [
      { name: "Next.js", skillIcon: ServerCog, proficiency: 85 },
      { name: "React.js", skillIcon: Orbit, proficiency: 80 },
      { name: "Jetpack Compose", skillIcon: Palette, proficiency: 90 },
      { name: "Firebase", skillIcon: Cloud, proficiency: 85 },
      { name: "Google Genkit", skillIcon: Wand2, proficiency: 75 },
      { name: "Hilt", skillIcon: Container, proficiency: 80 },
    ],
  },
  {
    category: "Tools & Methodologies",
    icon: Wrench,
    items: [
      { name: "Git & GitHub", skillIcon: GitFork },
      { name: "Problem Solving", skillIcon: Puzzle },
      { name: "System Design", skillIcon: Share2 },
      { name: "Agile", skillIcon: IterationCcw },
      { name: "Leadership", skillIcon: Crown },
    ],
  },
];


export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [isSkillsSectionVisible, setIsSkillsSectionVisible] = useState(false);
  const skillsSectionRef = useRef<HTMLElement>(null);
  const pathname = usePathname();


  // Set document title dynamically for client components
  useEffect(() => {
    document.title = 'K. Komal Eshwara Kumar — Software Engineer';
  }, []);

  // Intersection Observer for Skills Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSkillsSectionVisible(true);
        } else {
          // Optionally reset animation when out of view
          // setIsSkillsSectionVisible(false); 
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentSkillsSection = skillsSectionRef.current;
    if (currentSkillsSection) {
      observer.observe(currentSkillsSection);
    }

    return () => {
      if (currentSkillsSection) {
        observer.unobserve(currentSkillsSection);
      }
    };
  }, []);


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
       {pathname !== '/lm' && <PortfolioHeader />}

      <main className="flex-1">
        {/* Hero Section (Home) */}
        <AnimatedSection as="div" triggerOnce={true} initialClassName="opacity-0" animateClassName="opacity-100" duration="duration-1000" delay="delay-100">
          <section id="home" className="w-full py-12 md:py-16 lg:py-20 xl:py-20 bg-gradient-to-br from-background to-secondary/10 dark:from-background dark:to-secondary/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center space-y-6 lg:col-span-2 xl:col-span-1">
                  <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-primary shadow-xl">
                    <AvatarImage src="https://picsum.photos/seed/avatar-kkek/200" alt="KKEK" data-ai-hint="professional portrait" />
                    <AvatarFallback>KKEK</AvatarFallback>
                  </Avatar>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    <span className="block">K. Komal Eshwara Kumar</span>
                    <span className="block text-primary text-2xl sm:text-3xl md:text-4xl mt-2">Software Engineer</span>
                  </h1>
                   <p className="max-w-2xl text-base sm:text-lg text-muted-foreground md:mx-0">
                    Interested in automation and user-independent system behavior. I focus on reliability, performance, and clean design to build systems that scale.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full sm:w-auto">
                    <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow w-full sm:w-auto">
                      <Link href="#contact">
                        <Mail className="mr-2 h-5 w-5" /> Get in Touch
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/50 transition-shadow w-full sm:w-auto">
                      <Link href="/resume" target="_blank" download>
                        <Download className="mr-2 h-5 w-5" /> Download Resume
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
              <UserCircle className="h-10 w-10 text-primary" /> About Me
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
                  I'm a software engineer who enjoys breaking down complex problems and building systems that scale without constant user involvement. My focus is on reliability, performance, and clean design over shortcuts.
                </p>
                <p>
                  I specialize in full-stack development with a strong interest in automation and system-level behavior. My work includes creating production-ready Android applications, developing scalable web platforms with Next.js and Firebase, and engineering headless automation frameworks.
                </p>
                <p>
                  As the Technical Head of the IUCEE Student Chapter, I lead initiatives that connect academic concepts with real-world application, orchestrating hackathons and workshops that have engaged hundreds of students. I thrive in environments where I can contribute to product-driven engineering teams and tackle challenging technical problems.
                </p>
                 <Button variant="link" asChild className="text-primary p-0 h-auto text-lg hover:underline">
                   <Link href="/resume" target="_blank" download>
                     View My Full Resume <Download className="ml-2 h-5 w-5" />
                    </Link>
                 </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Experience Section */}
        <AnimatedSection as="section" id="experience" triggerOnce={true} className="py-12 md:py-16 bg-background dark:bg-background" delay="delay-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <TrendingUp className="h-10 w-10 text-primary" /> Experience & Leadership
            </h2>
            <ExperienceSection experiences={experiences} />
          </div>
        </AnimatedSection>

        {/* Projects Section */}
        <AnimatedSection as="section" id="projects" triggerOnce={true} className="py-12 md:py-16 bg-secondary/10 dark:bg-secondary/5" delay="delay-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                    <Zap className="h-10 w-10 text-primary" /> Featured Projects
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
                      {project.achievements && project.achievements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Key Features</h4>
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
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t pt-4 pb-4 bg-secondary/20 dark:bg-secondary/10 rounded-b-lg px-4 mt-auto">
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
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
                        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
                            {project.storyLink && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={project.storyLink}>
                                        <Feather className="mr-1.5 h-4 w-4" />
                                        Story
                                    </Link>
                                </Button>
                            )}
                            <Button size="sm" onClick={() => handleOpenModal(project)} className="w-full sm:w-auto">
                                <Eye className="mr-1.5 h-4 w-4" /> View Details
                            </Button>
                        </div>
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

        {/* Skills Section */}
        <AnimatedSection as="div" triggerOnce={true} delay="delay-200">
          <section id="skills" ref={skillsSectionRef} className="py-12 md:py-16 bg-background dark:bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                      <Cpu className="h-10 w-10 text-primary" /> Technical Skills
                  </h2>
                  <p className="text-muted-foreground mt-2 text-lg">
                      My toolkit for building reliable and performant applications.
                  </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {skillsData.map((skillCategory) => (
                  <div key={skillCategory.category}>
                    <div className="flex items-center gap-3 mb-6">
                      {skillCategory.icon && <skillCategory.icon className="h-8 w-8 text-primary" />}
                      <h3 className="text-2xl font-semibold text-foreground">{skillCategory.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-start">
                      {skillCategory.items.map(skill => (
                        skill.proficiency !== undefined ? (
                          <SkillBadgeWithAnimation
                            key={skill.name}
                            name={skill.name}
                            skillIcon={skill.skillIcon}
                            proficiency={skill.proficiency}
                            isVisible={isSkillsSectionVisible}
                          />
                        ) : (
                          <div 
                            key={skill.name} 
                            className="bg-card border border-border rounded-xl p-3 shadow-lg flex flex-col items-center justify-center gap-2 w-28 h-28 sm:w-32 sm:h-32 text-center hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 p-1 rounded-lg flex items-center justify-center bg-secondary transition-all">
                              <skill.skillIcon className="text-secondary-foreground h-5 w-5 sm:h-6 sm:h-6" />
                            </div>
                            <span className="font-medium text-xs text-foreground mt-1">{skill.name}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
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
                <Link href="https://www.linkedin.com/in/konatham-komal-eshwara-kumar-a253a522a/" target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="mr-2 h-5 w-5" /> Connect on LinkedIn
                </Link>
              </Button>
            </div>
            <div className="mt-12 text-muted-foreground flex flex-col items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Based in Guntur, Andhra Pradesh, India</span>
              <span className="text-sm">(Open to remote opportunities)</span>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <PortfolioFooter />
    </div>
  );
}

    
