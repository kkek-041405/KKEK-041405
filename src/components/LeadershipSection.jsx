import leadership from '../data/leadership';

export default function LeadershipSection() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop scroll-mt-24 mb-xl" id="leadership">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xl">Leadership & Distinctions</h2>
      <div className="relative border-l border-outline-variant ml-sm md:ml-lg flex flex-col gap-xl">
        {leadership.map((item) => (
          <div key={item.title} className="relative pl-xl">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-surface border-2 border-primary rounded-full" />
            <div className="bg-surface rounded-lg p-lg border border-surface-container-highest hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-tertiary">{item.icon}</span>
                <h3 className="font-title-lg text-title-lg text-on-surface">{item.title}</h3>
              </div>
              <p className="font-label-md text-label-md text-primary mb-md">{item.subtitle}</p>
              <p className="font-body-md text-body-md text-on-surface-variant">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
