
"use client";

import { useSpotify } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Music, Power } from "lucide-react";
import { SpotifyPlayer } from "./spotify-player";
import { useEffect, useState, useCallback } from "react";
import type { SpotifyPlaylist, SpotifyPlaylistTrack } from "@/lib/spotify-types";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

// Authenticated View
function AuthenticatedSpotifyView() {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylistTrack[] | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { controls, playerState } = usePlayer();

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await fetch('/api/spotify/me/playlists');
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch playlists", error);
    }
  }, []);

  const fetchPlaylistTracks = useCallback(async (playlistId: string) => {
    setIsLoading(true);
    setSelectedPlaylistId(playlistId);
    try {
      const response = await fetch(`/api/spotify/playlists/${playlistId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedPlaylist(data.tracks.items);
      }
    } catch (error) {
      console.error("Failed to fetch playlist tracks", error);
      setSelectedPlaylist(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const currentlyPlayingId = playerState?.item?.id;

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Playlist Sidebar */}
      <aside className="w-1/4 min-w-[250px] bg-card border-r p-4">
        <h2 className="text-xl font-bold mb-4">Playlists</h2>
        <ScrollArea className="h-[calc(100%-40px)]">
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
                {p.images[0] ? (
                  <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="rounded-sm"/>
                ) : (
                  <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center"><Music /></div>
                )}
                <span className="truncate font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content - Tracks */}
      <main className="flex-1 p-6 pb-[90px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : selectedPlaylist ? (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold mb-4">Tracks</h2>
            {selectedPlaylist.map(({ track }, index) => track && (
              <div 
                key={`${track.id}-${index}`}
                className={cn(
                  "p-3 rounded-md flex items-center gap-4 hover:bg-accent",
                   currentlyPlayingId === track.id && "bg-primary/20 text-primary"
                )}
                onDoubleClick={() => controls.play(track.uri, selectedPlaylist.map(t => t.track.uri), index)}
              >
                <span className="w-6 text-muted-foreground">{index + 1}</span>
                {track.album.images[0] ? (
                  <Image src={track.album.images[0].url} alt={track.name} width={40} height={40} className="rounded-sm"/>
                ) : (
                  <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center"><Music /></div>
                )}
                <div className="flex-1 truncate">
                  <p className={cn("font-semibold truncate", currentlyPlayingId === track.id && "text-primary")}>{track.name}</p>
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

      <SpotifyPlayer />
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
