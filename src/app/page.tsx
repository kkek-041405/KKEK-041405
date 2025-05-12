
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  UserCircle2 as UserCircle, Download, Zap, TrendingUp, Briefcase, Code2, Brain, Users, Settings, MessageSquare, Mail, MapPin, Linkedin as LinkedinIcon, Github, ExternalLink, Link as LinkIcon, Eye, Trophy, CaseSensitive,
  FileCode, Palette, Braces, Type, Orbit, Server as ServerIcon, Wind, Feather, ServerCog, ToyBrick, Database, Cloud, Wand2, Sparkles, BrainCircuit, Cpu, GitFork, GitCommit, Container, Package as PackageIcon, TerminalSquare, Puzzle, Handshake, Repeat, IterationCcw, MessageCircle as MessageCircleIcon, ClipboardList, Crown, UserCheck, Wrench
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import type { ExperienceItem } from "@/components/experience-section"; // Keep ExperienceItem type
import { ExperienceSection } from "@/components/experience-section";
import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
    videoUrl: undefined,
    tech: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Genkit", "ShadCN UI"],
    achievements: ["Winner - University Hackathon '23", "Featured on DevPost"],
    githubLink: "https://github.com/kkeshkumar/project-alpha-example",
    liveLink: "https://project-alpha.example.com",
    caseStudyLink: undefined,
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

// Skills Data
const skillsData = [
  {
    category: "Frontend Development",
    icon: Code2,
    items: [
      { name: "HTML5", skillIcon: FileCode },
      { name: "CSS3", skillIcon: Palette },
      { name: "JavaScript (ES6+)", skillIcon: Braces },
      { name: "TypeScript", skillIcon: Type },
      { name: "React", skillIcon: Orbit },
      { name: "Next.js", skillIcon: ServerIcon }, // Using ServerIcon as a placeholder for Next.js
      { name: "Vue.js", skillIcon: Code2 }, // Placeholder, Vue has specific logo
      { name: "Tailwind CSS", skillIcon: Wind },
      { name: "ShadCN UI", skillIcon: Feather }, // Conceptual for lightness/utility
      { name: "Responsive Design", skillIcon: TabletSmartphone }, // Need to import TabletSmartphone
    ],
  },
  {
    category: "Backend Development",
    icon: ServerCog, // Changed from Settings
    items: [
      { name: "Node.js", skillIcon: ServerCog },
      { name: "Express.js", skillIcon: ServerIcon },
      { name: "Python", skillIcon: FileCode }, // No direct Python icon, use FileCode
      { name: "Django", skillIcon: FileCode },
      { name: "Flask", skillIcon: FileCode },
      { name: "Firebase (Firestore, Auth)", skillIcon: Cloud }, // Cloud or Database
      { name: "REST APIs", skillIcon: LinkIcon },
      { name: "GraphQL", skillIcon: Share2 }, // Need to import Share2
    ],
  },
  {
    category: "Databases",
    icon: Database, // Changed from Zap
    items: [
      { name: "MongoDB", skillIcon: Database },
      { name: "PostgreSQL", skillIcon: Database },
      { name: "MySQL", skillIcon: Database },
      { name: "Firestore", skillIcon: Cloud }, // Consistent with Firebase
      { name: "Redis", skillIcon: Database }, // Generic DB icon
    ],
  },
  {
    category: "AI & Machine Learning",
    icon: Brain,
    items: [
      { name: "Genkit", skillIcon: Wand2 },
      { name: "TensorFlow", skillIcon: BrainCircuit },
      { name: "PyTorch", skillIcon: Cpu }, // Conceptual
      { name: "Scikit-learn", skillIcon: Cpu }, // Conceptual
      { name: "Natural Language Processing", skillIcon: MessageCircleIcon },
      { name: "Computer Vision", skillIcon: Eye },
      { name: "Prompt Engineering", skillIcon: Sparkles },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: Wrench, // Changed from Settings
    items: [
      { name: "Git", skillIcon: GitFork },
      { name: "GitHub", skillIcon: Github },
      { name: "Docker", skillIcon: Container },
      { name: "Kubernetes (Basic)", skillIcon: PackageIcon }, // Conceptual for orchestration
      { name: "CI/CD (GitHub Actions)", skillIcon: Repeat }, // Conceptual for pipeline/automation
      { name: "AWS (EC2, S3 - Basic)", skillIcon: Cloud },
      { name: "Google Cloud Platform (Basic)", skillIcon: Cloud },
      { name: "VS Code", skillIcon: TerminalSquare },
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
      { name: "Project Management (Basic)", skillIcon: ClipboardList },
      { name: "Leadership", skillIcon: Crown },
    ],
  },
];

// Helper function to import TabletSmartphone and Share2 if not already
import { TabletSmartphone, Share2 } from "lucide-react";


export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");

  // Set document title dynamically for client components
  useEffect(() => {
    document.title = 'K. Komal Eshwara Kumar — Full-Stack Developer & AI Enthusiast | Portfolio';
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
      <PortfolioHeader />

      <main className="flex-1">
        {/* Hero Section (Home) */}
        <section id="home" className="w-full py-20 md:py-28 lg:py-32 xl:py-36 bg-gradient-to-br from-background to-secondary/10 dark:from-background dark:to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-primary shadow-xl mb-2">
                  <AvatarImage src="https://picsum.photos/seed/avatar-kkek/200" alt="KKEK" data-ai-hint="professional portrait" />
                  <AvatarFallback>KKEK</AvatarFallback>
                </Avatar>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
                  Hi, I’m KKEK — <br className="block sm:hidden" />Crafting Scalable Apps <br className="hidden sm:block lg:hidden" />with React & Firebase.
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-primary font-medium">
                  3rd Year CSE | GATE Aspirant | Technical Head @ IUCEE VVIT
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                  <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow w-full sm:w-auto">
                    <Link href="/#projects">
                      <Briefcase className="mr-2 h-5 w-5" /> View Projects
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/50 transition-shadow w-full sm:w-auto">
                    <Link href="/resume.pdf" target="_blank" download>
                      <Download className="mr-2 h-5 w-5" /> Download Resume
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center p-4">
                <Image
                  src="https://picsum.photos/seed/hero-visual/700/650" 
                  alt="Abstract representation of technology and innovation"
                  width={700}
                  height={650}
                  className="rounded-xl shadow-2xl object-cover aspect-[10/9]"
                  data-ai-hint="technology abstract" 
                  priority 
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-16 md:py-24 bg-secondary/20 dark:bg-secondary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 flex items-center justify-center gap-3">
              <UserCircle className="h-10 w-10 text-primary" /> About Me
            </h2>
            <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-center">
              <div className="md:col-span-2">
                <Image
                  src="https://picsum.photos/seed/about-me-kkek/600/700"
                  alt="K. Komal Eshwara Kumar working on a project"
                  width={600}
                  height={700}
                  className="rounded-xl shadow-2xl object-cover aspect-[6/7]"
                  data-ai-hint="person coding"
                />
              </div>
              <div className="md:col-span-3 text-lg space-y-6 text-muted-foreground">
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
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-16 md:py-24 bg-background dark:bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 flex items-center justify-center gap-3">
              <TrendingUp className="h-10 w-10 text-primary" /> Experience & Leadership
            </h2>
            <ExperienceSection experiences={experiences} />
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 md:py-24 bg-secondary/10 dark:bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                    <Zap className="h-10 w-10 text-primary" /> Featured Projects
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">
                    A selection of my work. Click on a project to learn more.
                </p>
            </div>
            <div className="mb-12 flex flex-wrap justify-center gap-2">
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
        {selectedProject && (
          <ExpandedProjectModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={handleCloseModal}
          />
        )}

        {/* Skills Section */}
        <section id="skills" className="py-16 md:py-24 bg-background dark:bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 flex items-center justify-center gap-3">
              <Code2 className="h-10 w-10 text-primary" /> Technical Proficiency
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillsData.map((skillCategory) => (
                <Card key={skillCategory.category} className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg">
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3 pt-5">
                    {skillCategory.icon && <skillCategory.icon className="h-7 w-7 text-primary" />}
                    <CardTitle className="text-xl text-foreground">{skillCategory.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 pt-2">
                      {skillCategory.items.map(skill => (
                        <TooltipProvider key={skill.name} delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-2.5 border rounded-lg hover:bg-accent cursor-default shadow-sm">
                                <skill.skillIcon size={28} className="text-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-foreground text-background">
                              <p>{skill.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center justify-center gap-3">
              <MessageSquare className="h-10 w-10 text-primary" /> Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              I'm actively seeking new opportunities and collaborations. If you have a project in mind, a question, or just want to connect, feel free to reach out! I typically respond within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
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
            <div className="mt-16 text-muted-foreground flex flex-col items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Based in Guntur, Andhra Pradesh, India</span>
              <span className="text-sm">(Open to remote opportunities)</span>
            </div>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
