
'use client';

import { useState } from 'react';
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
import { Loader2, Copy, Check } from 'lucide-react';
import type { Note } from '@/lib/types';

interface ShareNoteDialogProps {
  note: Note;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ShareNoteDialog({ note, isOpen, onOpenChange }: ShareNoteDialogProps) {
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [viewLimit, setViewLimit] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const link = await createShareLink(note.id, { expiresInHours, viewLimit });
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
      setExpiresInHours(24);
      setViewLimit(1);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share "{note.title}"</DialogTitle>
          <DialogDescription>
            Create a secure, temporary link to share this item. The link will expire after a set time or number of views.
          </DialogDescription>
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
             <p className="text-sm text-muted-foreground">This link will expire in {expiresInHours} hour(s) or after {viewLimit} view(s), whichever comes first.</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expires-in" className="text-right">
                Expires In
              </Label>
              <Select
                value={String(expiresInHours)}
                onValueChange={(value) => setExpiresInHours(Number(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select expiry time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour</SelectItem>
                  <SelectItem value="24">24 Hours</SelectItem>
                  <SelectItem value="168">7 Days</SelectItem>
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
                onChange={(e) => setViewLimit(Math.max(1, Number(e.target.value)))}
                className="col-span-3"
                min="1"
              />
            </div>
          </div>
        )}

        {!generatedLink && (
            <DialogFooter>
                <Button onClick={handleGenerateLink} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Link
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
