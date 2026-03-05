
import React from 'react';
import { Github, Globe, Mail, Phone, ExternalLink, Feather } from 'lucide-react';
import Link from 'next/link';

export default function Resume() {
  return (
    <div className="min-h-screen bg-secondary/30 p-4 sm:p-8 flex justify-center print:p-0 print:bg-card">
      <div className="bg-card w-full max-w-[210mm] p-6 sm:p-8 shadow-lg print:shadow-none print:w-full print:max-w-none text-card-foreground">
        
        {/* Header */}
        <header className="border-b-2 border-foreground pb-4 mb-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">Komal Eshwara Kumar Konatham</h1>
          <div className="mt-2 text-xs sm:text-sm text-muted-foreground flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> Tenali, AP, India (Open to Relocation)</span>
            <a href="mailto:komaleshwarakumarkonatham@gmail.com" className="flex items-center gap-1.5 hover:text-primary"><Mail className="h-4 w-4" /> komaleshwarakumarkonatham@gmail.com</a>
            <a href="https://kkek.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary"><Globe className="h-4 w-4" /> kkek.me</a>
            <a href="https://github.com/kkek-041405/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary"><Github className="h-4 w-4" /> github.com/kkek-041405</a>
            <a href="https://linkedin.com/in/kkek" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary"><Globe className="h-4 w-4" /> linkedin.com/in/kkek</a>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-border mb-2 text-primary">Professional Overview</h2>
          <p className="text-foreground/90 text-sm leading-relaxed">
            Final-year Computer Science engineer specializing in Android development. Passionate about building production-ready mobile applications with a focus on real-time synchronization, scalable architecture, and intuitive user experiences. Actively seeking an Android development internship to contribute my skills to a product-driven team.
          </p>
        </section>

        {/* Technical Competencies */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-border mb-2 text-primary">Technical Competencies</h2>
          <div className="text-sm text-foreground/90 space-y-1">
            <p><strong className="font-semibold">Mobile Development:</strong> Android (Kotlin, Jetpack Compose) · Play Store deployment · Realtime multiplayer systems · Accessibility-based control systems</p>
            <p><strong className="font-semibold">Programming:</strong> Java · Kotlin · Python · JavaScript</p>
            <p><strong className="font-semibold">Web & Full Stack:</strong> React.js · Next.js · Firebase Authentication · Firestore / Realtime Database · REST-style architecture</p>
            <p><strong className="font-semibold">Tools & Workflow:</strong> Git · GitHub · Firebase Hosting · Vercel</p>
          </div>
        </section>

        {/* Selected Engineering Projects */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-border mb-2 text-primary">Selected Engineering Projects</h2>
          
          <div className="mb-3">
            <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-foreground flex items-center flex-wrap gap-x-2">
                    <span>Multiplayer Chess Application (Published on Play Store)</span>
                </h3>
                <span className="text-xs italic text-muted-foreground">Kotlin · Jetpack Compose · Firebase</span>
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Developed and deployed a real-time multiplayer chess application enabling synchronized gameplay across devices.</p>
            <ul className="list-disc list-inside text-sm text-foreground/90 mt-1 pl-2 space-y-0.5">
              <li>Implemented real-time move synchronization using Firebase Realtime Database.</li>
              <li>Designed game state validation logic to prevent illegal moves and built matchmaking for online players.</li>
              <li>Managed production deployment on Google Play Store. <Link href="https://play.google.com/store/apps/dev?id=6378119908597517835" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">[Live]</Link></li>
            </ul>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-foreground flex items-center flex-wrap gap-x-2">
                    <span>ZenControl – Hardware-Constraint Accessibility App</span>
                </h3>
              <span className="text-xs italic text-muted-foreground">Kotlin · Android Accessibility Services</span>
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Developed an Android application enabling device control using volume buttons when touch input is non-functional. Built to solve a real personal hardware failure problem.</p>
            <ul className="list-disc list-inside text-sm text-foreground/90 mt-1 pl-2 space-y-0.5">
              <li>Implemented background service for system-level interaction and used Accessibility APIs to trigger navigation commands.</li>
              <li>Designed lightweight event-based control logic with a focus on minimal resource consumption. <Link href="https://github.com/kkek-041405/ZenControl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">[GitHub]</Link></li>
            </ul>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-foreground flex items-center flex-wrap gap-x-2">
                <span>Campus Companion – University Collaboration Platform</span>
              </h3>
              <span className="text-xs italic text-muted-foreground">React · Firebase</span>
            </div>
            <p className="text-sm text-muted-foreground font-semibold">A web platform for university students to collaborate, share resources, and participate in structured discussions.</p>
            <ul className="list-disc list-inside text-sm text-foreground/90 mt-1 pl-2 space-y-0.5">
                <li>System design includes role-based authentication, public/private resource visibility model, and structured discussion forums.</li>
                <li>Firebase-backed storage and database integration with a modular React component architecture. <Link href="https://github.com/kkek-041405/CampusCompanion" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">[GitHub]</Link></li>
            </ul>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-border mb-2 text-primary">Leadership & Impact</h2>
          <div className="mb-2">
            <div className="flex justify-between font-semibold text-foreground">
              <span>Technical Head, VVISC (VVIT IUCEE Student Chapter)</span>
              <span className="text-sm">Aug 2024 – Present</span>
            </div>
            <ul className="list-disc list-inside text-sm text-foreground/90 pl-2">
              <li>Orchestrated a 24-hour inter-college hackathon with 300+ participants and organized multiple intra-college events.</li>
              <li>Represented chapter at inter-college hackathons, winning a Special Mention at Ideathon, Malnad College of Engineering.</li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-border mb-2 text-primary">Education</h2>
          <div className="mb-2">
            <div className="flex justify-between font-semibold text-foreground">
              <span>B.Tech, Computer Science & Engineering</span>
              <span className="text-sm">2023 – 2026</span>
            </div>
            <div className="flex justify-between text-sm italic text-muted-foreground">
              <span>Vasireddy Venkatadri Institute of Technology (VVIT), Guntur</span>
              <span>CGPA: 6.86</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-semibold text-foreground">
              <span>Diploma, Computer Engineering</span>
               <span className="text-sm">2020 – 2023</span>
            </div>
            <div className="flex justify-between text-sm italic text-muted-foreground">
              <span>M.B.T.S Government Polytechnic, Nallapadu</span>
              <span>75%</span>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-border mb-2 text-primary">Certifications</h2>
          <ul className="list-disc list-inside text-sm text-foreground/90 pl-2">
            <li>Google Android Developer Certification (EduSkills – Kotlin & Jetpack Compose)</li>
            <li>Java Full Stack Developer Certification (EduSkills)</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
