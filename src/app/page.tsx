
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Mail, Download, Github, Linkedin, ExternalLink, Code, Briefcase, GraduationCap, ArrowRight, BookOpenCheck
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import AnimatedSection from '@/components/animated-section';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Data
const projects: Project[] = [
    {
        id: "chess",
        title: "Multiplayer Chess Application",
        subtitle: "A real-time multiplayer chess app with game state validation and matchmaking, published on the Google Play Store.",
        shortDescription: "Real-time, synchronized chess application with matchmaking, deployed on the Google Play Store.",
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
        subtitle: "University collaboration platform with role-based auth, resource sharing, and structured discussion forums.",
        shortDescription: "A web platform for university students to collaborate and share resources.",
        detailedDescription: "A web platform designed for university students to collaborate, share resources, and participate in structured discussions.\n\nSystem Design Features:\n- Role-based authentication system\n- Public/private resource visibility model\n- Structured discussion forums (no anonymous posting)\n- Firebase-backed storage and database integration\n- Modular React component architecture",
        imageSrc: "https://picsum.photos/seed/campus/800/450",
        imageHint: "university students collaboration",
        screenshots: [
            { src: "https://picsum.photos/seed/campus-ss1/800/450", alt: "Campus companion dashboard", hint: "dashboard ui" },
            { src: "https://picsum.photos/seed/campus-ss2/800/450", alt: "Discussion forum view", hint: "forum interface" },
        ],
        tech: ["React", "Firebase"],
        githubLink: "https://github.com/kkek-041405/CampusCompanion",
    },
];

const experiences = [
    {
        role: "Technical Head",
        organization: "VVISC (VVIT IUCEE Student Chapter)",
        dates: "Aug 2024 – Present",
        details: [
            "Organized a 24-hour inter-college hackathon with 300+ participants.",
            "Coordinated multiple technical and non-technical events across institutions.",
            "Received Special Mention at Ideathon – Malnad College of Engineering.",
        ],
    }
];

const education = [
    {
        degree: "B.Tech, Computer Science & Engineering",
        institution: "Vasireddy Venkatadri Institute of Technology (VVIT), Guntur",
        dates: "2023 – 2026",
        score: "CGPA: 6.86",
    },
    {
        degree: "Diploma, Computer Engineering",
        institution: "M.B.T.S Government Polytechnic, Nallapadu",
        dates: "2020 – 2023",
        score: "75%",
    }
];

const skills = [
  "Kotlin", "Jetpack Compose", "Firebase", "React", "Data Structures", "Algorithms", "Next.js", "TypeScript", "Java", "Python",
];

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
      <div className="flex flex-col h-screen bg-black text-white p-4 sm:p-6 md:p-8 gap-4">
        {/* Main 2x2 Grid */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 sm:gap-6 md:gap-8 min-h-0">
          
          {/* Top-Left: Hero */}
          <AnimatedSection as="div" className="bg-zinc-900/30 rounded-xl p-6 flex flex-col justify-center text-left">
            <h1 className="text-4xl font-bold tracking-tighter">
              K. K. Eshwara Kumar
            </h1>
            <h2 className="text-xl text-blue-400 font-semibold mt-1">
              Android Developer
            </h2>
            <p className="mt-3 text-base text-zinc-300 max-w-md">
              Final-year Computer Science student building production-ready mobile applications with Kotlin, Jetpack Compose, and Firebase.
            </p>
            <div className="flex gap-4 mt-6">
              <Button size="lg" asChild>
                <Link href="mailto:komaleshwarakumarkonatham@gmail.com">
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
          
          {/* Top-Right: Projects */}
          <AnimatedSection as="div" className="bg-zinc-900/30 rounded-xl p-6 flex flex-col min-h-0" delay="delay-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Code className="h-6 w-6 text-blue-400"/> Projects</h2>
            <ScrollArea className="-mr-4 pr-4">
              <div className="space-y-4">
                {projects.map(project => (
                  <div 
                    key={project.id} 
                    className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex flex-col group hover:-translate-y-1 hover:border-zinc-700 transition-all cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <h3 className="font-bold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 my-2">
                      {project.tech.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                    <p className="text-zinc-400 text-sm mt-1 flex-grow">{project.shortDescription}</p>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          {project.githubLink && <Button variant="link" size="sm" asChild onClick={(e) => e.stopPropagation()}><Link href={project.githubLink} target="_blank">GitHub <Github className="ml-1.5"/></Link></Button>}
                          {project.liveLink && <Button variant="link" size="sm" asChild onClick={(e) => e.stopPropagation()}><Link href={project.liveLink} target="_blank">Play Store <ExternalLink className="ml-1.5"/></Link></Button>}
                        </div>
                        <span className="text-xs text-zinc-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">Details <ArrowRight className="h-3 w-3"/></span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AnimatedSection>

          {/* Bottom-Left: Education & Skills */}
          <AnimatedSection as="div" className="bg-zinc-900/30 rounded-xl p-6 flex flex-col min-h-0" delay="delay-200">
            <ScrollArea className="-mr-4 pr-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><GraduationCap className="h-6 w-6 text-blue-400"/> Education</h2>
                    <div className="space-y-4">
                        {education.map(edu => (
                          <div key={edu.degree}>
                            <h3 className="font-semibold text-lg text-zinc-100">{edu.degree}</h3>
                            <p className="text-zinc-400 text-sm">{edu.institution} &bull; {edu.dates}</p>
                            <p className="font-mono text-sm text-zinc-300">{edu.score}</p>
                          </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><BookOpenCheck className="h-6 w-6 text-blue-400"/> Skills</h2>
                     <div className="flex flex-wrap gap-3">
                        {skills.map(skill => (
                            <Badge key={skill} className="px-3 py-1 text-sm" variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </ScrollArea>
          </AnimatedSection>

          {/* Bottom-Right: Experience */}
          <AnimatedSection as="div" className="bg-zinc-900/30 rounded-xl p-6 flex flex-col min-h-0" delay="delay-300">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Briefcase className="h-6 w-6 text-blue-400"/> Experience</h2>
               <ScrollArea className="-mr-4 pr-4">
                <div className="space-y-6">
                    {experiences.map(exp => (
                        <div key={exp.role}>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-zinc-100">{exp.role}</h3>
                            <p className="text-xs text-zinc-400 text-right shrink-0 ml-4">{exp.dates}</p>
                          </div>
                          <p className="text-zinc-300 font-medium">{exp.organization}</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400 text-sm">
                            {exp.details.map(detail => <li key={detail}>{detail}</li>)}
                          </ul>
                        </div>
                    ))}
                </div>
              </ScrollArea>
          </AnimatedSection>

        </main>
        
        {/* Footer */}
        <footer className="py-2">
            <div className="container mx-auto flex justify-center gap-x-6">
                <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="https://linkedin.com/in/kkek" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><Linkedin className="h-6 w-6" /></Link>
                    </TooltipTrigger><TooltipContent><p>LinkedIn</p></TooltipContent></Tooltip>
                    
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="https://github.com/kkek-041405" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><Github className="h-6 w-6" /></Link>
                    </TooltipTrigger><TooltipContent><p>GitHub</p></TooltipContent></Tooltip>
                    
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="mailto:komaleshwarakumarkonatham@gmail.com" aria-label="Email" className="text-zinc-500 hover:text-white transition-colors"><Mail className="h-6 w-6" /></Link>
                    </TooltipTrigger><TooltipContent><p>Email</p></TooltipContent></Tooltip>
                    
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="https://play.google.com/store/apps/dev?id=6378119908597517835" aria-label="Google Play Developer Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><ExternalLink className="h-6 w-6" /></Link>
                    </TooltipTrigger><TooltipContent><p>Google Play</p></TooltipContent></Tooltip>
                </TooltipProvider>
            </div>
        </footer>
      </div>
      <ExpandedProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
