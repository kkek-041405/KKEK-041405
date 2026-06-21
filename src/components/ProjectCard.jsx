export default function ProjectCard({ title, icon, description, tags }) {
  return (
    <div className="bg-surface rounded-lg p-lg flex flex-col gap-md border-t border-outline-variant hover:bg-surface-container-low transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.4)] group relative overflow-hidden">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h3 className="font-title-lg text-title-lg text-on-surface">{title}</h3>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant flex-grow">{description}</p>
      <div className="flex flex-wrap gap-sm mt-auto mb-md">
        {tags.map((tag) => (
          <span key={tag} className="bg-[#2A2A2A] text-secondary font-label-md text-label-md px-sm py-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
