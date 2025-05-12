
import { PortfolioHeader } from "@/components/portfolio-header";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Zap, Brain, Users, Settings } from "lucide-react"; // Added more icons
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills - K. Komal Eshwara Kumar | Portfolio',
  description: 'Discover the technical skills and expertise of K. Komal Eshwara Kumar (KKEK) in frontend, backend, AI, and more.',
};

const skills = [
  {
    category: "Frontend Development",
    icon: Code2,
    items: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "ShadCN UI", "Responsive Design"],
  },
  {
    category: "Backend Development",
    icon: Settings,
    items: ["Node.js", "Express.js", "Python", "Django", "Flask", "Firebase (Firestore, Auth)", "REST APIs", "GraphQL"],
  },
  {
    category: "Databases",
    icon: Zap, // Placeholder, consider Database icon from Lucide if available or a generic one
    items: ["MongoDB", "PostgreSQL", "MySQL", "Firestore", "Redis"],
  },
  {
    category: "AI & Machine Learning",
    icon: Brain,
    items: ["Genkit", "TensorFlow", "PyTorch", "Scikit-learn", "Natural Language Processing", "Computer Vision", "Prompt Engineering"],
  },
  {
    category: "DevOps & Tools",
    icon: Settings, // Re-using, can be more specific
    items: ["Git & GitHub", "Docker", "Kubernetes (Basic)", "CI/CD (GitHub Actions)", "AWS (EC2, S3 - Basic)", "Google Cloud Platform (Basic)", "VS Code"],
  },
  {
    category: "Soft Skills & Methodologies",
    icon: Users,
    items: ["Problem Solving", "Team Collaboration", "Agile Methodologies", "Communication", "Project Management (Basic)", "Leadership"],
  },
];

export default function SkillsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1">
        <section id="skills" className="py-16 md:py-24 bg-secondary/10 dark:bg-secondary/5">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-16 flex items-center justify-center gap-3">
              <Code2 className="h-10 w-10 text-primary" /> Technical Proficiency
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skillCategory) => (
                <Card key={skillCategory.category} className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg">
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3 pt-5">
                    {skillCategory.icon && <skillCategory.icon className="h-7 w-7 text-primary" />}
                    <CardTitle className="text-xl text-foreground">{skillCategory.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5 pt-2">
                      {skillCategory.items.map(item => (
                        <li key={item} className="flex items-center text-muted-foreground">
                           <Zap size={16} className="mr-2.5 text-primary/70 shrink-0" />
                           <span>{item}</span>
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
