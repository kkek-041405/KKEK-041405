
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Briefcase, Mail, UserCircle2, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'K. Komal Eshwara Kumar - Full-Stack Developer',
  description: 'Welcome to the portfolio of K. Komal Eshwara Kumar. Discover my projects, skills, and learn more about my journey in tech and AI.',
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />

      <main className="flex-1"> {/* Removed overflow-hidden to allow scrolling */}
        {/* Hero Section */}
        <section id="hero" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-6 md:gap-8">
              {/* Avatar and Name/Title Row */}
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary shadow-2xl">
                  <AvatarImage src="https://picsum.photos/seed/avatar/200" alt="KKEK" data-ai-hint="professional portrait" />
                  <AvatarFallback>KKEK</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-1 md:mb-2">
                    K.KOMAL ESHWARA KUMAR
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-primary font-semibold">
                    Full-Stack Developer | Creative Problem Solver
                  </p>
                </div>
              </div>

              {/* Description Paragraph */}
              <p className="text-md md:text-lg text-muted-foreground max-w-2xl text-center">
                Crafting innovative and intelligent digital experiences. Passionate about leveraging technology to build impactful solutions and exploring the frontiers of AI.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow">
                  <Link href="/projects">
                    <Briefcase className="mr-2 h-5 w-5" /> View My Work
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/50 transition-shadow">
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5" /> Get In Touch
                  </Link>
                </Button>
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
                  src="https://picsum.photos/seed/about/600/700"
                  alt="A professional working environment"
                  width={600}
                  height={700}
                  className="rounded-xl shadow-2xl object-cover aspect-[3/4]"
                  data-ai-hint="person working"
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
