
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Mail, Download, Github, Linkedin, ExternalLink, Code, Briefcase, GraduationCap
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExpandedProjectModal, type Project } from '@/components/expanded-project-modal';
import AnimatedSection from '@/components/animated-section';

// Data
const projects: Project[] = [
    {
        id: "chess",
        title: "Multiplayer Chess Application",
        subtitle: "A real-time multiplayer chess app with game state validation and matchmaking, published on the Google Play Store.",
        shortDescription: "Real-time, synchronized chess application deployed on the Google Play Store.",
        detailedDescription: "Developed and deployed a real-time multiplayer chess application enabling synchronized gameplay across devices.\n\nEngineering Highlights:\n- Implemented real-time move synchronization using Firebase Realtime Database\n- Designed game state validation logic to prevent illegal moves\n- Built matchmaking logic for pairing online players\n- Designed responsive UI using Jetpack Compose\n- Managed production deployment on Google Play Store",
        imageSrc: "https://picsum.photos/seed/chess/800/450",
        imageHint: "chess game",
        screenshots: [
            { src: "https://picsum.photos/seed/chess-ss1/800/450", alt: "Chess game in progress", hint: "chess game" },
            { src: "https://picsum.photos/seed/chess-ss2/800/450", alt: "Chess main menu", hint: "chess menu" },
            { src: "https://picsum.photos/seed/chess-ss3/800/450", alt: "Player profile screen", hint: "user profile" },
        ],
        tech: ["Kotlin", "Jetpack Compose", "Firebase Realtime Database"],
        githubLink: "https://github.com/kkek-041405/chess",
        liveLink: "https://play.google.com/store/apps/dev?id=6378119908597517835",
    },
    {
        id: "zencontrol",
        title: "ZenControl",
        subtitle: "An Android accessibility app to control a device with hardware buttons, solving a real-world hardware failure problem.",
        shortDescription: "Accessibility app to control a device using hardware buttons when the touch screen is broken.",
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
            "Orchestrated a 24-hour inter-college hackathon with 300+ participants.",
            "Organized multiple intra-college technical and non-technical events.",
            "Awarded Special Mention at Ideathon, Malnad College of Engineering.",
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

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing the project to allow for exit animation
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-black text-white p-6 gap-6">
        <main className="grid md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Left Column */}
          <div className="flex flex-col gap-6 min-h-0">
            {/* Top-Left: Bio */}
            <AnimatedSection as="div" className="p-5 bg-zinc-900/30 rounded-xl flex flex-col justify-start">
              <div className="mb-4">
                <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-400">
                  K.K. Eshwara kumar
                </h1>
                <p className="mt-2 text-lg text-zinc-400">
                  A final-year CSE student seeking an Android Development Internship, passionate about building polished, production-ready mobile applications.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700">
                  <Link href="mailto:komaleshwarakumarkonatham@gmail.com">
                    Get in Touch <Mail className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white">
                  <Link href="/resume" target="_blank">
                    View Resume <Download className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
              </div>
            </AnimatedSection>

            {/* Bottom-Left: Education */}
            <AnimatedSection as="div" className="flex-1 p-5 bg-zinc-900/30 rounded-xl flex flex-col min-h-0" delay="delay-100">
              <h2 className="text-xl font-bold mb-3 flex items-center shrink-0"><GraduationCap className="mr-2"/>Education</h2>
              <ScrollArea className="flex-1 -mr-3 pr-3">
                <div className="space-y-3">
                  {education.map(edu => (
                    <div key={edu.degree} className="p-3 rounded-lg">
                       <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-zinc-100">{edu.degree}</h3>
                        <p className="text-sm text-zinc-400 text-right shrink-0 ml-4">{edu.dates}</p>
                      </div>
                      <div className="flex justify-between items-center text-zinc-300 mt-1">
                        <p className="font-medium">{edu.institution}</p>
                        <p className="font-mono text-sm">{edu.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AnimatedSection>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 min-h-0">
            {/* Top-Right: Projects */}
            <AnimatedSection as="div" className="flex-1 p-5 bg-zinc-900/30 rounded-xl flex flex-col min-h-0" delay="delay-200">
              <h2 className="text-xl font-bold mb-3 flex items-center shrink-0"><Code className="mr-2"/>Projects</h2>
              <ScrollArea className="flex-1 -mr-3 pr-3">
                <div className="space-y-2">
                  {projects.map(project => (
                    <div 
                      key={project.id} 
                      className="p-3 rounded-lg hover:border-blue-700/50 hover:bg-zinc-900/50 transition-all cursor-pointer group"
                      onClick={() => handleProjectClick(project)}
                    >
                      <h3 className="font-semibold text-base text-zinc-100 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                      <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{project.shortDescription}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AnimatedSection>

            {/* Bottom-Right: Experience */}
            <AnimatedSection as="div" className="flex-1 p-5 bg-zinc-900/30 rounded-xl flex flex-col min-h-0" delay="delay-300">
              <h2 className="text-xl font-bold mb-3 flex items-center shrink-0"><Briefcase className="mr-2"/>Experience</h2>
              <ScrollArea className="flex-1 -mr-3 pr-3">
                <div className="space-y-3">
                  {experiences.map(exp => (
                    <div key={exp.role} className="p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-zinc-100">{exp.role}</h3>
                        <p className="text-sm text-zinc-400 text-right shrink-0 ml-4">{exp.dates}</p>
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
          </div>
        </main>

        <footer className="flex-shrink-0 py-2">
          <div className="flex justify-center gap-x-6">
            <Link href="https://linkedin.com/in/kkek" aria-label="LinkedIn Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="https://github.com/kkek-041405" aria-label="GitHub Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <Github className="h-6 w-6" />
            </Link>
            <Link href="mailto:komaleshwarakumarkonatham@gmail.com" aria-label="Email" className="text-zinc-500 hover:text-white transition-colors">
              <Mail className="h-6 w-6" />
            </Link>
            <Link href="https://play.google.com/store/apps/dev?id=6378119908597517835" aria-label="Google Play Developer Profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <ExternalLink className="h-6 w-6" />
            </Link>
          </div>
        </footer>
      </div>
      <ExpandedProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
