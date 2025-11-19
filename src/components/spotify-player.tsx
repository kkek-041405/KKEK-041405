
"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Mic2,
  ListMusic,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/hooks/usePlayer";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SpotifyPlayer() {
  const { playerState, devices, controls, isLoading } = usePlayer();
  const activeDevice = playerState?.device;
  const currentTrack = playerState?.item;

  if (isLoading || !playerState || !currentTrack) {
    return (
      <div className="h-[80px] bg-card/80 backdrop-blur-md flex items-center justify-center text-muted-foreground">
        Loading player...
      </div>
    );
  }

  const handleSeek = (value: number[]) => {
    controls.seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    controls.setVolume(value[0]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-card/80 backdrop-blur-md border-t z-50 flex items-center px-4">
      <div className="w-1/4 flex items-center gap-3">
        {currentTrack.album.images[0] ? (
          <Image
            src={currentTrack.album.images[0].url}
            alt={currentTrack.album.name}
            width={60}
            height={60}
            className="rounded-md"
          />
        ) : <div className="w-[60px] h-[60px] bg-muted rounded-md flex items-center justify-center"><Music className="h-6 w-6"/></div>}
        <div>
          <p className="font-semibold truncate">{currentTrack.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => controls.toggleShuffle(!playerState.shuffle_state)}
            className={cn(playerState.shuffle_state && "text-primary")}
          >
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={controls.previous}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={playerState.is_playing ? controls.pause : controls.play}
          >
            {playerState.is_playing ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={controls.next}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={controls.toggleRepeat}
            className={cn(playerState.repeat_state !== "off" && "text-primary")}
          >
            {playerState.repeat_state === "track" ? <Repeat1 /> : <Repeat />}
          </Button>
        </div>
        <div className="w-full flex items-center gap-2 text-xs">
          <span>{formatDuration(playerState.progress_ms || 0)}</span>
          <Slider
            value={[playerState.progress_ms || 0]}
            max={currentTrack.duration_ms}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span>{formatDuration(currentTrack.duration_ms)}</span>
        </div>
      </div>

      <div className="w-1/4 flex items-center justify-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <ListMusic className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Devices</h4>
                <p className="text-sm text-muted-foreground">
                  Select a device to play on.
                </p>
              </div>
              <div className="grid gap-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className={cn(
                        "text-sm p-2 rounded-md flex items-center justify-between",
                        device.is_active ? "bg-primary/10 text-primary" : "hover:bg-accent"
                    )}
                    onClick={() => controls.transferPlayback(device.id)}
                  >
                    {device.name}
                    {device.is_active && <Mic2 className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 w-[150px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={controls.toggleMute}
          >
            {activeDevice.volume_percent === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[activeDevice.volume_percent]}
            max={100}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
