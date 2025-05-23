
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
    const animateToFullProficiency = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setAnimatedProficiency(0); // Reset before starting animation for a consistent effect

      let startTimestamp: number | null = null;
      const animationDuration = 1000; // Animation duration in ms

      const animateStep = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = timestamp - startTimestamp;
        const percentageComplete = Math.min(progress / animationDuration, 1);
        
        setAnimatedProficiency(Math.floor(percentageComplete * proficiency));

        if (progress < animationDuration) {
          animationFrameId.current = requestAnimationFrame(animateStep);
        } else {
          setAnimatedProficiency(proficiency); // Ensure it ends exactly at target
        }
      };
      animationFrameId.current = requestAnimationFrame(animateStep);
    };

    if (isVisible) {
      if (isHovered) {
        // Hovering and visible: always animate to full proficiency
        animateToFullProficiency();
      } else {
        // Not hovering, but visible
        if (!hasPlayedInitialAnimation.current) {
          // First time section is visible (or visible again after scrolling out): animate
          animateToFullProficiency();
          hasPlayedInitialAnimation.current = true;
        } else {
          // Visible, not first time, and not hovered:
          // Ensure it's at full proficiency. This handles cases where a hover animation might have been interrupted
          // or to maintain the state after the initial scroll-in animation.
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
          }
          setAnimatedProficiency(proficiency);
        }
      }
    } else { // Not visible
      // Reset everything when not visible
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setAnimatedProficiency(0);
      hasPlayedInitialAnimation.current = false; // Allow re-animation when it becomes visible again
    }

    // Cleanup function to cancel animation frame if component unmounts or dependencies change
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
            className="bg-card border border-border rounded-xl p-3 shadow-lg flex flex-col items-center justify-center gap-2 w-28 h-28 sm:w-32 sm:h-32 text-center hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 p-1 rounded-lg flex items-center justify-center"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${animatedProficiency}%, hsl(var(--secondary)) ${animatedProficiency}% 100%)`,
                transition: 'background 0.1s linear', 
              }}
            >
              <div className="w-full h-full bg-card rounded-md flex items-center justify-center">
                <SkillIcon className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
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
