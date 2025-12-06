
"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/animated-section';
import storiesData from './stories.json';
import { cn } from '@/lib/utils';

interface StorySection {
  title: string;
  content: string;
}

interface Story {
  id: string;
  projectId: string;
  title: string;
  tagline: string;
  reason: string;
  sections: StorySection[];
  tags: string[];
  date: string;
}

const SimpleMarkdownParser = ({ content }: { content: string }) => {
    // Split by newlines to process line-by-line for block elements
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    let currentBlock: string[] | null = null;
    let inCodeBlock = false;

    lines.forEach((line, lineIndex) => {
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                // End of code block
                elements.push(
                    <pre key={`code-${elements.length}`} className="bg-zinc-800/50 border border-zinc-700 rounded-md p-4 my-4 whitespace-pre-wrap">
                        <code>{currentBlock?.join('\n')}</code>
                    </pre>
                );
                currentBlock = null;
                inCodeBlock = false;
            } else {
                // Start of code block
                inCodeBlock = true;
                currentBlock = [];
            }
            return;
        }

        if (inCodeBlock) {
            currentBlock?.push(line);
            return;
        }

        if (line.startsWith('>')) {
            elements.push(
                <blockquote key={`quote-${lineIndex}`} className="border-l-4 border-zinc-600 pl-4 italic text-zinc-400 my-4">
                    {line.slice(1).trim()}
                </blockquote>
            );
            return;
        }
        
        // Handle inline markdown within paragraphs
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

        elements.push(
            <React.Fragment key={`line-${lineIndex}`}>
                {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index} className="text-white">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith('*') && part.endsWith('*')) {
                        return <em key={index}>{part.slice(1, -1)}</em>;
                    }
                     if (part.startsWith('`') && part.endsWith('`')) {
                        return <code key={index} className="bg-zinc-800/60 text-zinc-300 rounded-sm px-1.5 py-0.5 font-mono text-sm">{part.slice(1, -1)}</code>;
                    }
                    return <React.Fragment key={index}>{part}</React.Fragment>;
                })}
                {lineIndex < lines.length -1 && <br />}
            </React.Fragment>
        );
    });

    // Handle unterminated code block at the end of content
    if (inCodeBlock && currentBlock) {
        elements.push(
            <pre key="code-final" className="bg-zinc-800/50 border border-zinc-700 rounded-md p-4 my-4 whitespace-pre-wrap">
                <code>{currentBlock.join('\n')}</code>
            </pre>
        );
    }
    
    // Group consecutive <br> and text fragments into paragraphs
    const finalElements: React.ReactNode[] = [];
    let pBuffer: React.ReactNode[] = [];

    elements.forEach((el, index) => {
        if (typeof el === 'object' && el !== null && 'type' in el && (el.type === 'blockquote' || el.type === 'pre')) {
            if (pBuffer.length > 0) {
                finalElements.push(<p key={`p-${finalElements.length}`}>{pBuffer}</p>);
                pBuffer = [];
            }
            finalElements.push(el);
        } else {
            pBuffer.push(el);
        }
    });

    if (pBuffer.length > 0) {
        finalElements.push(<p key={`p-final`}>{pBuffer}</p>);
    }


    return <>{finalElements}</>;
};



// Reusable Hero Component
const StoryHero = ({ 
  projectName, 
  projectReason, 
  onExploreClick,
  onBackClick
}: { 
  projectName: string, 
  projectReason: string, 
  onExploreClick: () => void,
  onBackClick: () => void
}) => {
  const [typedProjectName, setTypedProjectName] = useState('');
  const [showWhy, setShowWhy] = useState(false);
  const [startTypingName, setStartTypingName] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [showExploreButton, setShowExploreButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [isArrowAnimating, setIsArrowAnimating] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setShowWhy(true), 500));
    timers.push(setTimeout(() => setStartTypingName(true), 1200));
    
    return () => timers.forEach(clearTimeout);
  }, []);
  
  useEffect(() => {
    if (startTypingName && projectName) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < projectName.length) {
          setTypedProjectName(projectName.substring(0, i + 1));
          i++;
        } else {
          clearInterval(intervalId);
          setTimeout(() => setShowReason(true), 400); 
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [startTypingName, projectName]);
  
  useEffect(() => {
    if(showReason) {
       setTimeout(() => setShowExploreButton(true), 500);
    }
  }, [showReason]);

  useEffect(() => {
    if (showExploreButton) {
      setTimeout(() => setShowBackButton(true), 500);
      setTimeout(() => setIsArrowAnimating(true), 1500);
    }
  }, [showExploreButton]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6 relative">
       <Button 
        variant="outline" 
        onClick={onBackClick} 
        className={cn(
          "absolute top-6 left-6 z-10 bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white transition-opacity duration-700",
          showBackButton ? "opacity-100" : "opacity-0"
        )}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
      </Button>
      <div className="flex flex-col items-center gap-4">
        <p 
          className={cn(
            "font-mono text-xl md:text-2xl font-bold text-zinc-100 transition-opacity duration-700",
            showWhy ? "opacity-100" : "opacity-0"
          )}
        >
          why i built
        </p>
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl font-semibold text-zinc-100 min-h-[1.2em]"
        >
          {typedProjectName}
        </h1>
        <p 
          className={cn(
            "text-base md:text-lg text-zinc-500 lowercase max-w-md transition-opacity duration-700",
            showReason ? "opacity-100" : "opacity-0"
            )}
        >
          {projectReason}
        </p>
        <div 
          className={cn("mt-6 transition-opacity duration-700", showExploreButton ? "opacity-100" : "opacity-0")}
        >
          <Button 
            onClick={onExploreClick} 
            variant="outline" 
            className="rounded-full px-5 py-3 text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Read the Story
            <ArrowDown className={cn("ml-2 h-4 w-4 transition-transform", isArrowAnimating && "animate-bounce-once")} />
          </Button>
        </div>
      </div>
       <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }
        .animate-bounce-once {
          animation: bounce-once 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};


function WhyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('project');
  const storyContentRef = useRef<HTMLDivElement>(null);
  const [isStoryVisible, setIsStoryVisible] = useState(false);

  const handleExploreClick = () => {
    setIsStoryVisible(true);
  };
  
  useEffect(() => {
    if (isStoryVisible && storyContentRef.current) {
        setTimeout(() => {
            storyContentRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [isStoryVisible]);

  const stories: Story[] = storiesData.map(story => ({...story, id: story.projectId}));
  let selectedStory: Story | null = null;
  let notFound = false;

  if (projectId) {
    selectedStory = stories.find(s => s.projectId === projectId) || null;
    if (!selectedStory) {
      notFound = true;
    }
  }

  if (projectId) {
    if (notFound) {
      return (
        <AnimatedSection as="div" className="flex-1 text-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Story Not Found</h2>
          <p className="text-muted-foreground mb-6">The story for project "{projectId}" could not be found.</p>
          <Button onClick={() => router.push('/stories/why')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Stories
          </Button>
        </AnimatedSection>
      );
    }

    if (!selectedStory) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <StoryHero 
              projectName={selectedStory.title}
              projectReason={selectedStory.reason}
              onExploreClick={handleExploreClick}
              onBackClick={() => router.push('/stories/why')}
            />
            
            {isStoryVisible && (
              <article ref={storyContentRef} className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
                  <AnimatedSection as="header" triggerOnce={true} className="mb-8 border-b border-zinc-700 pb-6 text-center">
                      <p className="text-zinc-400 text-lg">Published on {new Date(selectedStory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                          {selectedStory.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">{tag}</Badge>
                          ))}
                      </div>
                  </AnimatedSection>
                  <div className="prose dark:prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed space-y-6">
                      {selectedStory.sections.map((section, index) => (
                          <AnimatedSection as="div" triggerOnce={true} key={index} className="space-y-4" delay={`delay-${index * 100}`}>
                              <h3 className="text-2xl font-semibold text-white !mb-3">{section.title}</h3>
                              <div className="!mt-0">
                                  <SimpleMarkdownParser content={section.content} />
                              </div>
                          </AnimatedSection>
                      ))}
                  </div>
              </article>
            )}
        </div>
    );
  }

  return (
    <AnimatedSection as="div" className="py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Project Stories</h1>
        <p className="text-lg text-muted-foreground mt-2">The "why" behind the code.</p>
      </div>
      {stories.length === 0 ? (
        <p className="text-center text-muted-foreground">No stories have been published yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map(story => (
            <Link key={story.id} href={`/stories/why?project=${story.projectId}`} legacyBehavior>
              <a className="block h-full">
                <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{story.title}</CardTitle>
                    <CardDescription>{new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-zinc-400 line-clamp-3">
                      {story.tagline}
                    </p>
                  </CardContent>
                   <div className="p-6 pt-0">
                      <div className="flex flex-wrap gap-2">
                         {story.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="border-zinc-700 text-zinc-300">{tag}</Badge>)}
                      </div>
                  </div>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      )}
    </AnimatedSection>
  );
}

export default function WhyPage() {
    return (
        <div className="dark bg-black text-white flex flex-col min-h-screen">
            <main className="flex-1 container mx-auto px-4">
                <Suspense fallback={
                    <div className="flex-1 flex items-center justify-center h-screen">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                }>
                    <WhyPageContent />
                </Suspense>
            </main>
        </div>
    );
}
