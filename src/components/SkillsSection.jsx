import skills from '../data/skills';

export default function SkillsSection() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop scroll-mt-24" id="skills">
      <div className="bg-[#000000] rounded-lg p-xl border-l-4 border-primary shadow-[0_4px_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-md opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-9xl text-primary">memory</span>
        </div>
        <h2 className="font-label-md text-label-md text-on-surface-variant mb-xl tracking-widest uppercase">
          /* Technical Skill Matrix */
        </h2>
        <div className="grid md:grid-cols-3 gap-xl relative z-10">
          {skills.map((category) => (
            <div key={category.title} className="flex flex-col gap-md">
              <h3 className="font-body-lg text-body-lg text-on-surface border-b border-surface-variant pb-xs">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-sm">
                {category.items.map((item) => (
                  <span key={item} className="bg-[#2A2A2A] text-secondary font-label-md text-label-md px-md py-xs rounded-full flex items-center gap-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
