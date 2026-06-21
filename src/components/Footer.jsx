export default function Footer() {
  const links = [
    { label: 'GitHub', icon: 'code', href: '#' },
    { label: 'LinkedIn', icon: 'work', href: '#' },
    { label: 'Email', icon: 'mail', href: '#' },
  ];

  return (
    <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md bg-background border-t border-surface-container-lowest">
      <div className="flex items-center gap-sm">
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">android</span>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant">
          © 2024 Built with Jetpack Compose philosophy
        </p>
      </div>
      <nav className="flex items-center gap-lg">
        {links.map((link) => (
          <a
            key={link.label}
            className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors hover:scale-95 transition-transform flex items-center gap-xs"
            href={link.href}
          >
            <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
