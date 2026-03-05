
'use client';

import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  initialClassName?: string;
  animateClassName?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: string;
  duration?: string;
  rootMargin?: string;
  as?: keyof JSX.IntrinsicElements;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  initialClassName = 'opacity-0 translate-y-8',
  animateClassName = 'opacity-100 translate-y-0',
  threshold = 0.1,
  triggerOnce = true,
  delay = 'delay-0',
  duration = 'duration-700',
  rootMargin = '0px',
  as: Element = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      ref={sectionRef as any}
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
