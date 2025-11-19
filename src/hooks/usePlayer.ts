
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  SpotifyPlayerState,
  SpotifyDevice,
} from "@/lib/spotify-types";

const REFRESH_INTERVAL = 5000; // 5 seconds

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...options, credentials: "include" });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const errorMessage = errorBody.error?.message || res.statusText || "API call failed";
    throw new Error(`${res.status}: ${errorMessage}`);
  }
  // For 204 No Content responses
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export function usePlayer() {
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(
    null
  );
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getPlayerState = useCallback(async () => {
    try {
      const state = await fetcher<SpotifyPlayerState>("/api/spotify/player");
      setPlayerState(state);
      if (error) setError(null);
    } catch (e) {
      console.error("Failed to fetch player state:", e);
      setError(
        e instanceof Error ? e.message : "Failed to fetch player state"
      );
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  const getDevices = useCallback(async () => {
    try {
      const { devices } = await fetcher<{ devices: SpotifyDevice[] }>(
        "/api/spotify/player/devices"
      );
      setDevices(devices);
    } catch (e) {
      console.error("Failed to fetch devices:", e);
    }
  }, []);

  const controls = {
    play: async () => {
      await fetcher("/api/spotify/player/play", { method: "PUT" });
      await getPlayerState();
    },
    pause: async () => {
      await fetcher("/api/spotify/player/pause", { method: "PUT" });
      await getPlayerState();
    },
    next: async () => {
      await fetcher("/api/spotify/player/next", { method: "POST" });
      setTimeout(getPlayerState, 500); // Give spotify time to update
    },
    previous: async () => {
      await fetcher("/api/spotify/player/previous", { method: "POST" });
      setTimeout(getPlayerState, 500); // Give spotify time to update
    },
    seek: async (position_ms: number) => {
      await fetcher(`/api/spotify/player/seek?position_ms=${position_ms}`, {
        method: "PUT",
      });
      // Optimistically update progress
      setPlayerState(prev => prev ? ({ ...prev, progress_ms: position_ms }) : null);
    },
    setVolume: async (volume_percent: number) => {
      await fetcher(
        `/api/spotify/player/volume?volume_percent=${volume_percent}`,
        { method: "PUT" }
      );
      setPlayerState(prev => prev ? ({ ...prev, device: { ...prev.device, volume_percent }}) : null);
    },
    toggleShuffle: async (state: boolean) => {
      await fetcher(`/api/spotify/player/shuffle?state=${state}`, {
        method: "PUT",
      });
       await getPlayerState();
    },
    toggleRepeat: async () => {
      if (!playerState) return;
      const currentState = playerState.repeat_state;
      const nextState =
        currentState === "off"
          ? "context"
          : currentState === "context"
          ? "track"
          : "off";
      await fetcher(`/api/spotify/player/repeat?state=${nextState}`, {
        method: "PUT",
      });
       await getPlayerState();
    },
    toggleMute: async () => {
        if (!playerState) return;
        const currentVolume = playerState.device.volume_percent;
        const newVolume = currentVolume > 0 ? 0 : 50; // Mute or set to 50%
        await controls.setVolume(newVolume);
    },
    transferPlayback: async (deviceId: string) => {
      try {
        await fetcher("/api/spotify/player/transfer", {
          method: "PUT",
          body: JSON.stringify({ device_id: deviceId }),
        });
        await getPlayerState(); // Refresh state after transfer
      } catch (e) {
        console.error("Failed to transfer playback:", e);
      }
    },
  };

  useEffect(() => {
    // Fetch initial data
    getPlayerState();
    getDevices();

    // Set up polling
    intervalRef.current = setInterval(() => {
      getPlayerState();
    }, REFRESH_INTERVAL);

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getPlayerState, getDevices]);

  return {
    playerState,
    devices,
    controls,
    isLoading,
    error,
  };
}
