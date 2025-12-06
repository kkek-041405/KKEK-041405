
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

interface Story {
  id: string;
  projectId: string;
  title: string;
  tagline: string;
  reason: string;
  content: string;
  tags: string[];
  date: string;
}

// Reusable Hero Component
const StoryHero = ({ projectName, projectReason, onExploreClick }: { projectName: string, projectReason: string, onExploreClick: () => void }) => {
  const [isArrowAnimating, setIsArrowAnimating] = useState(false);
  const [typedProjectName, setTypedProjectName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsArrowAnimating(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTypedProjectName(''); // Reset on project name change
    if (projectName) {
      const initialDelay = 400; // Corresponds to the old animation-delay
      const typingSpeed = 100; // ms per character

      const timeoutId = setTimeout(() => {
        let i = 0;
        const intervalId = setInterval(() => {
          if (i < projectName.length) {
            setTypedProjectName(prev => prev + projectName.charAt(i));
            i++;
          } else {
            clearInterval(intervalId);
          }
        }, typingSpeed);

        return () => clearInterval(intervalId);
      }, initialDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [projectName]);


  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6 relative">
      <div className="flex flex-col items-center gap-4">
        <p 
          className="font-mono text-xl md:text-2xl font-bold text-zinc-400 animate-fade-in" 
          style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
          why i built
        </p>
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl font-semibold text-zinc-100 min-h-[1.2em]"
        >
          {typedProjectName}
        </h1>
        <p 
          className="text-base md:text-lg text-zinc-500 lowercase max-w-md animate-fade-in"
          style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}
        >
          {projectReason}
        </p>
        <div 
          className="mt-6 animate-fade-in"
          style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
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

  const handleExploreClick = () => {
    storyContentRef.current?.scrollIntoView({ behavior: 'smooth' });
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
             <Button variant="outline" onClick={() => router.push('/stories/why')} className="absolute top-6 left-6 z-10 bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
            </Button>
            
            <StoryHero 
              projectName={selectedStory.title}
              projectReason={selectedStory.reason}
              onExploreClick={handleExploreClick}
            />

            <article ref={storyContentRef} className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
                <header className="mb-8 border-b border-zinc-700 pb-6 text-center">
                    <p className="text-zinc-400 text-lg">Published on {new Date(selectedStory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {selectedStory.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">{tag}</Badge>
                        ))}
                    </div>
                </header>
                <div 
                  className="prose dark:prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedStory.content.replace(/### (.*?)\n/g, '<h3 class="text-2xl font-semibold text-white mt-8 mb-4">$1</h3>').replace(/\n/g, '<br />') }} 
                />
            </article>
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
