
"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowDown, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/animated-section';
import storiesData from './stories.json';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StorySection {
  title: string;
  content: string;
}

interface Story {
  id: string;
  projectId: string;
  title: string;
  tagline: string;
  trigger: string;
  reason: string;
  sections: StorySection[];
  tags: string[];
  date: string;
  githubLink?: string;
}

const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, index) => {
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
    });
};

const SimpleMarkdownParser = ({ content }: { content: string }) => {
    const regex = /(```[\s\S]*?```|>[^\n]+(?:\n[^\n]+)*)/g;
    let lastIndex = 0;
    const parts = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(match[0]);
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }


    let keyCounter = 0;

    return (
        <>
            {parts.map((part) => {
                if (!part) return null;
                
                if (part.trim() === '[Screenshots / demo carousel here]') {
                  return (
                     <div key={`demo-${keyCounter++}`} className="text-center my-8 p-8 border border-dashed border-zinc-700 rounded-lg">
                        <p className="text-zinc-500 italic">{part.trim()}</p>
                    </div>
                  )
                }

                if (part.startsWith('```')) {
                    const codeBlockContent = part.replace(/^```\s*|```\s*$/g, '').trim();
                     return (
                        <pre key={`code-${keyCounter++}`} className="bg-zinc-800/50 border border-zinc-700 rounded-md p-4 my-4 whitespace-pre-wrap">
                            <code>{codeBlockContent}</code>
                        </pre>
                    );
                }

                if (part.startsWith('>')) {
                    const quoteContent = part.split('\n').map(line => line.replace(/^>\s?/, '')).join('\n');
                     if(part.includes('Pull-Quote')){
                        return (
                           <blockquote key={`quote-${keyCounter++}`} className="text-center text-2xl leading-relaxed my-12 text-zinc-300">
                             <p>{renderInlineMarkdown(quoteContent.replace('Pull-Quote: ', ''))}</p>
                           </blockquote>
                        )
                    }
                    return (
                        <blockquote key={`quote-${keyCounter++}`} className="border-l-4 border-primary pl-4 italic text-zinc-300 my-4">
                            <p>{renderInlineMarkdown(quoteContent)}</p>
                        </blockquote>
                    );
                }
                
                const paragraphs = part.split('\n\n').filter(p => p.trim() !== '');
                return paragraphs.map((para) => {
                    if (para.split('\n').every(line => line.trim().startsWith('- '))) {
                        return (
                             <ul key={`list-${keyCounter++}`} className="list-disc pl-6 space-y-2 my-4">
                                {para.split('\n').map((line, lineIndex) => (
                                    <li key={lineIndex}>{renderInlineMarkdown(line.trim().slice(2))}</li>
                                ))}
                            </ul>
                        )
                    }
                     const paraLines = para.split('\n');
                      return (
                        <p key={`p-${keyCounter++}`} className="text-zinc-300">
                           {paraLines.map((line, lineIdx) => (
                             <React.Fragment key={lineIdx}>
                               {renderInlineMarkdown(line)}
                               {lineIdx < paraLines.length - 1 && <br />}
                             </React.Fragment>
                           ))}
                        </p>
                      );
                });
            })}
        </>
    );
};


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
  const [startTypingName, setStartTypingName] = useState(false);
  const [showSubheadline, setShowSubheadline] = useState(false);
  const [showExploreButton, setShowExploreButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [isArrowAnimating, setIsArrowAnimating] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const router = useRouter();

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
          setTimeout(() => setShowSubheadline(true), 400); 
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [startTypingName, projectName]);
  
  useEffect(() => {
    if(showSubheadline) {
       setTimeout(() => setShowExploreButton(true), 500);
    }
  }, [showSubheadline]);

  useEffect(() => {
    if (showExploreButton) {
      setTimeout(() => setShowBackButton(true), 500);
      setTimeout(() => setIsArrowAnimating(true), 1500);
    }
  }, [showExploreButton]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6 relative bg-black">
       <div className={cn(
          "absolute top-6 left-6 z-10 flex gap-2 transition-opacity duration-700",
          showBackButton ? "opacity-100" : "opacity-0"
        )}>
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => router.push('/')}
                        className="bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white"
                        aria-label="Home"
                    >
                        <Home className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>Homepage</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <Button 
          variant="outline" 
          onClick={onBackClick} 
          className="bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
        </Button>
      </div>

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
            showSubheadline ? "opacity-100" : "opacity-0"
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
            The journey from problem → innovation
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
    setTimeout(() => {
        storyContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
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
        <div className="flex-1 text-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Story Not Found</h2>
          <p className="text-muted-foreground mb-6">The story for project "{projectId}" could not be found.</p>
          <Button onClick={() => router.push('/stories/why')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Stories
          </Button>
        </div>
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
                  <header className="mb-8 border-b border-zinc-700 pb-6 text-center">
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {selectedStory.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">{tag}</Badge>
                          ))}
                      </div>
                      <p className="text-zinc-400 text-lg">Published on {new Date(selectedStory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </header>
                  <div className="prose dark:prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed space-y-6">
                      {selectedStory.sections.map((section, index) => (
                            <AnimatedSection as="div" triggerOnce={true} key={index} className="space-y-4" delay={`delay-${index * 100}`}>
                                {section.title !== "Pull-Quote" && <h3 className="text-2xl font-semibold text-white !mb-3">{section.title}</h3>}
                                <div className="!mt-0">
                                    <SimpleMarkdownParser content={section.content} />
                                </div>
                            </AnimatedSection>
                        ))}
                  </div>
                  {selectedStory.githubLink && (
                    <div className="text-center mt-12 pt-8 border-t border-zinc-700">
                        <Button variant="link" asChild className="text-zinc-400 hover:text-white">
                            <Link href={selectedStory.githubLink} target="_blank" rel="noopener noreferrer">
                                Follow the development on GitHub →
                            </Link>
                        </Button>
                    </div>
                  )}
              </article>
            )}
        </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto mb-12 relative px-4">
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon" className="absolute top-0 left-4 bg-zinc-900/50 border-white/10 hover:bg-zinc-800">
                        <Link href="/" aria-label="Home">
                            <Home className="h-4 w-4" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Go to Homepage</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
          <div className="text-center pt-16 sm:pt-0">
            <h1 className="text-4xl md:text-5xl font-bold">The Reason behind the code</h1>
            <p className="text-lg text-zinc-400 mt-2">Every build started with a problem — not just an idea.</p>
          </div>
      </div>
      {stories.length === 0 ? (
        <p className="text-center text-muted-foreground">No stories have been published yet.</p>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto px-4">
          {stories.map(story => (
            <Link key={story.id} href={`/stories/why?project=${story.projectId}`} legacyBehavior>
              <a className="block group">
                <div className="flex flex-col h-full overflow-hidden rounded-lg bg-zinc-900/50 border border-white/5 p-8 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/10"
                  style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                >
                  <div className="flex-grow">
                    <p className="text-sm text-zinc-500 mb-2">{new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h2 className="text-2xl font-bold text-white mb-3">{story.title}</h2>
                    
                    <div className="mb-4 text-zinc-400 pl-3 border-l-2 border-primary/30">
                        <p className="font-medium text-primary text-sm mb-1">The trigger →</p>
                        <p className="italic">{story.trigger}</p>
                    </div>
                    
                    <p className="text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                      {story.tagline}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                     <div className="flex flex-wrap gap-2">
                         {story.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="border-zinc-700 text-zinc-300">{tag}</Badge>)}
                    </div>
                     <div className="flex items-center text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                        → Read the reason
                      </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
           <footer className="text-center text-zinc-500 mt-16 text-sm">
                <p>More reasons will appear here as life breaks things — and I build to fix them.</p>
            </footer>
        </div>
      )}
    </div>
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
