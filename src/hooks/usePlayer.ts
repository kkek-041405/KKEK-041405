
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
  const { refreshToken } = useSpotify(); // Get refreshToken function from useSpotify
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized function to fetch the current player state
  const fetchPlayerState = useCallback(async () => {
    try {
      const state = await fetcher<SpotifyPlayerState>("/api/spotify/player");
      setPlayerState(state);
      if (error) setError(null);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to fetch player state";
      console.error("Error fetching player state:", errorMessage);
      
      // Enhanced error handling: check for token expiration
      if (errorMessage.includes("STAT: 401") || errorMessage.toLowerCase().includes("token expired")) {
        console.log("Spotify token expired or invalid, attempting to refresh...");
        await refreshToken(); // Attempt to refresh the token
        // After refresh, the next poll will try again with the new token
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [error, refreshToken]);


  // Helper function to execute a command and then refresh state
  const spotifyCommand = useCallback(async (command: () => Promise<any>) => {
    try {
      await command();
      // Schedule a state fetch shortly after the command to update UI quickly
      setTimeout(fetchPlayerState, 300);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Spotify command failed";
      console.error("Spotify command error:", errorMessage);
      setError(errorMessage);
    }
  }, [fetchPlayerState]);


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
    play: () => spotifyCommand(() => fetcher("/api/spotify/player/play", { method: "PUT" })),
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
        const newVolume = currentVolume > 0 ? 0 : 50;
        controls.setVolume(newVolume);
    },
    transferPlayback: (deviceId: string) => spotifyCommand(() => fetcher("/api/spotify/player/transfer", {
      method: "PUT",
      body: JSON.stringify({ device_id: deviceId }),
    })),
  };
  
  useEffect(() => {
    // Initial data fetch
    fetchPlayerState();
    getDevices();

    // Set up polling
    intervalRef.current = setInterval(fetchPlayerState, REFRESH_INTERVAL);

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPlayerState, getDevices]);

  return {
    playerState,
    devices,
    controls,
    isLoading,
    error,
  };
}
