
import { useEffect, useState, useCallback, useRef } from "react";
import { 
  getTokensFromFirestore, 
  type SpotifyTokenData 
} from "@/services/spotify-token-service";


// ============================================================================
// Types & Interfaces
// ============================================================================

export interface SpotifyAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokens: SpotifyTokenData | null;
  timeToRefresh: number;
}

export interface UseSpotifyReturn {
  authState: SpotifyAuthState;
  login: () => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// ============================================================================
// Main Hook
// ============================================================================

export function useSpotify(): UseSpotifyReturn {
  const [authState, setAuthState] = useState<SpotifyAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    tokens: null,
    timeToRefresh: 0,
  });

  const isMountedRef = useRef(true);

  // ==========================================================================
  // Core Logic
  // ==========================================================================
  const updateAuthState = (tokens: SpotifyTokenData | null) => {
    if (tokens) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        tokens,
        timeToRefresh: tokens.expiresAt,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        tokens: null,
        timeToRefresh: 0,
      });
    }
  };


  const logout = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;
    setAuthState(prev => ({...prev, isLoading: true}));
    try {
      // Call the server-side endpoint to securely clear tokens
      await fetch('/api/spotify/logout', { method: 'POST' });
      if (isMountedRef.current) {
        updateAuthState(null);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      if (isMountedRef.current) {
        setAuthState(prev => ({...prev, isLoading: false, error: "Logout failed."}));
      }
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (!isMountedRef.current) return;
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
        const response = await fetch('/api/spotify/refresh', {
            method: 'POST',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to refresh token");
        }

        const { tokens: newTokens } = await response.json();

        if (isMountedRef.current) {
            updateAuthState(newTokens);
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        // This likely means the refresh token is invalid, so we log the user out
        await logout(); 
        if (isMountedRef.current) {
            setAuthState(prev => ({ ...prev, isAuthenticated: false, isLoading: false, error: "Session expired. Please log in again.", tokens: null, timeToRefresh: 0 }));
        }
    }
  }, [logout]); 

  const checkTokenStatus = useCallback(async () => {
    if (!isMountedRef.current) return;
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const tokens = await getTokensFromFirestore();
      
      if (tokens && tokens.accessToken) {
        if (Date.now() >= tokens.expiresAt) {
          // Token expired, refresh it
          await refreshToken();
        } else {
          // Token is valid
          if (isMountedRef.current) {
            updateAuthState(tokens);
          }
        }
      } else {
        // No tokens found
        if (isMountedRef.current) {
          updateAuthState(null);
        }
      }
    } catch (error) {
      console.error("Error checking token status:", error);
      if (isMountedRef.current) {
        setAuthState(prev => ({ ...prev, isAuthenticated: false, isLoading: false, error: "Failed to verify session.", tokens: null, timeToRefresh: 0 }));
      }
    }
  }, [refreshToken]);


  const login = useCallback((): void => {
    window.location.href = "/api/spotify/auth";
  }, []);

  // ==========================================================================
  // Effects
  // ==========================================================================

  useEffect(() => {
    isMountedRef.current = true;
    checkTokenStatus();

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    authState,
    login,
    logout,
    refreshToken,
  };
}
