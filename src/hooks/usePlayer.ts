
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { SpotifyPlayerState, SpotifyDevice } from "@/lib/spotify-types";
import { useSpotify } from "./useSpotify";

const POLLING_INTERVAL = 3000; // Poll every 3 seconds

export function usePlayer() {
  const { authState } = useSpotify();
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPlayerState = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    try {
      const res = await fetch("/api/spotify/player");
      if (res.ok) {
        if (res.status === 204) {
           setPlayerState(null);
        } else {
            const data: SpotifyPlayerState = await res.json();
            setPlayerState(data);
        }
      } else {
        setError("Failed to fetch player state.");
      }
    } catch (e) {
      setError("Error fetching player state.");
    } finally {
      setIsLoading(false);
    }
  }, [authState.isAuthenticated]);

  const fetchDevices = useCallback(async () => {
    if (!authState.isAuthenticated) return;
     try {
      const res = await fetch("/api/spotify/player/devices");
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices);
      }
    } catch (e) {
      console.error("Error fetching devices", e);
    }
  },[authState.isAuthenticated]);


  useEffect(() => {
    if (!authState.isAuthenticated) return;

    fetchPlayerState();
    fetchDevices();

    const startPolling = () => {
       if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
      pollTimeoutRef.current = setTimeout(async () => {
        if (document.hasFocus()) { // Only poll if the window is focused
            await fetchPlayerState();
        }
        startPolling();
      }, POLLING_INTERVAL);
    };

    startPolling();

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [authState.isAuthenticated, fetchPlayerState, fetchDevices]);

  // --- Player Controls ---

  const sendCommand = async (endpoint: string, method: "POST" | "PUT" = "PUT", body?: any) => {
    try {
      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      // After a command, refresh state immediately
      setTimeout(fetchPlayerState, 300);
    } catch (err) {
      console.error(`Failed to send command to ${endpoint}`, err);
    }
  };

  const play = useCallback((options?: { context_uri?: string; uris?: string[], offset?: { uri: string }}) => {
     sendCommand("/api/spotify/player/play", "PUT", options);
  }, []);
  
  const pause = useCallback(() => sendCommand("/api/spotify/player/pause"), []);
  
  const togglePlayPause = useCallback(() => {
    if (playerState?.is_playing) {
      pause();
    } else {
      play();
    }
  }, [playerState, play, pause]);

  const skipNext = useCallback(() => sendCommand("/api/spotify/player/next", "POST"), []);
  const skipPrevious = useCallback(() => sendCommand("/api/spotify/player/previous", "POST"), []);
  
  const toggleShuffle = useCallback(() => {
    const currentState = playerState?.shuffle_state ?? false;
    sendCommand(`/api/spotify/player/shuffle?state=${!currentState}`);
  }, [playerState]);

  const cycleRepeatMode = useCallback(() => {
    const current = playerState?.repeat_state ?? "off";
    const nextState = current === "off" ? "context" : current === "context" ? "track" : "off";
    sendCommand(`/api/spotify/player/repeat?state=${nextState}`);
  }, [playerState]);

  const seek = useCallback((positionPercent: number) => {
    if (!playerState?.item) return;
    const position_ms = Math.round(playerState.item.duration_ms * (positionPercent / 100));
    sendCommand(`/api/spotify/player/seek?position_ms=${position_ms}`);
  }, [playerState]);

  const setVolume = useCallback((volumePercent: number) => {
    sendCommand(`/api/spotify/player/volume?volume_percent=${Math.round(volumePercent)}`);
  }, []);

  const transferPlayback = useCallback(async (deviceId: string) => {
    await sendCommand("/api/spotify/player/transfer", "PUT", { device_id: deviceId });
    // After transferring, also refresh devices list
    setTimeout(fetchDevices, 300);
  }, [fetchDevices]);

  return {
    playerState,
    devices,
    isLoading,
    error,
    play,
    pause,
    togglePlayPause,
    skipNext,
    skipPrevious,
    toggleShuffle,
    cycleRepeatMode,
    seek,
    setVolume,
    transferPlayback
  };
}
