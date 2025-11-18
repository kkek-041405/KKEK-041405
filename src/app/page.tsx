
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
      "Led technical initiatives, workshops, and hackathons impacting 200+ students.",
      "Mentored junior members in web development and competitive programming.",
      "Developed and deployed 3+ internal tools for chapter management and event coordination.",
      "Fostered an innovation-driven culture on campus through collaborative projects.",
    ],
    iconName: "Briefcase",
  },
  {
    role: "Founder & Lead Developer",
    organization: "Campus Companion (Personal Project)",
    dates: "2023 – Present",
    details: [
      "Conceptualized, designed, and developing a collaborative learning platform for university students.",
      "Implementing features like AI-powered document search and structured discussion forums.",
      "Utilizing React, Next.js, Firebase, and Genkit for a scalable and modern tech stack.",
      "Aiming to enhance student engagement and knowledge sharing within the campus community.",
    ],
    iconName: "Zap",
  },
];

// Projects Data
const initialProjects: Project[] = [
  {
    id: "online-chess-arena",
    title: "Online Chess Arena",
    subtitle: "Play Chess Online with Friends or AI",
    shortDescription: "A real-time multiplayer chess application built with Kotlin and Firebase, offering matches with friends or the computer.",
    detailedDescription: "Online Chess Arena is a Kotlin-based mobile application built using Jetpack Compose and Firebase, designed to deliver a seamless online chess experience. Players can challenge friends in real-time matches or play against an AI. The app supports game invitations, match acceptance, and real-time board updates using Firebase Realtime Database. It's built for simplicity, with a sleek UI and robust gameplay mechanics tailored for casual and serious players alike.",
    imageSrc: "https://raw.githubusercontent.com/kkek-041405/Chess/master/assets/banner.png",
    imageHint: "chess game",
    screenshots: [
        { src: "https://raw.githubusercontent.com/kkek-041405/Chess/master/assets/screenshot1.png", alt: "Online Chess Arena Screenshot 1", hint: "mobile app screenshot" },
        { src: "https://raw.githubusercontent.com/kkek-041405/Chess/master/assets/screenshot2.png", alt: "Online Chess Arena Screenshot 2", hint: "mobile app screenshot" },
        { src: "https://raw.githubusercontent.com/kkek-041405/Chess/master/assets/screenshot3.png", alt: "Online Chess Arena Screenshot 3", hint: "mobile app screenshot" },
    ],
    videoUrl: undefined,
    tech: ["Kotlin", "Jetpack Compose", "Firebase Realtime Database", "Firebase Authentication", "Google Analytics"],
    achievements: ["Developed real-time multiplayer sync using Firebase", "Implemented turn-based logic with online matchmaking"],
    githubLink: "https://github.com/kkek-041405/Chess",
    liveLink: "https://play.google.com/store/apps/details?id=com.KKEK.chess",
    caseStudyLink: undefined,
  },
];

// Skills Data
const skillsData = [
  {
    category: "Core Technologies",
    icon: Code2,
    items: [
      { name: "React", skillIcon: Orbit, proficiency: 85 },
      { name: "Next.js", skillIcon: ServerIcon, proficiency: 80 },
      { name: "TypeScript", skillIcon: Type, proficiency: 75 },
      { name: "Tailwind CSS", skillIcon: Wind, proficiency: 90 },
      { name: "Node.js", skillIcon: ServerCog, proficiency: 70 },
      { name: "Firebase", skillIcon: Cloud, proficiency: 80 },
      { name: "Python", skillIcon: FileCode, proficiency: 65 },
      { name: "Firestore", skillIcon: Database, proficiency: 78 },
      { name: "MongoDB", skillIcon: Database, proficiency: 70 },
    ],
  },
  {
    category: "Soft Skills & Methodologies",
    icon: Users,
    items: [
      { name: "Problem Solving", skillIcon: Puzzle },
      { name: "Team Collaboration", skillIcon: Handshake },
      { name: "Agile Methodologies", skillIcon: IterationCcw },
      { name: "Communication", skillIcon: MessageCircleIcon },
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
    document.title = 'K. Komal Eshwara Kumar — Full-Stack Developer & AI Enthusiast | Portfolio';
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
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6">
                    <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-primary shadow-xl">
                      <AvatarImage src="https://picsum.photos/seed/avatar-kkek/200" alt="KKEK" data-ai-hint="professional portrait" />
                      <AvatarFallback>KKEK</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <p className="text-lg sm:text-xl md:text-2xl font-medium">Hi, I’m KKEK</p>
                      <p className="text-base sm:text-lg text-primary font-medium mt-1">
                        3rd Year CSE | GATE Aspirant | Technical Head @ IUCEE VVIT
                      </p>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-foreground text-center">
                    <span className="block text-center">Building Real-World Apps</span>
                    <span className="block text-center text-primary">Scalable. Performant.</span>
                  </h1>
                   <p className="max-w-2xl text-base sm:text-lg text-muted-foreground md:mx-0">
                    A passionate full-stack developer specializing in React, Next.js, and Firebase. 
                    I love creating efficient, user-friendly web applications and exploring the potential of AI. 
                    Currently seeking opportunities to contribute to innovative projects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full sm:w-auto">
                    <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow w-full sm:w-auto">
                      <Link href="/lm">
                        <BrainCircuit className="mr-2 h-5 w-5" /> LM
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/50 transition-shadow w-full sm:w-auto">
                      <Link href="/resume.pdf" target="_blank" download>
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
                Hello! I'm K. Komal Eshwara Kumar, a dedicated and results-driven software developer with a solid foundation in modern web technologies and a strong interest in artificial intelligence. My journey in tech began with a deep curiosity about how software can solve real-world problems and elevate user experiences—and I’ve been building solutions ever since.
                </p>
                <p>
                I specialize in developing scalable web applications using React.js, Firebase, Node.js, and modern frontend-backend ecosystems. One of my key projects is Campus Companion, a collaborative learning platform for university students, which I designed and deployed with AI-powered document search and structured discussion forums, currently serving an active student community.
                </p>
                <p>
                As the Technical Head of the IUCEE Student Chapter at Vasireddy Venkatadri Institute of Technology, I lead technical initiatives that bridge academic concepts with practical applications. Under my leadership, we've conducted workshops, hackathons, and collaborative projects impacting over 200 students and fostering an innovation-driven culture on campus.
                </p>
                <p>
                Continuous learning is the cornerstone of my professional growth — I actively expand my skill set to stay aligned with cutting-edge technologies and industry demands. I aspire to develop AI-driven products that scale globally and solve real-world challenges in education and collaboration, while taking on leadership roles in transformative tech projects.
                </p>
                 <Button variant="link" asChild className="text-primary p-0 h-auto text-lg hover:underline">
                   <Link href="/resume.pdf" target="_blank" download>
                     Download My CV <Download className="ml-2 h-5 w-5" />
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
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t pt-4 pb-4 bg-secondary/20 dark:bg-secondary/10 rounded-b-lg px-4 mt-auto">
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
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                {skillsData.map((skillCategory) => (
                  <div key={skillCategory.category}>
                    <div className="flex items-center gap-3 mb-6">
                      {skillCategory.icon && <skillCategory.icon className="h-8 w-8 text-primary" />}
                      <h3 className="text-2xl md:text-3xl font-semibold text-foreground">{skillCategory.category}</h3>
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
              I'm actively seeking new opportunities and collaborations. If you have a project in mind, a question, or just want to connect, feel free to reach out! I typically respond within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-primary/50 transition-shadow">
                <Link href="mailto:k.komaleshwarakumar@example.com">
                  <Mail className="mr-2 h-5 w-5" /> Send an Email
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto shadow-lg hover:shadow-accent/50 transition-shadow">
                <Link href="https://linkedin.com/in/kkeshkumar" target="_blank" rel="noopener noreferrer">
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




    

    