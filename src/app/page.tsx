
"use client";

import { Button } from "@/components/ui/button";
import { 
  Mail, Download, Github, Linkedin, ExternalLink, Code, Briefcase, GraduationCap
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";


// Data - I'll hardcode this for simplicity, based on previous prompts.
const projects = [
    {
        title: "Multiplayer Chess Application",
        description: "A real-time multiplayer chess app with game state validation and matchmaking, published on the Google Play Store.",
        stack: ["Kotlin", "Jetpack Compose", "Firebase"],
        github: "https://github.com/kkek-041405/chess",
        live: "https://play.google.com/store/apps/dev?id=6378119908597517835",
    },
    {
        title: "ZenControl",
        description: "An Android accessibility app to control a device with hardware buttons, solving a real-world hardware failure problem.",
        stack: ["Kotlin", "Android Accessibility Services"],
        github: "https://github.com/kkek-041405/ZenControl",
    },
    {
        title: "Campus Companion",
        description: "University collaboration platform with role-based auth, resource sharing, and structured discussion forums.",
        stack: ["React", "Firebase"],
        github: "https://github.com/kkek-041405/CampusCompanion",
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
  return (
    <main className="flex h-screen bg-black text-white p-6 md:p-8 gap-8">
      {/* Left Column */}
      <aside className="w-1/3 flex flex-col justify-between p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
        <div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-400">
              K.K. Eshwara kumar
            </h1>
            <p className="mt-2 text-lg text-zinc-400">
              A final-year CSE student and passionate Android Developer creating polished, production-ready mobile applications.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
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
        </div>
        
        {/* Social links at the bottom of the left column */}
        <div className="flex justify-start gap-x-6">
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
      </aside>

      {/* Right Column */}
      <section className="w-2/3 flex-1 bg-zinc-900/30 rounded-xl border border-zinc-800 p-6">
        <Tabs defaultValue="projects" className="h-full flex flex-col">
          <TabsList className="bg-zinc-900 border-zinc-800 border">
            <TabsTrigger value="projects"><Code className="mr-2"/>Projects</TabsTrigger>
            <TabsTrigger value="experience"><Briefcase className="mr-2"/>Experience</TabsTrigger>
            <TabsTrigger value="education"><GraduationCap className="mr-2"/>Education</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="projects" className="h-full space-y-4 pr-4">
              {projects.map(project => (
                <div key={project.title} className="p-4 rounded-lg border border-zinc-800 hover:border-blue-700/50 transition-colors">
                  <h3 className="font-semibold text-lg text-zinc-100">{project.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {project.stack.map(tech => <Badge key={tech} variant="secondary" className="bg-zinc-800 border-zinc-700 text-zinc-300">{tech}</Badge>)}
                    </div>
                    <div className="flex gap-2">
                      {project.github && <Button variant="ghost" size="sm" asChild><Link href={project.github} target="_blank"><Github className="mr-2"/>GitHub</Link></Button>}
                      {project.live && <Button variant="ghost" size="sm" asChild><Link href={project.live} target="_blank"><ExternalLink className="mr-2"/>Live</Link></Button>}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="experience" className="h-full pr-4">
               {experiences.map(exp => (
                <div key={exp.role} className="p-4 rounded-lg border border-zinc-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-zinc-100">{exp.role}</h3>
                    <p className="text-sm text-zinc-400">{exp.dates}</p>
                  </div>
                  <p className="text-zinc-300 font-medium">{exp.organization}</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400 text-sm">
                    {exp.details.map(detail => <li key={detail}>{detail}</li>)}
                  </ul>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="education" className="h-full space-y-4 pr-4">
              {education.map(edu => (
                <div key={edu.degree} className="p-4 rounded-lg border border-zinc-800">
                   <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-zinc-100">{edu.degree}</h3>
                    <p className="text-sm text-zinc-400">{edu.dates}</p>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <p className="font-medium">{edu.institution}</p>
                    <p className="font-mono text-sm">{edu.score}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </section>
    </main>
  );
}
