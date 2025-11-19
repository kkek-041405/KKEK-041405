
"use client";

import { usePlayer } from "@/hooks/usePlayer";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  MonitorSpeaker,
} from "lucide-react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SpotifyPlayer() {
  const {
    playerState,
    devices,
    togglePlayPause,
    skipNext,
    skipPrevious,
    toggleShuffle,
    cycleRepeatMode,
    seek,
    setVolume,
    transferPlayback,
  } = usePlayer();

  if (!playerState) {
    return (
      <div className="h-24 bg-card border-t p-4 flex items-center gap-4">
        <Skeleton className="h-14 w-14" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  const { item, is_playing, progress_ms, device, repeat_state, shuffle_state } = playerState;
  const track = item;

  const VolumeIcon =
    device.volume_percent === 0
      ? VolumeX
      : device.volume_percent < 50
      ? Volume1
      : Volume2;

  const RepeatIcon = repeat_state === "track" ? Repeat1 : Repeat;

  return (
    <footer className="bg-card border-t">
      <div className="container p-4 grid grid-cols-3 items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3">
          {track?.album.images[0] ? (
            <Image
              src={track.album.images[0].url}
              alt={track.name}
              width={56}
              height={56}
              className="rounded-md"
            />
          ) : (
            <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                <Play />
            </div>
          )}
          <div>
            <p className="font-semibold truncate">{track?.name ?? 'No track playing'}</p>
            <p className="text-sm text-muted-foreground truncate">
              {track?.artists.map((a) => a.name).join(", ") ?? '...'}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleShuffle}
              className={cn(shuffle_state && "text-primary")}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={skipPrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={togglePlayPause}
            >
              {is_playing ? <Pause /> : <Play />}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleRepeatMode}
              className={cn(repeat_state !== "off" && "text-primary")}
            >
              <RepeatIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-sm">
            <span className="text-xs text-muted-foreground">
              {formatDuration(progress_ms ?? 0)}
            </span>
            <Slider
              value={[(progress_ms ?? 0) / (track?.duration_ms || 1)] * 100}
              onValueChange={(value) => seek(value[0])}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground">
              {formatDuration(track?.duration_ms ?? 0)}
            </span>
          </div>
        </div>

        {/* Volume and Devices */}
        <div className="flex items-center justify-end gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <MonitorSpeaker />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
                <h4 className="text-sm font-medium mb-2">Available Devices</h4>
                <div className="space-y-2">
                    {devices.map(d => (
                        <div key={d.id} onClick={() => transferPlayback(d.id)} className={cn("p-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-accent", d.is_active && "bg-primary/10 text-primary")}>
                            <MonitorSpeaker className="h-4 w-4"/>
                            <span>{d.name}</span>
                        </div>
                    ))}
                </div>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-1 w-32">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <VolumeIcon className="h-5 w-5" />
            </Button>
            <Slider
              value={[device.volume_percent]}
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
