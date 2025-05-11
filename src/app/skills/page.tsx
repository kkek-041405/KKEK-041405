
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Zap } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills - Your Name | Portfolio',
  description: 'Discover the technical skills and expertise of Your Name in frontend, backend, AI, and more.',
};

const skills = [
  {
    category: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "ShadCN UI"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "Python", "Django", "Flask", "Firebase", "REST APIs", "GraphQL"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Firestore", "Redis"],
  },
  {
    category: "AI & Machine Learning",
    items: ["Genkit", "TensorFlow", "PyTorch", "Scikit-learn", "Natural Language Processing", "Computer Vision"],
  },
  {
    category: "DevOps & Tools",
    items: ["Git", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "AWS", "Google Cloud Platform"],
  },
  {
    category: "Soft Skills",
    items: ["Problem Solving", "Team Collaboration", "Communication", "Agile Methodologies", "Project Management"],
  },
];

export default function SkillsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1">
        <section id="skills" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-16 flex items-center justify-center gap-3">
              <Code2 className="h-10 w-10 text-primary" /> Technical Skills
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skillCategory) => (
                <Card key={skillCategory.category} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{skillCategory.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {skillCategory.items.map(item => (
                        <li key={item} className="flex items-center text-muted-foreground">
                           <Zap size={16} className="mr-2 text-primary/70 shrink-0" />
                           {item}
                        </li>))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
