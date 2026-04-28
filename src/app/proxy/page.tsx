'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Server } from 'lucide-react';

export default function ProxyPage() {
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [newIp, setNewIp] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const fetchProxyIp = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/proxy');
      if (response.ok) {
        const data = await response.json();
        setCurrentIp(data.proxy_ip);
      } else {
        setCurrentIp(null);
        toast({
          title: 'Failed to Fetch IP',
          description: 'Could not retrieve the current proxy IP.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching proxy IP:', error);
      toast({
        title: 'Network Error',
        description: 'An error occurred while fetching the proxy IP.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProxyIp();
  }, [fetchProxyIp]);

  const handleUpdate = async () => {
    if (!newIp.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid IP address.',
        variant: 'destructive',
      });
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proxy_ip: newIp }),
      });

      if (response.ok) {
        toast({
          title: 'Update Successful',
          description: `Proxy IP has been updated to ${newIp}.`,
        });
        setCurrentIp(newIp);
        setNewIp('');
      } else {
        const errorData = await response.json();
        toast({
          title: 'Update Failed',
          description: errorData.error || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating proxy IP:', error);
      toast({
        title: 'Network Error',
        description: 'An error occurred while updating the proxy IP.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Server className="h-6 w-6 text-primary" />
                    Proxy IP Manager
                </CardTitle>
                <CardDescription>View and update the proxy IP address for your services.</CardDescription>
            </div>
             <Button variant="ghost" size="icon" onClick={fetchProxyIp} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="current-ip">Current Proxy IP</Label>
            <div
              id="current-ip"
              className="mt-2 flex h-10 w-full items-center rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm"
            >
              {isLoading ? (
                <div className="flex items-center text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                currentIp || <span className="text-muted-foreground">Not set</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-ip">New Proxy IP</Label>
            <div className="flex space-x-2">
              <Input
                id="new-ip"
                placeholder="Enter new IP address"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                disabled={isUpdating}
              />
              <Button onClick={handleUpdate} disabled={isUpdating || !newIp}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
