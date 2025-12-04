
import React from 'react';
import { Github, Globe, Mail, Phone } from 'lucide-react';

export default function Resume() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-[210mm] p-8 shadow-lg print:shadow-none print:w-full print:max-w-none">
        
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-4 mb-4 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide text-gray-900">K.K.Eshwara kumar</h1>
          <div className="mt-2 text-sm text-gray-700 flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> Guntur, Andhra Pradesh</span>
            <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> +91 76719 45929</span>
            <a href="mailto:komaleshwarakumarkonatham@gmail.com" className="flex items-center gap-1 hover:underline"><Mail className="h-4 w-4" /> komaleshwarakumarkonatham@gmail.com</a>
          </div>
          <div className="mt-1 text-sm text-blue-700 font-semibold flex flex-wrap justify-center gap-6">
            <a href="https://github.com/kkek-041405" target="_blank" className="flex items-center gap-1 hover:underline"><Github className="h-4 w-4" /> github.com/kkek-041405</a>
            <a href="https://kkek.vercel.app" target="_blank" className="flex items-center gap-1 hover:underline"><Globe className="h-4 w-4" /> kkek.vercel.app</a>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Professional Summary</h2>
          <p className="text-gray-800 text-sm leading-relaxed">
            I thrive on solving tough problems and exploring new ideas, and I’m looking for a role where I can apply this mindset to build innovative solutions. I bring a resourceful, "figure-it-out" approach to engineering, with a focus on diagnosing root causes—whether in hardware constraints or system architectures—and developing efficient, scalable software to fix them.
          </p>
        </section>

        {/* Education */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
          <div className="mb-2">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Vasireddy Venkatadri Institute of Technology (VVIT)</span>
              <span>Expected 2026</span>
            </div>
            <div className="flex justify-between text-sm italic text-gray-700">
              <span>B.Tech in Computer Science and Engineering</span>
              <span>CGPA: 6.76 (upto 6th Sem)</span>
            </div>
            <p className="text-xs text-gray-600 mt-1"><span className="font-semibold">Relevant Coursework:</span> Data Structures & Algorithms, Operating Systems, DBMS, OOP, Computer Networks.</p>
          </div>
          <div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>M.B.T.S Govt. Polytechnic</span>
              <span>2020 – 2023</span>
            </div>
            <div className="flex justify-between text-sm italic text-gray-700">
              <span>Diploma in Computer Engineering</span>
              <span>Percentage: 76%</span>
            </div>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Technical Skills</h2>
          <ul className="text-sm text-gray-800 space-y-1">
            <li><span className="font-bold">Languages:</span> Kotlin, TypeScript, JavaScript, Java, Python, SQL.</li>
            <li><span className="font-bold">Android:</span> Jetpack Compose, Hilt (DI), Accessibility Services, Room DB, Retrofit.</li>
            <li><span className="font-bold">Web & Cloud:</span> React.js, Next.js, Firebase (Realtime DB, Firestore, Auth), WebSockets, Google Genkit.</li>
            <li><span className="font-bold">Tools:</span> Git, GitHub, Android Studio, VS Code.</li>
          </ul>
        </section>

        {/* Projects */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Projects</h2>
          
          <div className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">ZenControl (Headless Automation Framework)</h3>
              <span className="text-xs italic text-gray-600">Kotlin, Hilt, Accessibility API</span>
            </div>
            <a href="https://github.com/kkek-041405/ZenControl" className="text-xs text-blue-700 hover:underline mb-1 block">github.com/kkek-041405/ZenControl</a>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Architected a modular <strong>Agent Framework</strong> capable of executing complex device tasks (Calls, Media, Navigation) without human intervention.</li>
              <li>Engineered a scalable <code>AiTool</code> system using <strong>Clean Architecture</strong> and <strong>Hilt</strong>, enabling the device to function via remote commands.</li>
              <li>Built a custom <strong>Accessibility Service</strong> to scrape screen context and inject gestures, turning a standard phone into a programmable headless device.</li>
            </ul>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">Multiplayer Chess Application</h3>
              <span className="text-xs italic text-gray-600">Kotlin, Jetpack Compose, WebSockets</span>
            </div>
            <a href="https://play.google.com/store/apps/details?id=com.KKEK.chess" className="text-xs text-blue-700 hover:underline mb-1 block">Live on Play Store</a>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Designed and published a feature-rich Chess app using <strong>Jetpack Compose</strong>, prioritizing performance and modern UI.</li>
              <li>Engineered a low-latency multiplayer backend using <strong>WebSockets</strong> for bidirectional, real-time move synchronization.</li>
              <li>Integrated the <strong>Stockfish Chess Engine</strong> to power intelligent AI bots for offline practice.</li>
            </ul>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">NoteNest & Portfolio</h3>
              <span className="text-xs italic text-gray-600">Next.js, TypeScript, Google Genkit</span>
            </div>
            <a href="https://kkek.vercel.app" className="text-xs text-blue-700 hover:underline mb-1 block">kkek.vercel.app</a>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Developed a secure personal workspace using <strong>Next.js</strong> and <strong>TypeScript</strong> with a password-protected notes module.</li>
              <li>Integrated <strong>Google Genkit</strong> to provide AI-powered summarization and insights for stored notes.</li>
              <li>Utilized <strong>Firebase Firestore</strong> for secure, real-time data persistence and authentication.</li>
            </ul>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Leadership & Experience</h2>
          <div className="mb-2">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>IUCEE Student Chapter - Technical Head</span>
              <span>Aug 2024 – Present</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
              <li>Orchestrated a <strong>24-hour Inter-College Hackathon</strong> and multiple intra-college technical events, managing logistics and mentorship.</li>
              <li>Represented the institute at external summits and led workshops to foster technical excellence.</li>
            </ul>
          </div>
        </section>

        {/* Coding Profiles */}
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Coding Profiles</h2>
          <p className="text-sm text-gray-800">
            <span className="font-bold">Platforms:</span> Active Problem Solver on <strong>LeetCode</strong> & <strong>Codeforces</strong> (Consistent participation in contests).
          </p>
        </section>

      </div>
    </div>
  );
}
