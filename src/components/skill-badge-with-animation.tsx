
'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SkillBadgeWithAnimationProps {
  name: string;
  skillIcon: LucideIcon;
  proficiency: number;
  isVisible: boolean; // Prop to trigger animation when section is visible
}

const SkillBadgeWithAnimation: React.FC<SkillBadgeWithAnimationProps> = ({ name, skillIcon: SkillIcon, proficiency, isVisible }) => {
  const [animatedProficiency, setAnimatedProficiency] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const hasPlayedInitialAnimation = useRef(false);

  useEffect(() => {
    const animate = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setAnimatedProficiency(0); // Reset before starting animation

      let startTimestamp: number | null = null;
      const animationDuration = 1000; // Animation duration in ms

      const animateStep = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = timestamp - startTimestamp;
        const percentageComplete = Math.min(progress / animationDuration, 1);
        
        setAnimatedProficiency(Math.floor(percentageComplete * proficiency));

        if (progress < animationDuration) {
          animationFrameId.current = requestAnimationFrame(animateStep);
        }
      };
      animationFrameId.current = requestAnimationFrame(animateStep);
    };

    if (isVisible) {
      if (isHovered) {
        animate(); // Animate on hover
      } else if (!hasPlayedInitialAnimation.current) {
        animate(); // Animate on first becoming visible
        hasPlayedInitialAnimation.current = true;
      } else {
        // Visible, not hovered, and initial animation has played. Reset to 0 if not hovered.
        if (!isHovered && animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          setAnimatedProficiency(0);
        }
      }
    } else {
      // Not visible, reset everything
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setAnimatedProficiency(0);
      hasPlayedInitialAnimation.current = false; // Reset for next time it becomes visible
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisible, isHovered, proficiency]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="bg-card border border-border rounded-xl p-3 shadow-lg flex flex-col items-center justify-center gap-2 w-32 h-32 text-center hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="w-10 h-10 p-1 rounded-lg flex items-center justify-center"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${animatedProficiency}%, hsl(var(--secondary)) ${animatedProficiency}% 100%)`,
                transition: 'background 0.1s linear', 
              }}
            >
              <div className="w-full h-full bg-card rounded-md flex items-center justify-center">
                <SkillIcon size={24} className="text-primary" />
              </div>
            </div>
            <span className="font-medium text-xs text-foreground mt-1">{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name} ({proficiency}%)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SkillBadgeWithAnimation;
