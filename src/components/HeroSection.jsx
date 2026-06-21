import heroImage from '../assets/hero.png';

export default function HeroSection() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-12 gap-gutter items-center min-h-[70vh]">
      <div className="md:col-span-7 flex flex-col gap-lg z-10">
        <div className="inline-flex items-center gap-sm bg-surface-container-high px-md py-xs rounded-full border border-outline-variant w-fit mb-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-md text-label-md text-primary">System.out.println("Hello World");</span>
        </div>
        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          Building for the <br />
          <span className="text-primary-container">Android Ecosystem.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          A project-driven engineer with a deterministic mindset, crafting high-performance Android experiences through Kotlin and Jetpack Compose. Focusing on fluid architectures and hardware-level integrations.
        </p>
        <div className="flex flex-wrap gap-md mt-sm">
          <a
            className="inline-flex items-center justify-center bg-primary-container text-[#121212] font-label-md text-label-md rounded-full px-xl py-md hover:bg-primary transition-colors hover:shadow-[0_4px_20px_rgba(61,220,132,0.2)]"
            href="#projects"
          >
            View Projects
          </a>
          <a
            className="inline-flex items-center justify-center border border-primary text-primary font-label-md text-label-md rounded-full px-xl py-md hover:bg-primary/10 transition-colors"
            href="#contact"
          >
            Get in Touch
          </a>
        </div>
      </div>
      <div className="md:col-span-5 relative hidden md:block">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0" />
        <img
          alt="Hero Illustration"
          className="relative z-10 w-full h-auto object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
          src={heroImage}
        />
      </div>
    </section>
  );
}
