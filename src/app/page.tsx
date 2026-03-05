
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Mail, Download, Github, Linkedin, ExternalLink, Code, Briefcase, GraduationCap, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import AnimatedSection from '@/components/animated-section';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
]

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
      <div className="flex flex-col min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-16 space-y-24">
          
          <AnimatedSection as="header" className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tighter">
              K. K. Eshwara Kumar
            </h1>
            <h2 className="text-2xl text-blue-400 font-semibold mt-2">
              Android Developer
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              Final-year Computer Science student building production-ready mobile applications with Kotlin, Jetpack Compose, and Firebase.
            </p>
            <div className="flex justify-center gap-4 mt-8">
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
          
          <main className="space-y-24">
            
            <AnimatedSection as="section" id="projects" delay="delay-100">
              <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3"><Code className="h-7 w-7 text-blue-400"/> Selected Projects</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(project => (
                  <div 
                    key={project.id} 
                    className="bg-zinc-900/50 p-7 rounded-2xl border border-zinc-800 flex flex-col group hover:-translate-y-1 hover:border-zinc-700 transition-all cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <h3 className="font-bold text-xl text-zinc-100 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 my-3">
                      {project.tech.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                    <p className="text-zinc-400 text-base mt-1 flex-grow">{project.shortDescription}</p>
                    <div className="flex gap-4 mt-6">
                      {project.githubLink && <Button variant="link" asChild onClick={(e) => e.stopPropagation()}><Link href={project.githubLink} target="_blank">GitHub <Github className="ml-2"/></Link></Button>}
                      {project.liveLink && <Button variant="link" asChild onClick={(e) => e.stopPropagation()}><Link href={project.liveLink} target="_blank">Play Store <ExternalLink className="ml-2"/></Link></Button>}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
                <AnimatedSection as="section" id="skills" delay="delay-200">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><Code className="h-7 w-7 text-blue-400"/> Skills</h2>
                     <div className="p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <div className="flex flex-wrap gap-3">
                            {skills.map(skill => (
                                <Badge key={skill} className="px-4 py-2 text-base" variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection as="section" id="experience" delay="delay-300">
                     <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><Briefcase className="h-7 w-7 text-blue-400"/> Experience</h2>
                     <div className="p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
                        {experiences.map(exp => (
                            <div key={exp.role}>
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-xl text-zinc-100">{exp.role}</h3>
                                <p className="text-sm text-zinc-400 text-right shrink-0 ml-4">{exp.dates}</p>
                              </div>
                              <p className="text-zinc-300 text-lg font-medium">{exp.organization}</p>
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400 text-base">
                                {exp.details.map(detail => <li key={detail}>{detail}</li>)}
                              </ul>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
            
            <AnimatedSection as="section" id="education" delay="delay-400">
                 <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3"><GraduationCap className="h-7 w-7 text-blue-400"/> Education</h2>
                <div className="space-y-8 max-w-2xl mx-auto">
                    {education.map(edu => (
                      <div key={edu.degree} className="p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <h3 className="font-bold text-xl text-zinc-100">{edu.degree}</h3>
                        <p className="text-zinc-400 text-base mt-1">{edu.institution} &bull; {edu.dates}</p>
                        <p className="font-mono text-base text-zinc-300 mt-1">{edu.score}</p>
                      </div>
                    ))}
                </div>
            </AnimatedSection>
            
          </main>
        </div>

        <footer className="py-8 border-t border-zinc-800">
            <div className="container mx-auto flex justify-center gap-x-8">
                <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="https://linkedin.com/in/kkek" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><Linkedin className="h-7 w-7" /></Link>
                    </TooltipTrigger><TooltipContent><p>LinkedIn</p></TooltipContent></Tooltip>
                    
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="https://github.com/kkek-041405" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><Github className="h-7 w-7" /></Link>
                    </TooltipTrigger><TooltipContent><p>GitHub</p></TooltipContent></Tooltip>
                    
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="mailto:komaleshwarakumarkonatham@gmail.com" aria-label="Email" className="text-zinc-500 hover:text-white transition-colors"><Mail className="h-7 w-7" /></Link>
                    </TooltipTrigger><TooltipContent><p>Email</p></TooltipContent></Tooltip>
                    
                    <Tooltip><TooltipTrigger asChild>
                        <Link href="https://play.google.com/store/apps/dev?id=6378119908597517835" aria-label="Google Play Developer Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><ExternalLink className="h-7 w-7" /></Link>
                    </TooltipTrigger><TooltipContent><p>Google Play</p></TooltipContent></Tooltip>
                </TooltipProvider>
            </div>
        </footer>
      </div>
      <ExpandedProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
