"use client";

import { Button } from "@/components/ui/button";

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
const Section = ({ title, children, className, size = "default" }: { title: string; children: React.ReactNode; className?: string; size?: "default" | "sm" }) => (
    <section className={className}>
        <div className="mb-2.5">
            <h2 className={`${size === "sm" ? "text-lg md:text-xl" : "text-xl md:text-2xl"} font-bold tracking-wide text-slate-100 uppercase`}>{title}</h2>
            <div className="mt-1.5 h-1 w-16 bg-primary rounded-full"></div>
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
        tech: ["Kotlin", "Android Accessibility Services"],
        githubLink: "https://github.com/kkek-041405/ZenControl",
    },
    {
        id: "campus-companion",
        title: "Campus Companion",
        shortDescription: "AI-powered student collaboration platform for sharing resources and academic discussions.",
        tech: ["Kotlin", "Compose"],
        githubLink: "https://github.com/kkek-041405/CampusCompanion",
        liveLink: "https://play.google.com/store/apps/dev?id=6378119908597517835",
    },
    {
        id: "another-project",
        title: "Another Project",
        shortDescription: "WeatherNow is current temperature, and overvtmper eraaaons pul detals, and motensation temperahabsis.",
        tech: ["Kotlin", "Jetpack Compose"],
        githubLink: "https://github.com/kkek-041405/another-project",
        liveLink: "https://play.google.com/store/apps/dev?id=6378119908597517835",
    },
];

const experiences = [
    {
        role: "Technical Head",
        organization: "VVISC (VVIT IUCEE Student Chapter)",
        dates: "Aug 2024 – Present",
        tags: ["Hackathon Organizing", "Event Management", "Leadership"],
    },
];

const education = [
    {
        degree: "B.Tech, Computer Science & Engineering",
        institution: "Vesireddy Venkatadri Institute of Technology (VVIT)",
        dates: "2023 – 2026",
    },
    {
        degree: "Diploma, Computer Engineering",
        institution: "M.B.T.S Government Polytechnic",
        dates: "2020 – 2023",
    }
];

const skills = [
  { name: "Kotlin", icon: KotlinIcon },
  { name: "Aetpack SDK", icon: Smartphone },
  { name: "Jetpack Compose", icon: JetpackComposeIcon },
  { name: "Java", icon: Code },
  { name: "MVVM", icon: Network },
  { name: "Git", icon: GitBranch },
  { name: "Fowlever", icon: Github },
  { name: "Firebase", icon: FirebaseIcon },
  { name: "REST APIs", icon: Server },
  { name: "UI/UX", icon: Palette },
];

export default function PortfolioPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-300 font-sans">
        {/* Header */}
        <header className="sticky md:static top-0 z-50 bg-slate-950/80 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border-b border-slate-800/50 md:border-none">
            <div className="container mx-auto px-4 md:px-8 flex h-16 md:h-20 items-center justify-between">
                <a href="#about" className="text-base font-bold">
                K. K. ESHWARA KUMAR <span className="text-primary font-normal hidden sm:inline">| Android Developer</span>
                </a>
                <nav className="hidden md:flex items-center space-x-6 text-sm">
                    <a href="#about" className="text-slate-300 hover:text-primary transition-colors">About</a>
                    <a href="#experience" className="text-slate-300 hover:text-primary transition-colors">Experience</a>
                    <a href="#projects" className="text-slate-300 hover:text-primary transition-colors">Projects</a>
                    <a href="#skills" className="text-slate-300 hover:text-primary transition-colors">Skills</a>
                    <a href="#education" className="text-slate-300 hover:text-primary transition-colors">Education</a>
                    <a href="#contact" className="text-slate-300 hover:text-primary transition-colors">Contact</a>
                    <Button asChild size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-md">
                        <Link href="/resume" target="_blank" rel="noopener noreferrer">Resume</Link>
                    </Button>
                </nav>
                 <div className="md:hidden">
                    {/* Placeholder for mobile menu if needed */}
                </div>
            </div>
        </header>
        
        {/* Main Content */}
        <div className="mx-4 md:mx-12 grid grid-cols-1 md:grid-cols-[5fr_4fr] gap-x-8 md:h-[calc(100vh-80px)] items-start pt-6 md:pt-4">
            {/* Left Column */}
            <div className="flex flex-col justify-between py-6 md:py-0 md:h-full md:pb-28">
                {/* Hero */}
                <div id="about">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight">Hi, I'm K. K. Eshwara Kumar. I build high-impact Android applications.</h1>
                    <p className="text-base text-slate-400 max-w-xl mt-3">Hello, I'm a final-year Computer Science student building production-ready mobile applications with Kotlin, Jetpack Compose, and Firebase.</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                        <Button size="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-lg shadow-primary/20">
                            <a href="#projects">View Projects</a>
                        </Button>
                        <Button size="default" variant="outline" asChild className="border-slate-700 hover:bg-slate-800 hover:text-white rounded-full px-8">
                            <a href="#contact">Contact Me</a>
                        </Button>
                    </div>
                </div>

                {/* Skills */}
                <Section title="Skills">
                    <div className="grid grid-cols-5 gap-x-2 gap-y-3 max-w-md">
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

                {/* Education */}
                <Section title="Education">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {education.map(edu => (
                            <div key={edu.degree} className="bg-slate-900/70 p-4 rounded-lg border border-slate-800">
                                <h3 className="font-semibold text-slate-100 text-sm">{edu.degree}</h3>
                                <p className="text-xs text-slate-400 mt-1">{edu.institution}</p>
                                <p className="text-xs text-slate-500 mt-1">{edu.dates}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            {/* Right Column */}
            <div id="projects" className="flex flex-col md:justify-between space-y-3 md:h-full md:pb-28">
                <Section title="Projects">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projects.map(project => (
                            <div key={project.id} className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex flex-col h-full group transition-all duration-300 hover:border-slate-700 hover:-translate-y-1">
                                <h3 className="font-bold text-base text-slate-100 group-hover:text-primary transition-colors">{project.title}</h3>
                                <p className="text-slate-400 text-xs mt-1.5 mb-3 flex-grow">{project.shortDescription}</p>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {project.tech.map(t => (
                                        <Badge key={t} variant="secondary" className="text-xs px-2 py-0.5 flex items-center gap-1">
                                            {t === "Kotlin" && <span className="h-3 w-3 inline-block"><KotlinIcon /></span>}
                                            {(t === "Jetpack Compose" || t === "Compose") && <span className="h-3 w-3 inline-block"><JetpackComposeIcon /></span>}
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium mt-auto text-primary">
                                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary/80 transition-colors">GitHub</a>}
                                    {project.githubLink && project.liveLink && <span className="text-slate-600">|</span>}
                                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary/80 transition-colors">Live Demo</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Experience */}
                <Section title="Experience" size="sm">
                    <div className="space-y-3">
                        {experiences.map(exp => (
                            <div key={exp.role} className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-100 text-sm">{exp.role}</h3>
                                        <p className="text-xs text-slate-400 font-medium">{exp.organization}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{exp.dates}</span>
                                </div>
                                {exp.tags && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {exp.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-[11px] px-2 py-0.5">{tag}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
        
        {/* Contact & Footer centered */}
        <footer id="contact" className="absolute bottom-5 left-0 right-0">
            <div className="flex items-center justify-center gap-x-8">
                <a href="https://github.com/kkek-041405" title="GitHub" target="_blank" rel="noopener noreferrer" className="group relative text-slate-500 hover:text-primary transition-all duration-300 hover:scale-125 hover:-translate-y-1">
                    <Github className="h-7 w-7" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">GitHub</span>
                </a>
                <a href="https://linkedin.com/in/kkek" title="LinkedIn" target="_blank" rel="noopener noreferrer" className="group relative text-slate-500 hover:text-primary transition-all duration-300 hover:scale-125 hover:-translate-y-1">
                    <Linkedin className="h-7 w-7" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">LinkedIn</span>
                </a>
                <a href="https://play.google.com/store/apps/dev?id=6378119908597517835" title="Play Store" target="_blank" rel="noopener noreferrer" className="group relative text-slate-500 hover:text-primary transition-all duration-300 hover:scale-125 hover:-translate-y-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path d="M3.61 1.814L13.793 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm.96-.574l11.2 6.272-2.88 2.882L4.57 1.24zm11.2 15.52L4.57 22.76l8.32-9.154 2.88 2.882v.272zM16.8 11.2L20.4 12l-3.6.8-2.16-1.6 2.16-1.6z"/></svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">Play Store</span>
                </a>
                <a href="mailto:komaleshwarakumarkonatham@gmail.com" title="Email" target="_blank" rel="noopener noreferrer" className="group relative text-slate-500 hover:text-primary transition-all duration-300 hover:scale-125 hover:-translate-y-1">
                    <Mail className="h-7 w-7" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">Email</span>
                </a>
            </div>
        </footer>
    </main>
  );
}
