
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import { Github, ExternalLink, Code, Smartphone, GitBranch, Network, Palette, Server, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// SVGs for specific tech icons not in Lucide
const KotlinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path d="M7.5 16.5L2 22L12 12L7.5 16.5Z" fill="#3DDC84" />
        <path d="M12 12L2 2L7.5 7.5L12 12Z" fill="#3DDC84" opacity="0.8" />
        <path d="M16.5 7.5L22 2L12 12L16.5 7.5Z" fill="#3DDC84" />
        <path d="M12 12L22 22L16.5 16.5L12 12Z" fill="#3DDC84" opacity="0.8" />
    </svg>
);

const FirebaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M5.016 18.23L12 3.815L18.984 18.229L12.001 22L5.016 18.23Z" fill="#FFCA28"/>
    <path d="M12 3.815L5.016 18.23L8.08 17.036L12 9.034V3.815Z" fill="#FFA000"/>
    <path d="M12.0001 21.9999L18.9841 18.229L15.2441 11.233L12.0001 21.9999Z" fill="#F57C00"/>
  </svg>
);

const ReactIcon = () => (
  <svg width="24" height="24" viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-[#61DAFB]">
    <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="10" ry="4.5"></ellipse>
      <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
      <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
    </g>
  </svg>
);


const projects: Project[] = [
    {
        id: "chess",
        title: "Multiplayer Chess Application",
        subtitle: "A real-time multiplayer chess app with game state validation and matchmaking, published on the Google Play Store.",
        shortDescription: "Real-time synchronized chess with matchmaking, move validation, and Firebase-based multiplayer.",
        detailedDescription: "Developed and deployed a real-time multiplayer chess application enabling synchronized gameplay across devices.\n\nEngineering Highlights:\n- Implemented real-time move synchronization using Firebase Realtime Database\n- Designed game state validation logic to prevent illegal moves\n- Built matchmaking logic for pairing online players\n- Designed responsive UI using Jetpack Compose\n- Managed production deployment on Google Play Store",
        imageSrc: "https://picsum.photos/seed/chess/800/450",
        imageHint: "chess game",
        screenshots: [
            { src: "https://picsum.photos/seed/chess-ss1/800/450", alt: "Chess game in progress", hint: "chess game" },
            { src: "https://picsum.photos/seed/chess-ss2/800/450", alt: "Chess main menu", hint: "chess menu" },
            { src: "https://picsum.photos/seed/chess-ss3/800/450", alt: "Player profile screen", hint: "user profile" },
        ],
        tech: ["Kotlin", "Jetpack Compose", "Firebase"],
        githubLink: "https://github.com/kkek-041405/chess",
        liveLink: "https://play.google.com/store/apps/dev?id=6378119908597517835",
    },
    {
        id: "zencontrol",
        title: "ZenControl",
        subtitle: "An Android accessibility app to control a device with hardware buttons, solving a real-world hardware failure problem.",
        shortDescription: "Accessibility app using hardware buttons to control a device with a broken touch screen.",
        detailedDescription: "Developed an Android application enabling device control using volume buttons when touch input is non-functional. Built to solve a real personal hardware failure problem.\n\nEngineering Highlights:\n- Implemented background service for system-level interaction\n- Used Accessibility APIs to trigger navigation commands\n- Designed lightweight event-based control logic with a focus on minimal resource consumption.",
        imageSrc: "https://picsum.photos/seed/zencontrol/800/450",
        imageHint: "phone accessibility",
        screenshots: [
            { src: "https://picsum.photos/seed/zencontrol-ss1/800/450", alt: "ZenControl settings screen", hint: "app settings" },
            { src: "https://picsum.photos/seed/zencontrol-ss2/800/450", alt: "Visual of accessibility overlay", hint: "accessibility overlay" },
        ],
        tech: ["Kotlin", "Android Accessibility"],
        githubLink: "https://github.com/kkek-041405/ZenControl",
    },
    {
        id: "campus-companion",
        title: "Campus Companion",
        subtitle: "AI-powered student collaboration platform for sharing resources and academic discussions.",
        shortDescription: "AI-powered student collaboration platform for sharing resources and academic discussions.",
        detailedDescription: "A web platform designed for university students to collaborate, share resources, and participate in structured discussions.\n\nSystem Design Features:\n- Role-based authentication system\n- Public/private resource visibility model\n- Structured discussion forums (no anonymous posting)\n- Firebase-backed storage and database integration\n- Modular React component architecture",
        imageSrc: "https://picsum.photos/seed/campus/800/450",
        imageHint: "university students collaboration",
        screenshots: [
            { src: "https://picsum.photos/seed/campus-ss1/800/450", alt: "Campus companion dashboard", hint: "dashboard ui" },
            { src: "https://picsum.photos/seed/campus-ss2/800/450", alt: "Discussion forum view", hint: "forum interface" },
        ],
        tech: ["React", "Firebase", "Gemini API"],
        githubLink: "https://github.com/kkek-041405/CampusCompanion",
    },
];

const experiences = [
    {
        role: "Technical Head",
        organization: "VVISC (VVIT IUCEE Student Chapter)",
        dates: "Aug 2024 – Present",
        tags: ["Hackathon Organizing", "Event Management", "Leadership"],
    },
    {
        role: "Android Developer (Freelance)",
        organization: "Personal Projects",
        dates: "2023 - Present",
        tags: ["App Development", "UI/UX Design", "Play Store"],
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
  { name: "React", icon: ReactIcon },
];

const FloatingRobot = () => (
    <div className="fixed bottom-10 right-10 w-56 h-auto z-10 hidden lg:block animate-float">
        <Image 
            src="https://picsum.photos/seed/robot/220/280" 
            alt="AI Robot Mascot" 
            width={220}
            height={280}
            className="opacity-90"
            data-ai-hint="robot mascot illustration"
        />
    </div>
);


export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-16 lg:gap-8 min-h-screen">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center py-24">
            <div className="space-y-12">
              <section id="about">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Hi, I'm K. K. Eshwara Kumar. I build high-impact Android applications.</h1>
                <p className="mt-4 text-lg text-slate-400 max-w-xl">Final-year Computer Science student building production-ready Android apps using Kotlin, Jetpack Compose, and Firebase.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-lg shadow-primary/20">
                    <a href="#projects">View Projects</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-slate-700 hover:bg-slate-800 hover:text-white rounded-full px-8">
                    <a href="#contact">Contact Me</a>
                  </Button>
                </div>
              </section>

              <section id="experience">
                <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-widest mb-6">Experience</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {experiences.map(exp => (
                    <div key={exp.role} className="glass-card p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-100 text-lg">{exp.role}</h3>
                        <p className="text-xs text-slate-400 text-right shrink-0 ml-4">{exp.dates}</p>
                      </div>
                      <p className="text-md text-slate-300 font-medium">{exp.organization}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                          {exp.tags.map(t => <Badge key={t} variant="secondary" className="px-2.5 py-1 text-xs">{t}</Badge>)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              <section id="education">
                <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-widest mb-6">Education</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                   {education.map(edu => (
                      <div key={edu.degree} className="glass-card p-6">
                        <h3 className="font-bold text-slate-100 text-lg">{edu.degree}</h3>
                        <p className="text-md text-slate-400 mt-1">{edu.institution}</p>
                      </div>
                    ))}
                </div>
              </section>

              <section id="skills">
                 <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-widest mb-6">Skills</h2>
                 <div className="flex flex-wrap items-center gap-4">
                    {skills.map(skill => (
                      <div key={skill.name} className="flex flex-col items-center gap-2 text-center group">
                        <div className="h-16 w-16 p-4 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700/50 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/50">
                            <skill.icon />
                        </div>
                        <p className="text-xs font-medium text-slate-400">{skill.name}</p>
                      </div>
                    ))}
                 </div>
              </section>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden lg:flex flex-col justify-center py-24">
            <section id="projects">
              <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-widest mb-6">Projects</h2>
                <div className="grid grid-cols-2 gap-6">
                  {projects.map(project => (
                    <div 
                      key={project.id} 
                      className="glass-card p-6 group cursor-pointer flex flex-col h-full"
                      onClick={() => handleProjectClick(project)}
                    >
                      <h3 className="font-bold text-lg text-slate-100 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-slate-400 text-sm mt-2 mb-4 flex-grow">{project.shortDescription}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map(t => <Badge key={t} variant="secondary" className="text-xs px-2.5 py-1">{t}</Badge>)}
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium mt-auto">
                          {project.githubLink && <a href={project.githubLink} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"><Github size={16} /> GitHub</a>}
                          {project.liveLink && <a href={project.liveLink} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"><ExternalLink size={16} /> Live Demo</a>}
                      </div>
                    </div>
                  ))}
                </div>
            </section>
          </div>
        </div>
      </div>
      <FloatingRobot />
      <ExpandedProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
