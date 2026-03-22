"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Code, Smartphone, GitBranch, Network, Palette, Server, FileText, Linkedin, Mail, Award, Layers } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

const FirebaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M5.016 18.23L12 3.815L18.984 18.229L12.001 22L5.016 18.23Z" fill="#FFCA28"/>
    <path d="M12 3.815L5.016 18.23L8.08 17.036L12 9.034V3.815Z" fill="#FFA000"/>
    <path d="M12.0001 21.9999L18.9841 18.229L15.2441 11.233L12.0001 21.9999Z" fill="#F57C00"/>
  </svg>
);

// Condensed Section Component
const Section = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <section className={className}>
        <div className="mb-2">
            <h2 className="text-[14px] font-bold tracking-widest text-slate-100 uppercase">{title}</h2>
            <div className="mt-1 h-[2px] w-8 bg-primary rounded-full"></div>
        </div>
        {children}
    </section>
);

const projects = [
    {
        id: "chess",
        title: "Multiplayer Chess App",
        shortDescription: "Developed and successfully deployed a real-time multiplayer chess application, achieving 50+ downloads. Designed the backend using Firebase to handle concurrent matchmaking and state synchronization.",
        tech: ["Kotlin", "Compose", "Firebase"], // Shortened "Jetpack Compose" to fit tighter
        githubLink: "https://github.com/kkek-041405/chess",
        liveLink: "https://play.google.com/store/apps/dev?id=6378119908597517835",
    },
    {
        id: "zencontrol",
        title: "ZenControl",
        shortDescription: "Engineered a headless device controller mapped to physical triggers. Bypassed the need for touch interface and implemented low-latency response using Coroutines.",
        tech: ["Kotlin", "Coroutines", "Accessibility"],
        githubLink: "https://github.com/kkek-041405/ZenControl",
    }
];

const experiences = [
    {
        role: "Technical Head",
        organization: "VVISC (VVIT IUCEE Student Chapter)",
        dates: "Sept 2024 – Present",
        tags: ["Hackathons", "Events", "Leadership"],
        description: [
            "Co-led a 30-member committee to execute a major hackathon with 300+ participants.",
            "Engineered the registration platform and portfolio website to streamline onboarding.",
            "Directed multiple intra-college technical presentation events."
        ]
    },
];

const education = [
    {
        degree: "B.Tech, Computer Science & Engineering",
        institution: "Vasireddy Venkatadri Institute of Technology",
        dates: "2023 – 2026",
        score: "CGPA: 6.86"
    },
    {
        degree: "Diploma, Computer Engineering",
        institution: "M.B.T.S Government Polytechnic",
        dates: "2020 – 2023",
        score: "Score: 76%"
    }
];

const skills = [
  { name: "Kotlin", icon: KotlinIcon },
  { name: "Android SDK", icon: Smartphone },
  { name: "Compose", icon: Layers },
  { name: "Java", icon: Code },
  { name: "React.js", icon: Network },
  { name: "JavaScript", icon: FileText },
  { name: "Git", icon: GitBranch },
  { name: "Firebase", icon: FirebaseIcon },
  { name: "SQL", icon: Server },
  { name: "HTML/CSS", icon: Palette },
];

const awards = [
    {
        title: "Special Mention (Ideathon)",
        description: "Recognized for innovative problem-solving and technical excellence while officially representing VVIT in a cross-college competition."
    }
];

export default function PortfolioPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-300 font-sans flex flex-col">
        {/* Header - Compact */}
        <header className="flex-none px-6 py-4 border-b border-slate-800/50 bg-slate-950/40 backdrop-blur-md">
            <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
                <a href="#about" className="text-sm font-bold text-slate-100 hover:text-white transition-colors">
                K. K. ESHWARA KUMAR <span className="text-primary font-normal ml-1 text-slate-400 hidden sm:inline">| Android Developer</span>
                </a>
                <nav className="hidden md:flex items-center space-x-6 text-[13px] font-medium">
                    <Button asChild size="sm" variant="outline" className="h-8 border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-md">
                        <Link href="/resume" target="_blank" rel="noopener noreferrer">Download Resume</Link>
                    </Button>
                </nav>
            </div>
        </header>
        
        {/* Main Content Dashboard */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-5 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[4fr_5fr] gap-x-12 h-full">
                {/* Left Column - Perfectly Fitted */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col justify-between h-full"
                >
                    
                    {/* Hero Area */}
                    <div>
                        <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
                            Hi, I'm K. K. Eshwara Kumar. <br/>
                            <span className="text-slate-400 font-medium">I build high-impact Android applications.</span>
                        </h1>
                        <p className="text-[14px] text-slate-400 mt-4 leading-relaxed max-w-lg">
                            Final-year Computer Science student and Technical Head at IUCEE with a focus on Android architecture and full-stack systems. Proven track record of deploying production-ready apps (Kotlin, React) and leading technical teams for large-scale hackathons.
                        </p>
                        
                        {/* Action Buttons & Socials */}
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                            <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-lg shadow-primary/20 transition-transform active:scale-95">
                                <a href="mailto:komaleshwarakumarkonatham@gmail.com">Contact Me</a>
                            </Button>
                            
                            <div className="flex flex-wrap gap-2 sm:ml-2">
                                <a href="https://github.com/kkek-041405" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-300 hover:text-primary transition-all hover:-translate-y-0.5 bg-slate-900/80 px-3 py-2 rounded-full border border-slate-800 hover:border-primary/50">
                                    <Github className="h-4 w-4" /> GitHub
                                </a>
                                <a href="https://linkedin.com/in/kkek" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-300 hover:text-primary transition-all hover:-translate-y-0.5 bg-slate-900/80 px-3 py-2 rounded-full border border-slate-800 hover:border-primary/50">
                                    <Linkedin className="h-4 w-4" /> LinkedIn
                                </a>
                                <a href="https://play.google.com/store/apps/dev?id=6378119908597517835" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-300 hover:text-primary transition-all hover:-translate-y-0.5 bg-slate-900/80 px-3 py-2 rounded-full border border-slate-800 hover:border-primary/50">
                                    <Smartphone className="h-4 w-4" /> Play Store
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Education Side-by-Side */}
                    <Section title="Education">
                        <div className="grid grid-cols-2 gap-3 max-w-lg">
                            {education.map(edu => (
                                <div key={edu.degree} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-100 text-[12px] leading-tight">{edu.degree}</h3>
                                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{edu.institution}</p>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-800/50 flex items-center justify-between">
                                        <p className="text-[11px] font-bold text-primary">{edu.score}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{edu.dates}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                     {/* Skills Grid */}
                    <Section title="Technical Skills" className="pb-4">
                        <div className="grid grid-cols-5 gap-3 max-w-md">
                            {skills.map(skill => (
                                <div key={skill.name} className="flex flex-col items-center gap-1.5 text-center group">
                                    <div className="h-10 w-10 p-2 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 transition-all duration-300 group-hover:border-primary/50 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-md group-hover:shadow-primary/20 shadow-sm relative overflow-hidden">
                                        <skill.icon />
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-400">{skill.name}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </motion.div>

                {/* Right Column - Dashboard Style */}
                <div className="flex flex-col justify-start gap-6 lg:gap-8 h-full pb-2">
                    
                    {/* Projects Side-by-Side */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Section title="Featured Projects">
                        <div className="grid grid-cols-2 gap-4 lg:gap-5">
                            {projects.map(project => (
                                <div key={project.id} className="bg-slate-900/60 p-4 md:p-5 rounded-xl border border-slate-800 flex flex-col transition-all duration-300 hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 group">
                                    <h3 className="font-bold text-[15px] text-slate-100 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-slate-400 text-[12px] leading-relaxed mt-1.5 flex-grow line-clamp-3">
                                        {project.shortDescription}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 my-3">
                                        {project.tech.map(t => (
                                            <Badge key={t} variant="secondary" className="font-normal text-[9px] px-1.5 py-0 bg-slate-950/50 border border-slate-700/50 text-slate-300">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-800/50">
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-[11px] font-medium text-slate-300 hover:text-primary transition-colors">
                                                <Github className="mr-1 h-3 w-3" /> Source
                                            </a>
                                        )}
                                        {project.githubLink && project.liveLink && <span className="text-slate-700 mx-1">|</span>}
                                        {project.liveLink && (
                                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-[11px] font-medium text-slate-300 hover:text-primary transition-colors">
                                                <ExternalLink className="mr-1 h-3 w-3" /> Live App
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                    </motion.div>

                    {/* Experience Banner */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Section title="Experience">
                        <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800 transition-all duration-300 hover:bg-slate-800/60 hover:border-slate-700">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/50">
                                <div>
                                    <h3 className="font-bold text-slate-100 text-[14px]">{experiences[0].role}</h3>
                                    <p className="text-[12px] text-primary mt-0.5 font-medium">{experiences[0].organization}</p>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium bg-slate-950 px-2 py-1 rounded-md">{experiences[0].dates}</span>
                            </div>
                            <ul className="list-disc list-outside ml-4 text-[12px] text-slate-400 space-y-1">
                                {experiences[0].description.map((point, idx) => (
                                    <li key={idx} className="leading-snug pl-1">{point}</li>
                                ))}
                            </ul>
                        </div>
                    </Section>
                    </motion.div>

                    {/* Awards Banner */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Section title="Awards & Achievements">
                        <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800 flex items-center gap-4 transition-all duration-300 hover:bg-slate-800/60 hover:border-slate-700">
                            <div className="p-2 bg-primary/10 rounded-md text-primary shrink-0">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-100 text-[13px]">{awards[0].title}</h3>
                                <p className="text-[12px] text-slate-400 mt-0.5 line-clamp-2">{awards[0].description}</p>
                            </div>
                        </div>
                    </Section>
                    </motion.div>

                </div>
            </div>
        </div>
    </main>
  );
}
