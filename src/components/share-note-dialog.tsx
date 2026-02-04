
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createShareLink } from '@/services/share-note-service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Check, Link2, Eye, Edit } from 'lucide-react';
import type { Note } from '@/lib/types';
import { cn } from '@/lib/utils';


interface ShareNoteDialogProps {
  note: Note;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ShareNoteDialog({ note, isOpen, onOpenChange }: ShareNoteDialogProps) {
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [viewLimit, setViewLimit] = useState(1);
  const [linkType, setLinkType] = useState<'view' | 'fill'>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // When switching to editable link, make it permanent and single-use.
    if (linkType === 'fill') {
      setViewLimit(1);
      setExpiresInHours(0); // 0 makes it permanent until submitted
    } else {
      // When switching back to 'view', restore a sensible default if it was on the 'fill' default
      if (viewLimit === 1 && expiresInHours === 0) {
        setViewLimit(1);
        setExpiresInHours(24); // Default back to 24 hours for view links
      }
    }
  }, [linkType]);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const link = await createShareLink(note.id, { 
        expiresInHours, 
        viewLimit
      }, linkType);
      setGeneratedLink(link);
    } catch (error) {
      console.error('Failed to create share link:', error);
      toast({
        title: 'Error Creating Link',
        description: 'Could not create a share link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    if (generatedLink) {
        navigator.clipboard.writeText(generatedLink).then(() => {
            setIsCopied(true);
            toast({ title: 'Link Copied!' });
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            toast({ title: 'Copy Failed', variant: 'destructive'});
        });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setGeneratedLink(null);
      setIsLoading(false);
      setIsCopied(false);
      setLinkType('view');
      setExpiresInHours(24);
      setViewLimit(1);
    }
    onOpenChange(open);
  }
  
  const generatedLinkDescription = () => {
      if (linkType === 'fill') {
          return "This is a single-use editable link. It will be permanently disabled after it's used once.";
      }

      const expiryText = expiresInHours > 0 ? `in ${expiresInHours} hour(s)` : 'never expires';
      const viewLimitText = viewLimit > 0 ? `after ${viewLimit} view(s)` : 'has unlimited views';

      if (expiresInHours > 0 && viewLimit > 0) {
          return `This link will expire ${expiryText} or ${viewLimitText}, whichever comes first.`;
      }
      if (expiresInHours > 0) {
          return `This link will expire ${expiryText} and has unlimited views.`;
      }
      if (viewLimit > 0) {
          return `This link never expires and will be invalid ${viewLimitText}.`;
      }
      return 'This link is permanent and has unlimited views.';
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share "{note.title}"</DialogTitle>
           {!generatedLink && (
              <DialogDescription>
                Create a secure link to share this item.
              </DialogDescription>
           )}
        </DialogHeader>

        {generatedLink ? (
          <div className="space-y-4 py-4">
             <Label htmlFor="share-link">Your Shareable Link</Label>
             <div className="flex items-center space-x-2">
                 <Input id="share-link" value={generatedLink} readOnly />
                 <Button size="icon" onClick={handleCopyToClipboard}>
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                 </Button>
             </div>
             <p className="text-sm text-muted-foreground">{generatedLinkDescription()}</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link-type" className="text-right">
                    Type
                </Label>
                 <Select
                    value={linkType}
                    onValueChange={(value: 'view' | 'fill') => setLinkType(value)}
                >
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="view">
                        <div className="flex items-center"><Eye className="mr-2 h-4 w-4"/>View Only</div>
                    </SelectItem>
                    <SelectItem value="fill">
                        <div className="flex items-center"><Edit className="mr-2 h-4 w-4"/>Editable Link</div>
                    </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className={cn("space-y-4", linkType === 'fill' && 'opacity-50')}>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expires-in" className="text-right">
                    Expires In
                </Label>
                <Select
                    value={String(expiresInHours)}
                    onValueChange={(value) => setExpiresInHours(Number(value))}
                    disabled={linkType === 'fill'}
                >
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select expiry time" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">1 Hour</SelectItem>
                    <SelectItem value="24">24 Hours</SelectItem>
                    <SelectItem value="168">7 Days</SelectItem>
                    <SelectItem value="0">Permanent</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="view-limit" className="text-right">
                    View Limit
                </Label>
                <Input
                    id="view-limit"
                    type="number"
                    value={viewLimit}
                    onChange={(e) => setViewLimit(Math.max(0, Number(e.target.value)))}
                    className="col-span-3"
                    min="0"
                    disabled={linkType === 'fill'}
                />
                </div>
                <p className="text-xs text-muted-foreground col-span-4 text-right -mt-2">
                    {linkType === 'fill' ? "Editable links are single-use." : "Set to 0 for unlimited views."}
                </p>
            </div>
          </div>
        )}

        {!generatedLink && (
            <DialogFooter>
                <Button onClick={handleGenerateLink} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                Generate Link
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
