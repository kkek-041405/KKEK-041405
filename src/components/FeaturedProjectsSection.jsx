import projects from '../data/projects';
import ProjectCard from './ProjectCard';

export default function FeaturedProjectsSection() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop scroll-mt-24" id="projects">
      <div className="flex items-center gap-md mb-xl">
        <span className="material-symbols-outlined text-primary text-3xl">code_blocks</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Featured Projects</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
