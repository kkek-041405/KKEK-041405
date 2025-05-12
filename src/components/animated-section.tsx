
'use client';

import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  initialClassName?: string; // Renamed from initialClass to avoid conflict with React's className
  animateClassName?: string; // Renamed from animateClass
  threshold?: number;
  triggerOnce?: boolean;
  delay?: string; // e.g., 'delay-100', 'delay-200' (Tailwind classes)
  duration?: string; // e.g., 'duration-500', 'duration-700' (Tailwind classes)
  rootMargin?: string;
  as?: keyof JSX.IntrinsicElements; // Allow specifying the element type
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  initialClassName = 'opacity-0 translate-y-8',
  animateClassName = 'opacity-100 translate-y-0',
  threshold = 0.1,
  triggerOnce = true,
  delay = 'delay-0', // Default to no delay
  duration = 'duration-700', // Default duration
  rootMargin = '0px',
  as: Element = 'div', // Default to 'div'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null); // Keep as HTMLDivElement for simplicity, specific element type via 'as' prop

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        } else {
          if (!triggerOnce) {
            setIsVisible(false);
          }
        }
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: threshold,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, triggerOnce, rootMargin]);

  return (
    <Element
      ref={sectionRef as any} // Cast to any because ref type depends on Element type
      className={cn(
        'transition-all ease-out',
        duration,
        delay,
        isVisible ? animateClassName : initialClassName,
        className
      )}
    >
      {children}
    </Element>
  );
};

export default AnimatedSection;
