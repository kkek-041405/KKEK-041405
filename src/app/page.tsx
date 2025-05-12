
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Briefcase, Mail, UserCircle2, Download, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'K. Komal Eshwara Kumar — Full-Stack Developer & AI Enthusiast',
  description: 'Welcome to the portfolio of K. Komal Eshwara Kumar (KKEK). 3rd Year CSE, GATE Aspirant, Technical Head @ IUCEE VVIT. Discover projects and skills in React, Firebase, and AI.',
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="w-full py-20 md:py-28 lg:py-32 xl:py-36 bg-gradient-to-br from-background to-secondary/10 dark:from-background dark:to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
              {/* Text Content: Headline, Subtitle, CTAs */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-primary shadow-xl mb-2">
                  <AvatarImage src="https://picsum.photos/seed/avatar-kkek/200" alt="KKEK" data-ai-hint="professional portrait" />
                  <AvatarFallback>KKEK</AvatarFallback>
                </Avatar>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
                  Hi, I’m KKEK — <br className="block sm:hidden" />Crafting Scalable Apps <br className="hidden sm:block lg:hidden" />with React & Firebase.
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-primary font-medium">
                  3rd Year CSE | GATE Aspirant | Technical Head @ IUCEE VVIT
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                  <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow w-full sm:w-auto">
                    <Link href="/projects">
                      <Briefcase className="mr-2 h-5 w-5" /> View Projects
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/50 transition-shadow w-full sm:w-auto">
                    <Link href="/resume.pdf" target="_blank" download>
                      <Download className="mr-2 h-5 w-5" /> Download Resume
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Hero Image/Illustration */}
              <div className="hidden lg:flex justify-center items-center p-4">
                <Image
                  src="https://picsum.photos/seed/hero-visual/700/650" 
                  alt="Abstract representation of technology and innovation"
                  width={700}
                  height={650}
                  className="rounded-xl shadow-2xl object-cover aspect-[10/9]"
                  data-ai-hint="technology abstract" 
                  priority 
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-16 md:py-24 bg-secondary/20 dark:bg-secondary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 flex items-center justify-center gap-3">
              <UserCircle2 className="h-10 w-10 text-primary" /> About Me
            </h2>
            <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-center">
              <div className="md:col-span-2">
                <Image
                  src="https://picsum.photos/seed/about-me-kkek/600/700"
                  alt="K. Komal Eshwara Kumar working on a project"
                  width={600}
                  height={700}
                  className="rounded-xl shadow-2xl object-cover aspect-[6/7]"
                  data-ai-hint="person coding"
                />
              </div>
              <div className="md:col-span-3 text-lg space-y-6 text-muted-foreground">
                <p>
                Hello! I'm K. Komal Eshwara Kumar, a dedicated and results-driven software developer with a solid foundation in modern web technologies and a strong interest in artificial intelligence. My journey in tech began with a deep curiosity about how software can solve real-world problems and elevate user experiences—and I’ve been building solutions ever since.
                </p>
                <p>
                I specialize in developing scalable web applications using React.js, Firebase, Node.js, and modern frontend-backend ecosystems. One of my key projects is Campus Companion, a collaborative learning platform for university students, which I designed and deployed with AI-powered document search and structured discussion forums, currently serving an active student community.
                </p>
                <p>
                As the Technical Head of the IUCEE Student Chapter at Vasireddy Venkatadri Institute of Technology, I lead technical initiatives that bridge academic concepts with practical applications. Under my leadership, we've conducted workshops, hackathons, and collaborative projects impacting over 200 students and fostering an innovation-driven culture on campus.
                </p>
                <p>
                Continuous learning is the cornerstone of my professional growth — I actively expand my skill set to stay aligned with cutting-edge technologies and industry demands. I aspire to develop AI-driven products that scale globally and solve real-world challenges in education and collaboration, while taking on leadership roles in transformative tech projects.
                </p>
                 <Button variant="link" asChild className="text-primary p-0 h-auto text-lg hover:underline">
                   <Link href="/resume.pdf" target="_blank" download>
                     Download My CV <Download className="ml-2 h-5 w-5" />
                    </Link>
                 </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </div>
  );
}
