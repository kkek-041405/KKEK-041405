
"use client";

import { useSpotify } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Music,
  Power,
  PowerOff,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Laptop2,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { usePlayer } from "@/hooks/usePlayer";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Login View
function SpotifyLogin({
  login,
  error,
}: {
  login: () => void;
  error: string | null;
}) {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4">
          <Music className="h-10 w-10 text-green-500" />
        </div>
        <CardTitle className="text-2xl md:text-3xl">Spotify Control</CardTitle>
        <CardDescription className="text-md">
          Connect your Spotify account to control playback and view what's
          playing.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <p className="text-lg font-medium text-destructive">
          Not connected to Spotify
        </p>
        <Button
          onClick={login}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Power className="mr-2 h-4 w-4" />
          Connect with Spotify
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

// Token Info View
function TokenInfo({
  expiresAt,
  expiresIn,
  onRefresh,
  isLoading,
}: {
  expiresAt: number | null;
  expiresIn: number | null;
  onRefresh: () => void;
  isLoading: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState(expiresIn);

  useEffect(() => {
    setTimeLeft(expiresIn);
    if (expiresIn === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresIn]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds < 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="w-full max-w-sm rounded-xl shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Token Information
        </CardTitle>
        <CardDescription>
          Your session tokens are refreshed automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time until next refresh:
          </span>
          <span className="font-mono text-foreground">
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Expires at:</span>
          <span className="font-mono text-sm text-foreground">
            {expiresAt ? new Date(expiresAt).toLocaleTimeString() : "N/A"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground pt-2">
          Access and refresh tokens are stored securely in httpOnly cookies and are not displayed for security.
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRefresh} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Now
        </Button>
      </CardFooter>
    </Card>
  );
}


// Player View
function SpotifyPlayer() {
  const {
    playerState,
    devices,
    controls,
    isLoading,
    error,
  } = usePlayer();

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (isLoading && !playerState) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-48">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading player...</span>
      </div>
    );
  }

  if (error && !playerState) {
    return (
       <Card className="w-full max-w-md shadow-xl text-center border-destructive">
         <CardHeader>
            <CardTitle className="text-destructive">Error Loading Player</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-destructive-foreground mb-4">{error}</p>
         </CardContent>
       </Card>
    );
  }

  if (!playerState || !playerState.item) {
    return (
       <Card className="w-full max-w-sm shadow-xl text-center">
         <CardHeader>
            <CardTitle>Nothing Playing</CardTitle>
            <CardDescription>Open Spotify on one of your devices and start playing a track.</CardDescription>
         </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
                Connected to Spotify ✓
            </p>
          </CardContent>
       </Card>
    );
  }

  const { item, is_playing, progress_ms, shuffle_state, repeat_state, device } =
    playerState;
  const imageUrl = item.album.images?.[0]?.url;

  return (
    <Card className="w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border-2">
      <CardContent className="p-4 space-y-4">
        {imageUrl && (
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={item.album.name}
              fill
              className="rounded-lg object-cover shadow-lg"
              data-ai-hint="album cover"
            />
          </div>
        )}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold truncate">{item.name}</h3>
          <p className="text-muted-foreground truncate">
            {item.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Slider
            value={[progress_ms ?? 0]}
            max={item.duration_ms}
            step={1000}
            className="w-full"
            onValueChange={(value) => controls.seek(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatDuration(progress_ms ?? 0)}</span>
            <span>{formatDuration(item.duration_ms)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => controls.toggleShuffle(!shuffle_state)}
            className={cn(shuffle_state && "text-primary")}
          >
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={controls.previous}>
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            className="h-16 w-16 rounded-full shadow-lg"
            onClick={() => (is_playing ? controls.pause() : controls.play())}
          >
            {is_playing ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={controls.next}>
            <SkipForward className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={controls.toggleRepeat}
            className={cn(repeat_state !== "off" && "text-primary")}
          >
            <Repeat className="h-5 w-5" />
          </Button>
        </div>

        {/* Bottom Bar: Devices and Volume */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Laptop2 className="h-4 w-4" />
                <span className="truncate max-w-[100px]">{device.name}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2">
              <div className="space-y-2">
                <p className="font-medium text-sm px-2">Devices</p>
                {devices.map((d) => (
                  <Button
                    key={d.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => controls.transferPlayback(d.id)}
                    disabled={d.is_active}
                  >
                    <Laptop2 className="h-4 w-4" />
                    {d.name}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={controls.toggleMute}
            >
              {device.volume_percent === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[device.volume_percent ?? 100]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={(value) => controls.setVolume(value[0])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Authenticated View
function AuthenticatedSpotifyView({
  logout,
  authState,
  refreshToken,
}: {
  logout: () => void;
  authState: ReturnType<typeof useSpotify>["authState"];
  refreshToken: () => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshToken();
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-8 flex flex-col items-center">
      <SpotifyPlayer />
      <TokenInfo
        expiresAt={authState.expiresAt}
        expiresIn={authState.expiresIn}
        onRefresh={handleRefresh}
        isLoading={isRefreshing}
      />
      <Button variant="outline" onClick={logout} className="w-full max-w-sm mt-4">
        <PowerOff className="mr-2 h-4 w-4" />
        Disconnect from Spotify
      </Button>
    </div>
  );
}


// Main View Component
export default function SpotifyView() {
  const { authState, login, logout, refreshToken } = useSpotify();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {authState.isLoading ? (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Checking connection...</span>
        </div>
      ) : authState.isAuthenticated ? (
        <AuthenticatedSpotifyView
          logout={logout}
          authState={authState}
          refreshToken={refreshToken}
        />
      ) : (
        <SpotifyLogin login={login} error={authState.error} />
      )}
    </main>
  );
}
