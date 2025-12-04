
import React from 'react';
import { Github, Globe, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Resume() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-[210mm] p-8 shadow-lg print:shadow-none print:w-full print:max-w-none">
        
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-4 mb-4 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wide text-gray-900">K.K.Eshwara Kumar</h1>
          <div className="mt-2 text-sm text-gray-700 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> +91 76719 45929</span>
            <a href="mailto:komaleshwarakumarkonatham@gmail.com" className="flex items-center gap-1 hover:underline"><Mail className="h-4 w-4" /> komaleshwarakumarkonatham@gmail.com</a>
            <a href="https://github.com/kkek-041405" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline"><Github className="h-4 w-4"/>github.com/kkek-041405</a>
            <a href="https://kkek.vercel.app" target="_blank" className="flex items-center gap-1 hover:underline"><Globe className="h-4 w-4" /> kkek.vercel.app</a>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Summary</h2>
          <p className="text-gray-800 text-sm leading-relaxed">
            Software engineer interested in automation and user-independent system behavior. I focus on reliability, performance, and clean design over shortcuts. I enjoy breaking down complex problems and building systems that scale without constant user involvement. Seeking opportunities to contribute to product-driven engineering teams.
          </p>
        </section>

        {/* Projects */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Projects</h2>
          
          <div className="mb-3">
            <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    ZenControl – AI Agent for Headless Android
                    <a href="https://github.com/kkek-041405/ZenControl" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline font-normal flex items-center gap-1">| GitHub</a>
                </h3>
                <span className="text-xs italic text-gray-600">Kotlin, Hilt, Accessibility API</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
              <li>Built an automation layer that enables complete phone operation without a display (calls, navigation, media).</li>
              <li>Custom Accessibility Service for view traversal & gesture injection across OS versions.</li>
              <li>Modular AiTool architecture for scalable task execution.</li>
              <li>Result: Converts a standard Android phone into a fully usable display-less device.</li>
            </ul>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    Multiplayer Chess
                    <a href="https://play.google.com/store/apps/details?id=com.KKEK.chess" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline font-normal flex items-center gap-1">| Play Store</a>
                </h3>
              <span className="text-xs italic text-gray-600">Kotlin, Jetpack Compose, WebSockets, Stockfish</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
              <li>Real-time multiplayer sync with sub-120ms latency on mobile networks.</li>
              <li>Optimized Compose UI for uninterrupted gameplay during rapid state updates.</li>
              <li>Integrated adaptive Stockfish AI for offline mode.</li>
              <li>Result: Production-ready Android app demonstrating end-to-end product delivery.</li>
            </ul>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                Portfolio + NoteNest
                <a href="https://kkek.vercel.app" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline font-normal flex items-center gap-1">| Portfolio</a>
              </h3>
              <span className="text-xs italic text-gray-600">Next.js, TS, Firebase, Genkit</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                <li>Secure workspace with summaries and insights for display-less usage.</li>
                <li>Real-time sync and Firestore security rules for safe access.</li>
                <li>Purpose: Supports headless workflow by enabling information management without visual screen usage.</li>
            </ul>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Leadership & Experience</h2>
          <div className="mb-2">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>IUCEE Student Chapter</span>
              <span>Aug 2024 – Present</span>
            </div>
            <div className="flex justify-between text-sm italic text-gray-700 mb-1">
              <span>Technical Head</span>
              <span>VVIT</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>Orchestrated a 24-hour Inter-College Hackathon 300+ participants and multiple intra-college technical events, managing logistics and mentorship for student participants.</li>
              <li>Represented the institute at external summits and led workshops to foster technical excellence and cross-campus collaboration.</li>
            </ul>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Technical Skills</h2>
          <ul className="text-sm text-gray-800 space-y-1">
            <li><span className="font-bold">Languages:</span> Kotlin, TypeScript, JavaScript, Java, Python, SQL</li>
            <li><span className="font-bold">Android:</span> Jetpack Compose, Hilt, Accessibility Services, Room, Retrofit</li>
            <li><span className="font-bold">Web & Cloud:</span> React.js, Next.js, Firebase, WebSockets, Google Genkit</li>
            <li><span className="font-bold">Tools:</span> Git, GitHub, Android Studio, VS Code</li>
          </ul>
        </section>

        {/* Education */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
          <div className="mb-2">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Vasireddy Venkatadri Institute of Technology (VVIT)</span>
              <span>Nambur, India</span>
            </div>
            <div className="flex justify-between text-sm italic text-gray-700">
              <span>B.Tech, Computer Science and Engineering</span>
              <span>Graduation: 2026</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>M.B.T.S Govt. Polytechnic</span>
              <span>Guntur, India</span>
            </div>
            <div className="flex justify-between text-sm italic text-gray-700">
              <span>Diploma, Computer Engineering</span>
              <span>2020 – 2023</span>
            </div>
          </div>
        </section>

        {/* Coding Profiles */}
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Coding Profiles</h2>
          <p className="text-sm text-gray-800">
            <span className="font-bold">Platforms:</span> LeetCode · Codeforces – Regular participation in contests
          </p>
        </section>

      </div>
    </div>
  );
}
