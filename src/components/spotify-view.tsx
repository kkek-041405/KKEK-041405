
"use client";

import { useSpotify } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Music, Power, RefreshCw, Eye, Timer, Copy, Check, LogOut, Link as LinkIcon, Heart } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import type { SpotifyPlaylist, SpotifyPlaylistTrack } from "@/lib/spotify-types";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Countdown } from './countdown';
import { useToast } from "@/hooks/use-toast";
import { SpotifyPlayer } from "./spotify-player";
import { usePlayer } from "@/hooks/usePlayer";
import { getPlaylistsFromFirestore, savePlaylistsToFirestore, getTracksFromFirestore, saveTracksToFirestore } from "@/services/spotify-playlist-service";


// Login View
function SpotifyLogin({
  login,
  error,
}: {
  login: () => void;
  error: string | null;
}) {
  return (
     <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4">
            <Music className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Spotify Control</CardTitle>
          <CardDescription className="text-md">
            Connect your Spotify account to store tokens in Firestore and control playback.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Button
            onClick={login}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Power className="mr-2 h-4 w-4" />
            Connect with Spotify
          </Button>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>
    </main>
  );
}

// Token Info Popover
function TokenInfoPopover() {
  const { authState, refreshToken, logout } = useSpotify();
  const { toast } = useToast();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (textToCopy: string | null, label: 'Access Token' | 'Refresh Token' | 'Auth URL') => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedToken(label);
      setTimeout(() => setCopiedToken(null), 2000); // Reset after 2 seconds
      toast({ title: `${label} Copied!`, description: `The ${label.toLowerCase()} has been copied.` });
    }).catch(err => {
      toast({ title: "Copy Failed", description: `Could not copy the ${label.toLowerCase()}.`, variant: 'destructive'});
    });
  };
  
  const handleReauthenticate = () => {
    const authUrl = `${window.location.origin}/api/spotify/auth`;
    handleCopy(authUrl, 'Auth URL');
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Eye className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 mr-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Token Status</h4>
          <div className="text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Access Token:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs truncate">
                  {authState.tokens?.accessToken ? `${authState.tokens.accessToken.slice(0, 20)}...` : 'N/A'}
                </span>
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(authState.tokens?.accessToken ?? null, 'Access Token')}>
                  {copiedToken === 'Access Token' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Refresh Token:</span>
               <div className="flex items-center gap-2">
                <span className="font-mono text-xs truncate">
                  {authState.tokens?.refreshToken ? `${authState.tokens.refreshToken.slice(0, 20)}...` : 'N/A'}
                </span>
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(authState.tokens?.refreshToken ?? null, 'Refresh Token')}>
                  {copiedToken === 'Refresh Token' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center"><Timer className="h-4 w-4 mr-1"/> Time to Refresh:</span>
              <span className="font-mono text-xs">
                {authState.timeToRefresh > 0 ? <Countdown targetDate={authState.timeToRefresh} /> : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshToken} className="w-full" disabled={authState.isLoading}>
              {authState.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Token
            </Button>
             <Button variant="secondary" onClick={handleReauthenticate} className="w-full" disabled={authState.isLoading}>
                {copiedToken === 'Auth URL' ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                Re-authenticate
            </Button>
          </div>
           <Button variant="destructive" onClick={logout} className="w-full" disabled={authState.isLoading}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const likedSongsPlaylist: SpotifyPlaylist = {
  id: 'liked-songs',
  name: 'Liked Songs',
  description: 'Your saved tracks',
  images: [{ url: 'https://t.scdn.co/images/3099b3803ad9496896c43f2210d61f60.png', height: 640, width: 640 }],
  owner: { display_name: 'Spotify' },
  tracks: { href: '', total: 0 }, // Total can be updated dynamically if needed
  uri: 'spotify:user:spotify:collection',
};

// Authenticated View
function AuthenticatedSpotifyView() {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylistTrack[] | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [isRefreshingPlaylists, setIsRefreshingPlaylists] = useState(false);
  const { toast } = useToast();

  const { playerState, play } = usePlayer();

  useEffect(() => {
    // On initial load, try to get playlists from Firestore
    async function loadInitialPlaylists() {
      setIsRefreshingPlaylists(true);
      const cachedPlaylists = await getPlaylistsFromFirestore();
      if (cachedPlaylists && cachedPlaylists.length > 0) {
        setPlaylists([likedSongsPlaylist, ...cachedPlaylists]);
      } else {
        setPlaylists([likedSongsPlaylist]); // Show liked songs even if no other playlists are cached
      }
      setIsRefreshingPlaylists(false);
    }
    loadInitialPlaylists();
  }, []);

  const fetchPlaylistsFromSpotify = useCallback(async () => {
    setIsRefreshingPlaylists(true);
    try {
      const response = await fetch('/api/spotify/me/playlists?limit=50');
      if (response.ok) {
        const data = await response.json();
        setPlaylists([likedSongsPlaylist, ...data.items]);
        await savePlaylistsToFirestore(data.items); // Save to Firestore
        toast({
          title: "Playlists Refreshed",
          description: "Your playlists have been updated from Spotify and saved.",
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch playlists", errorText);
        toast({
          title: "Error Refreshing Playlists",
          description: "Could not fetch playlists from Spotify.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
       toast({
          title: "Network Error",
          description: "A network error occurred while fetching playlists.",
          variant: "destructive",
        });
    } finally {
      setIsRefreshingPlaylists(false);
    }
  }, [toast]);

  const fetchPlaylistTracks = useCallback(async (playlistId: string) => {
    setIsLoadingTracks(true);
    setSelectedPlaylistId(playlistId);
    try {
      const cachedTracks = await getTracksFromFirestore(playlistId);
      if (cachedTracks) {
        setSelectedPlaylist(cachedTracks);
        setIsLoadingTracks(false);
        return;
      }
      
      let apiUrl = `/api/spotify/playlists/${playlistId}`;
      if (playlistId === 'liked-songs') {
          apiUrl = '/api/spotify/me/tracks?limit=50';
      }

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        const tracks = playlistId === 'liked-songs' ? data.items : data.tracks.items;

        setSelectedPlaylist(tracks);
        await saveTracksToFirestore(playlistId, tracks);
      } else {
         toast({
          title: "Error Loading Tracks",
          description: `Could not load tracks for the selected ${playlistId === 'liked-songs' ? 'collection' : 'playlist'}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch playlist tracks", error);
       toast({
          title: "Network Error",
          description: "A network error occurred while fetching tracks.",
          variant: "destructive",
        });
      setSelectedPlaylist(null);
    } finally {
      setIsLoadingTracks(false);
    }
  }, [toast]);

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      <div className="flex flex-1 overflow-hidden">
        {/* Playlist Sidebar */}
        <aside className="w-1/4 min-w-[250px] bg-card border-r p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Playlists</h2>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchPlaylistsFromSpotify}
                  disabled={isRefreshingPlaylists}
                  aria-label="Refresh Playlists from Spotify"
                  title="Refresh Playlists from Spotify"
              >
                  <RefreshCw className={cn("h-4 w-4", isRefreshingPlaylists && "animate-spin")} />
              </Button>
          </div>
          <ScrollArea className="flex-1">
            {isRefreshingPlaylists && playlists.length <= 1 ? (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 </div>
            ) : playlists.length > 0 ? (
              <div className="space-y-2">
                {playlists.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => fetchPlaylistTracks(p.id)}
                    className={cn(
                      "p-2 rounded-md flex items-center gap-3 cursor-pointer hover:bg-accent",
                      selectedPlaylistId === p.id && "bg-primary/10 text-primary"
                    )}
                  >
                    {p.id === 'liked-songs' ? (
                       <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-sm flex items-center justify-center">
                          <Heart className="h-5 w-5 text-white" />
                       </div>
                    ) : p.images[0] ? (
                      <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="rounded-sm"/>
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center"><Music /></div>
                    )}
                    <span className="truncate font-medium">{p.name}</span>
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center text-muted-foreground text-sm p-4">
                  No playlists found. Click the refresh icon to fetch them from Spotify.
                </div>
            )}
          </ScrollArea>
        </aside>

        {/* Main Content - Tracks */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-end p-4 border-b">
            <TokenInfoPopover />
          </div>
          <main className="flex-1 p-6 pt-0 overflow-y-auto">
            {isLoadingTracks ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : selectedPlaylist ? (
              <div className="space-y-2 pt-6">
                <h2 className="text-2xl font-bold mb-4">Tracks</h2>
                {selectedPlaylist.map(({ track }, index) => track && (
                  <div 
                    key={`${track.id}-${index}`}
                    onDoubleClick={() => play({ uris: [track.uri]})}
                    className={cn(
                      "p-3 rounded-md flex items-center gap-4 hover:bg-accent cursor-pointer",
                       playerState?.item?.id === track.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="w-6 text-muted-foreground">{index + 1}</span>
                    {track.album.images[0] ? (
                      <Image src={track.album.images[0].url} alt={track.name} width={40} height={40} className="rounded-sm"/>
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center"><Music /></div>
                    )}
                    <div className="flex-1 truncate">
                      <p className="font-semibold truncate">{track.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{track.artists.map(a => a.name).join(', ')}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDuration(track.duration_ms)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a playlist to see its tracks.
              </div>
            )}
          </main>
        </div>
      </div>
      {playerState && playerState.item && <SpotifyPlayer />}
    </div>
  );
}

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}


// Main View Component
export default function SpotifyView() {
  const { authState } = useSpotify();

  if (authState.isLoading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Checking session...</span>
        </div>
      </main>
    );
  }

  return authState.isAuthenticated ? (
    <AuthenticatedSpotifyView />
  ) : (
    <SpotifyLogin login={() => window.location.href = "/api/spotify/auth"} error={authState.error} />
  );
}
