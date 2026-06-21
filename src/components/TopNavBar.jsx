import { useEffect, useState } from 'react';
import avatar from '../assets/avatar.png'

const navItems = [
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Leadership', href: '#leadership' },
];

export default function TopNavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="top-nav"
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 border-b border-surface-container-low transition-all duration-300 ${
        scrolled ? 'shadow-lg bg-surface/95 backdrop-blur-sm' : 'bg-surface'
      }`}
    >
      <div className="flex items-center gap-md">
        <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
          DevPortfolio
        </span>
      </div>

      <div className="hidden md:flex items-center gap-xl h-full">
        {navItems.map((item) => (
          <a
            key={item.href}
            className="h-full flex items-center px-sm font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            href={item.href}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-md">
        <button
          type="button"
          aria-label="terminal action"
          className="text-on-surface-variant hover:text-primary transition-colors p-sm rounded-full bg-surface-container-low"
        >
          <span className="material-symbols-outlined">terminal</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
          <img
            alt="Developer Profile Avatar"
            className="w-full h-full object-cover"
            src={avatar}
          />
        </div>
      </div>
    </nav>
  );
}
