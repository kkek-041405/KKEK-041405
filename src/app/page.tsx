
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import { ScrollArea } from '@/components/ui/scroll-area';

const projects: Project[] = [
    {
        id: "chess",
        title: "Multiplayer Chess Application",
        subtitle: "A real-time multiplayer chess app with game state validation and matchmaking, published on the Google Play Store.",
        shortDescription: "Real-time multiplayer chess app with matchmaking and live game state synchronization using Firebase.",
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
        tech: ["Kotlin", "Android Accessibility Services"],
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
        tech: ["Hackathon Organizing", "Event Management", "Leadership"],
    }
];

const education = [
    {
        degree: "B.Tech, Computer Science & Engineering",
        institution: "Vasireddy Venkatadri Institute of Technology (VVIT)",
    },
    {
        degree: "Diploma, Computer Engineering",
        institution: "M.B.T.S Government Polytechnic",
    }
];

const skills = [
  "Kotlin", "Jetpack Compose", "Firebase", "Android SDK", "React", "Data Structures", "Algorithms", "Next.js", "TypeScript", "Java", "Python", "Node.js", "Git"
];

const Section: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({ title, children, className }) => (
    <section className={className}>
        <h2 className="text-sm font-semibold uppercase text-zinc-400 tracking-widest mb-6">{title}</h2>
        {children}
    </section>
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
      <div className="bg-black text-white h-screen font-sans">
        <main className="container mx-auto px-4 sm:px-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 h-full">
                
                {/* Left Column */}
                <ScrollArea className="h-full">
                <div className="flex flex-col gap-12 py-16 lg:py-24 pr-8">
                    
                    {/* Hero Section */}
                    <header>
                        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 leading-tight">
                            Hi, I'm K. K. Eshwara Kumar. I build high-impact Android applications.
                        </h1>
                        <p className="mt-4 text-zinc-400 max-w-lg">
                           Hello, I'm a final-year Computer Science student building production-ready mobile applications with Kotlin, Jetpack Compose, and Firebase.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                <a href="#projects">View Projects</a>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="border-zinc-700 hover:bg-zinc-900 hover:text-white">
                                <a href="mailto:komaleshwarakumarkonatham@gmail.com">Contact Me</a>
                            </Button>
                        </div>
                    </header>
                    
                    {/* Experience Section */}
                    <Section title="EXPERIENCE">
                        <div className="grid grid-cols-1 gap-4">
                             {experiences.map(exp => (
                                <div key={exp.role} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-zinc-100">{exp.role}</h3>
                                        <p className="text-xs text-zinc-500 text-right shrink-0 ml-4">{exp.dates}</p>
                                    </div>
                                    <p className="text-sm text-zinc-400 font-medium">{exp.organization}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {exp.tech.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Education Section */}
                    <Section title="EDUCATION">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                             {education.map(edu => (
                                <div key={edu.degree}>
                                  <h3 className="font-semibold text-zinc-100">{edu.degree}</h3>
                                  <p className="text-zinc-500 text-sm">{edu.institution}</p>
                                </div>
                              ))}
                        </div>
                    </Section>

                     {/* Skills Section */}
                    <Section title="SKILLS">
                        <div className="flex flex-wrap gap-3">
                            {skills.map(skill => (
                                <Badge key={skill} className="px-3 py-1 text-sm" variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </Section>
                </div>
                </ScrollArea>

                {/* Right Column (Projects) */}
                <ScrollArea className="h-full">
                <div id="projects" className="py-16 lg:py-24">
                    <Section title="PROJECTS">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {projects.map(project => (
                              <div 
                                key={project.id} 
                                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col group hover:border-zinc-700 transition-colors cursor-pointer"
                                onClick={() => handleProjectClick(project)}
                              >
                                <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                <p className="text-zinc-400 text-sm mt-2 mb-4 flex-grow">{project.shortDescription}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.tech.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    {project.githubLink && <Link href={project.githubLink} onClick={e => e.stopPropagation()} target="_blank" className="text-blue-400 hover:underline">GitHub</Link>}
                                    {project.liveLink && <Link href={project.liveLink} onClick={e => e.stopPropagation()} target="_blank" className="text-blue-400 hover:underline">Live Demo</Link>}
                                </div>
                              </div>
                            ))}
                        </div>
                    </Section>
                </div>
                </ScrollArea>
            </div>
        </main>
      </div>
      <ExpandedProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
