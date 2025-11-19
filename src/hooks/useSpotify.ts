
import { useEffect, useState, useCallback, useRef } from "react";
import { 
  getTokensFromFirestore, 
  deleteTokensFromFirestore,
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
  });

  const isMountedRef = useRef(true);

  // ==========================================================================
  // Core Logic
  // ==========================================================================

  const refreshToken = useCallback(async () => {
    if (!isMountedRef.current) return;
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
        const response = await fetch('/api/spotify/refresh', {
            method: 'POST'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to refresh token");
        }

        const { tokens: newTokens } = await response.json();

        if (isMountedRef.current) {
            setAuthState({ isAuthenticated: true, isLoading: false, error: null, tokens: newTokens });
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        // This likely means the refresh token is invalid, so we log the user out
        await logout(); 
        if (isMountedRef.current) {
            setAuthState({ isAuthenticated: false, isLoading: false, error: "Session expired. Please log in again.", tokens: null });
        }
    }
  }, []);

  const checkTokenStatus = useCallback(async () => {
    if (!isMountedRef.current) return;
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const tokens = await getTokensFromFirestore();
      if (tokens) {
        if (Date.now() >= tokens.expiresAt) {
          // Token expired, refresh it by calling our new API endpoint
          await refreshToken();
        } else {
          // Token is valid
          if (isMountedRef.current) {
            setAuthState({ isAuthenticated: true, isLoading: false, error: null, tokens });
          }
        }
      } else {
        // No tokens found
        if (isMountedRef.current) {
          setAuthState({ isAuthenticated: false, isLoading: false, error: null, tokens: null });
        }
      }
    } catch (error) {
      console.error("Error checking token status:", error);
      if (isMountedRef.current) {
        setAuthState({ isAuthenticated: false, isLoading: false, error: "Failed to verify session.", tokens: null });
      }
    }
  }, [refreshToken]);


  const login = useCallback((): void => {
    window.location.href = "/api/spotify/auth";
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;
    try {
      // Call the server-side endpoint to securely clear tokens
      await fetch('/api/spotify/logout', { method: 'POST' });
      if (isMountedRef.current) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          tokens: null,
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      if (isMountedRef.current) {
        setAuthState(prev => ({...prev, error: "Logout failed."}));
      }
    }
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
  }, [checkTokenStatus]);


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

export default useSpotify;
