"use client";

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Code, Smartphone, GitBranch, Network, Palette, Server, FileText, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

// SVGs for specific tech icons not in Lucide
const KotlinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M2 2H22L12 12L22 22H2V2Z" fill="url(#kotlin-gradient)" />
    <defs>
      <linearGradient id="kotlin-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7F52FF" />
        <stop offset="1" stopColor="#E040FB" />
      </linearGradient>
    </defs>
  </svg>
);

const JetpackComposeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path d="M7.5 16.5L2 22L12 12L7.5 16.5Z" fill="#3DDC84" />
        <path d="M12 12L2 2L7.5 7.5L12 12Z" fill="#3DDC84" opacity="0.8" />
        <path d="M16.5 7.5L22 2L12 12L16.5 7.5Z" fill="#3DDC84" />
        <path d="M12 12L22 22L16.5 16.5L12 12Z" fill="#3DDC84" opacity="0.8" />
    </svg>
);

const FirebaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M5.016 18.23L12 3.815L18.984 18.229L12.001 22L5.016 18.23Z" fill="#FFCA28"/>
    <path d="M12 3.815L5.016 18.23L8.08 17.036L12 9.034V3.815Z" fill="#FFA000"/>
    <path d="M12.0001 21.9999L18.9841 18.229L15.2441 11.233L12.0001 21.9999Z" fill="#F57C00"/>
  </svg>
);

// New Section component for consistent titling
const Section = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <section className={className}>
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-100">{title}</h2>
            <div className="mt-2 h-1 w-16 bg-primary rounded-full"></div>
        </div>
        {children}
    </section>
);


const projects = [
    {
        id: "chess",
        title: "Multiplayer Chess Application",
        shortDescription: "Real-time multiplayer chess app with matchmaking and live game state synchronization using Firebase.",
        tech: ["Kotlin", "Jetpack Compose", "Firebase"],
        githubLink: "https://github.com/kkek-041405/chess",
        liveLink: "https://play.google.com/store/apps/dev?id=6378119908597517835",
    },
    {
        id: "zencontrol",
        title: "ZenControl",
        shortDescription: "Accessibility app using hardware buttons to control a device with a broken touch screen.",
        tech: ["Kotlin", "Android Accessibility"],
        githubLink: "https://github.com/kkek-041405/ZenControl",
    },
    {
        id: "campus-companion",
        title: "Campus Companion",
        shortDescription: "AI-powered student collaboration platform for sharing resources and academic discussions.",
        tech: ["React", "Firebase", "Gemini API"],
        githubLink: "https://github.com/kkek-041405/CampusCompanion",
    },
];

const experiences = [
    {
        role: "Technical Head",
        organization: "VVISC (VVIT IUCEE Student Chapter)",
        dates: "Aug 2024 – Present",
    },
    {
        role: "Android Developer (Freelance)",
        organization: "Personal Projects",
        dates: "2023 - Present",
    }
];

const education = [
    {
        degree: "B.Tech, Computer Science & Engineering",
        institution: "Vasireddy Venkatadri Institute of Technology",
    },
    {
        degree: "Diploma, Computer Engineering",
        institution: "M.B.T.S Government Polytechnic",
    }
];

const skills = [
  { name: "Kotlin", icon: KotlinIcon },
  { name: "Android SDK", icon: Smartphone },
  { name: "Jetpack Compose", icon: JetpackComposeIcon },
  { name: "Java", icon: Code },
  { name: "Firebase", icon: FirebaseIcon },
  { name: "Git", icon: GitBranch },
  { name: "REST APIs", icon: Network },
  { name: "Material Design", icon: Palette },
];

export default function PortfolioPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-300 font-sans">
        {/* Header */}
        <header className="sticky md:static top-0 z-50 bg-slate-950/80 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border-b border-slate-800/50 md:border-none">
            <div className="container mx-auto px-4 md:px-8 flex h-16 md:h-20 items-center justify-between">
                <a href="#about" className="text-base font-bold">
                K. K. Eshwara Kumar <span className="text-primary font-normal hidden sm:inline">| Android Developer</span>
                </a>
                <nav className="hidden md:flex items-center space-x-6 text-sm">
                    <a href="#about" className="text-slate-300 hover:text-primary transition-colors">About</a>
                    <a href="#experience" className="text-slate-300 hover:text-primary transition-colors">Experience</a>
                    <a href="#projects" className="text-slate-300 hover:text-primary transition-colors">Projects</a>
                    <a href="#skills" className="text-slate-300 hover:text-primary transition-colors">Skills</a>
                    <a href="#contact" className="text-slate-300 hover:text-primary transition-colors">Contact</a>
                    <Button asChild size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary rounded-md">
                        <Link href="/resume" target="_blank" rel="noopener noreferrer">Resume</Link>
                    </Button>
                </nav>
                 <div className="md:hidden">
                    {/* Placeholder for mobile menu if needed */}
                </div>
            </div>
        </header>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-x-8 md:h-[calc(100vh-80px)] items-center">
            {/* Left Column */}
            <div className="flex flex-col justify-center space-y-6 py-6 md:py-0">
                {/* Hero */}
                <div id="about">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Hi, I'm K. K. Eshwara Kumar. I build high-impact Android applications.</h1>
                    <p className="text-base text-slate-400 max-w-xl mt-3">Final-year Computer Science student building production-ready Android apps using Kotlin, Jetpack Compose, and Firebase.</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <Button size="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 shadow-lg shadow-primary/20">
                            <a href="#projects">View Projects</a>
                        </Button>
                        <Button size="default" variant="outline" asChild className="border-slate-700 hover:bg-slate-800 hover:text-white rounded-md px-6">
                            <a href="#contact">Contact Me</a>
                        </Button>
                    </div>
                </div>
                
                {/* Experience */}
                <Section title="Experience" className="mt-6 md:mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {experiences.map(exp => (
                            <div key={exp.role} className="bg-slate-900/70 p-4 rounded-lg border border-slate-800">
                                <h3 className="font-bold text-slate-100 text-sm">{exp.role}</h3>
                                <p className="text-sm text-slate-400 font-medium">{exp.organization}</p>
                                <p className="text-xs text-slate-500 mt-1">{exp.dates}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Education */}
                <Section title="Education" className="mt-6 md:mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {education.map(edu => (
                            <div key={edu.degree} className="bg-slate-900/70 p-4 rounded-lg border border-slate-800">
                                <h3 className="font-bold text-slate-100 text-sm">{edu.degree}</h3>
                                <p className="text-sm text-slate-400 mt-1">{edu.institution}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Skills */}
                <Section title="Skills" className="mt-6 md:mt-0">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        {skills.map(skill => (
                            <div key={skill.name} className="flex flex-col items-center gap-1.5 text-center group">
                                <div className="h-10 w-10 p-2 flex items-center justify-center rounded-lg bg-slate-800/50">
                                    <skill.icon />
                                </div>
                                <p className="text-xs font-medium text-slate-400">{skill.name}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            {/* Right Column */}
            <div id="projects" className="flex flex-col justify-center">
                <Section title="Projects">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex flex-col h-full group transition-all duration-300 hover:border-slate-700 hover:-translate-y-1">
                                <h3 className="font-bold text-base text-slate-100 group-hover:text-primary transition-colors">{project.title}</h3>
                                <p className="text-slate-400 text-xs mt-1 mb-3 flex-grow">{project.shortDescription}</p>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {project.tech.map(t => <Badge key={t} variant="secondary" className="text-xs px-2 py-0.5">{t}</Badge>)}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium mt-auto">
                                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors"><Github size={14} /> GitHub</a>}
                                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors"><ExternalLink size={14} /> Live Demo</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
        
        {/* Contact & Footer in the corner */}
        <footer id="contact" className="absolute bottom-4 left-4 md:left-8">
            <div className="flex items-center gap-x-4">
                <a href="https://linkedin.com/in/kkek" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://github.com/kkek-041405" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                </a>
                <a href="mailto:komaleshwarakumarkonatham@gmail.com" aria-label="Email" className="text-slate-500 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                </a>
            </div>
        </footer>
    </main>
  );
}
