"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';

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
        <h2 className="text-xs font-semibold uppercase text-zinc-400 tracking-widest mb-4">{title}</h2>
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
      <div className="bg-black text-white h-screen font-sans overflow-hidden">
        <main className="container mx-auto px-6 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 h-full">
                
                <div className="flex flex-col gap-8 py-12 pr-8 justify-center">
                    
                    <header>
                        <h1 className="text-4xl font-bold text-zinc-100 leading-tight">
                            Hi, I'm K. K. Eshwara Kumar. I build high-impact Android applications.
                        </h1>
                        <p className="mt-3 text-zinc-400 max-w-lg text-base">
                           Hello, I'm a final-year Computer Science student building production-ready mobile applications with Kotlin, Jetpack Compose, and Firebase.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                <a href="#projects">View Projects</a>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="border-zinc-700 hover:bg-zinc-900 hover:text-white">
                                <a href="mailto:komaleshwarakumarkonatham@gmail.com">Contact Me</a>
                            </Button>
                        </div>
                    </header>
                    
                    <Section title="EXPERIENCE">
                        <div className="grid grid-cols-1 gap-3">
                             {experiences.map(exp => (
                                <div key={exp.role} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-zinc-100 text-base">{exp.role}</h3>
                                        <p className="text-xs text-zinc-500 text-right shrink-0 ml-4">{exp.dates}</p>
                                    </div>
                                    <p className="text-sm text-zinc-400 font-medium">{exp.organization}</p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {exp.tech.map(t => <Badge key={t} variant="secondary" className="px-2 py-0.5 text-[10px]">{t}</Badge>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="EDUCATION">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                             {education.map(edu => (
                                <div key={edu.degree}>
                                  <h3 className="font-semibold text-zinc-100 text-base">{edu.degree}</h3>
                                  <p className="text-zinc-500 text-sm">{edu.institution}</p>
                                </div>
                              ))}
                        </div>
                    </Section>

                    <Section title="SKILLS">
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <Badge key={skill} className="px-2.5 py-0.5 text-xs" variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </Section>
                </div>

                <div id="projects" className="py-12 flex flex-col justify-center">
                    <Section title="PROJECTS">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {projects.map(project => (
                              <div 
                                key={project.id} 
                                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-col group hover:border-zinc-700 transition-colors cursor-pointer"
                                onClick={() => handleProjectClick(project)}
                              >
                                <h3 className="font-semibold text-base text-zinc-100 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                <p className="text-zinc-400 text-xs mt-1 mb-3 flex-grow">{project.shortDescription}</p>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {project.tech.map(t => <Badge key={t} variant="secondary" className="text-[10px] px-2 py-0.5">{t}</Badge>)}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium">
                                    {project.githubLink && <Link href={project.githubLink} onClick={e => e.stopPropagation()} target="_blank" className="text-blue-400 hover:underline">GitHub</Link>}
                                    {project.liveLink && <Link href={project.liveLink} onClick={e => e.stopPropagation()} target="_blank" className="text-blue-400 hover:underline">Live Demo</Link>}
                                </div>
                              </div>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </main>
      </div>
      <ExpandedProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
