
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  SpotifyPlayerState,
  SpotifyDevice,
} from "@/lib/spotify-types";
import { useSpotify } from "./useSpotify"; // Import useSpotify hook

const REFRESH_INTERVAL = 5000; // 5 seconds

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...options, credentials: "include" });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    // Include status in the error message for better handling
    const errorMessage = `STAT: ${res.status} - ${errorBody.error?.message || res.statusText || "API call failed"}`;
    throw new Error(errorMessage);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export function usePlayer() {
  const { authState } = useSpotify();
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized function to fetch the current player state
  const fetchPlayerState = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    try {
      const state = await fetcher<SpotifyPlayerState>("/api/spotify/player");
      setPlayerState(state);
      if (error) setError(null);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to fetch player state";
      console.error("Error fetching player state:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [error, authState.isAuthenticated]);


  // Helper function to execute a command and then refresh state
  const spotifyCommand = useCallback(async (command: () => Promise<any>) => {
    if (!authState.isAuthenticated) return;
    try {
      await command();
      // Schedule a state fetch shortly after the command to update UI quickly
      setTimeout(fetchPlayerState, 300);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Spotify command failed";
      console.error("Spotify command error:", errorMessage);
      setError(errorMessage);
    }
  }, [fetchPlayerState, authState.isAuthenticated]);


  const getDevices = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    try {
      const { devices } = await fetcher<{ devices: SpotifyDevice[] }>(
        "/api/spotify/player/devices"
      );
      setDevices(devices);
    } catch (e) {
      console.error("Failed to fetch devices:", e);
    }
  }, [authState.isAuthenticated]);
  
  const controls = {
    play: (uri?: string, context_uri?: string[], offset?: number) => {
      const body = uri ? { uris: [uri] } : {};
      if (context_uri && offset !== undefined) {
        body.context_uri = context_uri.join(',');
        body.offset = { position: offset };
        delete body.uris;
      }
      spotifyCommand(() => fetcher("/api/spotify/player/play", { method: "PUT", body: JSON.stringify(body) }));
    },
    pause: () => spotifyCommand(() => fetcher("/api/spotify/player/pause", { method: "PUT" })),
    next: () => spotifyCommand(() => fetcher("/api/spotify/player/next", { method: "POST" })),
    previous: () => spotifyCommand(() => fetcher("/api/spotify/player/previous", { method: "POST" })),
    seek: (position_ms: number) => {
        spotifyCommand(() => fetcher(`/api/spotify/player/seek?position_ms=${position_ms}`, { method: "PUT" }));
        // Optimistically update progress for instant UI feedback
        setPlayerState(prev => prev ? ({ ...prev, progress_ms: position_ms }) : null);
    },
    setVolume: (volume_percent: number) => {
        spotifyCommand(() => fetcher(`/api/spotify/player/volume?volume_percent=${volume_percent}`, { method: "PUT" }));
        // Optimistically update volume
        setPlayerState(prev => prev ? ({ ...prev, device: { ...prev.device, volume_percent }}) : null);
    },
    toggleShuffle: (state: boolean) => spotifyCommand(() => fetcher(`/api/spotify/player/shuffle?state=${state}`, { method: "PUT" })),
    toggleRepeat: () => {
        if (!playerState) return;
        const currentState = playerState.repeat_state;
        const nextState = currentState === "off" ? "context" : currentState === "context" ? "track" : "off";
        spotifyCommand(() => fetcher(`/api/spotify/player/repeat?state=${nextState}`, { method: "PUT" }));
    },
    toggleMute: () => {
        if (!playerState) return;
        const currentVolume = playerState.device.volume_percent;
        const newVolume = currentVolume > 0 ? 0 : 50; // Mute or set to 50%
        controls.setVolume(newVolume);
    },
    transferPlayback: (deviceId: string) => spotifyCommand(() => fetcher("/api/spotify/player/transfer", {
      method: "PUT",
      body: JSON.stringify({ device_ids: [deviceId], play: true }),
    })),
  };
  
  useEffect(() => {
    if (authState.isAuthenticated) {
      // Initial data fetch
      fetchPlayerState();
      getDevices();

      // Set up polling
      intervalRef.current = setInterval(fetchPlayerState, REFRESH_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPlayerState, getDevices, authState.isAuthenticated]);

  return {
    playerState,
    devices,
    controls,
    isLoading,
    error,
  };
}
