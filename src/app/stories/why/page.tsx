
"use client";

import React, { Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/animated-section';
import storiesData from './stories.json';

// Define the structure of a story document from the JSON file
interface Story {
  id: string;
  projectId: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

// Main content component that uses searchParams
function WhyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('project');
  const storyContentRef = useRef<HTMLDivElement>(null);

  const handleExploreClick = () => {
    storyContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Logic is now synchronous, reading from imported JSON
  const stories: Story[] = storiesData.map(story => ({...story, id: story.projectId}));
  let selectedStory: Story | null = null;
  let notFound = false;

  if (projectId) {
    selectedStory = stories.find(s => s.projectId === projectId) || null;
    if (!selectedStory) {
      notFound = true;
    }
  }

  // Single Story View (Detail View)
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

    if (!selectedStory) return null; // Should not happen with the logic above

    return (
        <div className="flex flex-col min-h-screen">
            <div className="h-screen flex flex-col items-center justify-center text-center p-4 relative">
                <Button variant="outline" onClick={() => router.push('/stories/why')} className="absolute top-6 left-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stories
                </Button>
                
                <AnimatedSection as="div" className="w-full">
                    <p className="text-xl text-zinc-400">Project Stories</p>
                    <h1 className="text-7xl font-mono font-bold text-red-500 my-2">why i build</h1>
                    <p className="text-sm text-zinc-500 mb-8">The story behind the code</p>
                    
                    <h2 className="text-5xl font-mono font-semibold text-green-400 mb-10">{selectedStory.title}</h2>

                    <Button variant="outline" onClick={handleExploreClick} className="rounded-full px-6">
                        Explore
                        <ArrowDown className="ml-2 h-4 w-4" />
                    </Button>
                </AnimatedSection>
            </div>

            <article ref={storyContentRef} className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
                <header className="mb-8 border-b border-zinc-700 pb-6 text-center">
                    <p className="text-zinc-400 text-lg">Published on {new Date(selectedStory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {selectedStory.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
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

  // All Stories View (List View)
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
                      {story.content.substring(0, 150).replace(/<[^>]*>?/gm, '').replace(/###/g, '')}...
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

// The main page component that wraps the content in Suspense
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
