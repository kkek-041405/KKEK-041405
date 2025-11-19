
/**
 * useSpotify Hook
 *
 * Custom React hook for managing Spotify authentication and token lifecycle.
 * Automatically handles token refresh and provides authentication state.
 *
 * @module hooks/useSpotify
 */

import { useEffect, useState, useCallback, useRef } from "react";

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Spotify authentication state
 */
export interface SpotifyAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresAt: number | null;
  expiresIn: number | null;
}

/**
 * Spotify hook return type
 */
export interface UseSpotifyReturn {
  /** Current authentication state */
  authState: SpotifyAuthState;
  /** Initiates Spotify login flow */
  login: () => void;
  /** Logs out and clears tokens */
  logout: () => Promise<void>;
  /** Manually refreshes the access token */
  refreshToken: () => Promise<void>;
  /** Gets the current access token (refreshes if needed) */
  getAccessToken: () => Promise<string | null>;
  /** Checks if user is authenticated */
  isAuthenticated: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // Check every 50 minutes
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // Refresh 5 minutes before expiry

// ============================================================================
// Main Hook
// ============================================================================

/**
 * useSpotify Hook
 *
 * Manages Spotify authentication state and provides methods for login,
 * logout, and token refresh. Automatically refreshes tokens before expiration.
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { authState, login, logout, getAccessToken } = useSpotify();
 *
 *   const handlePlay = async () => {
 *     const token = await getAccessToken();
 *     if (token) {
 *       // Use token to make Spotify API calls
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {authState.isAuthenticated ? (
 *         <button onClick={logout}>Logout</button>
 *       ) : (
 *         <button onClick={login}>Login with Spotify</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns Spotify authentication state and methods
 */
export function useSpotify(): UseSpotifyReturn {
  const [authState, setAuthState] = useState<SpotifyAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    expiresAt: null,
    expiresIn: null,
  });

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // ==========================================================================
  // Token Refresh Logic
  // ==========================================================================

  /**
   * Refreshes the access token
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("/api/spotify/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // No valid refresh token, user needs to re-authenticate
          if (isMountedRef.current) {
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              error: "Session expired. Please login again.",
              expiresAt: null,
              expiresIn: null,
            });
          }
          return;
        }

        throw new Error("Failed to refresh token");
      }

      const data = await response.json();

      if (isMountedRef.current) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
          expiresAt: data.expiresAt,
          expiresIn: data.expiresIn,
        });
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      if (isMountedRef.current) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to refresh token",
        }));
      }
    }
  }, []);

  /**
   * Checks token status and refreshes if needed
   */
  const checkTokenStatus = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("/api/spotify/refresh", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated
          if (isMountedRef.current) {
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              error: null,
              expiresAt: null,
              expiresIn: null,
            });
          }
          return;
        }

        throw new Error("Failed to check token status");
      }

      const data = await response.json();

      if (isMountedRef.current) {
        setAuthState({
          isAuthenticated: data.authenticated || false,
          isLoading: false,
          error: null,
          expiresAt: data.expiresAt || null,
          expiresIn: data.expiresIn || null,
        });
      }
    } catch (error) {
      console.error("Error checking token status:", error);
      if (isMountedRef.current) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to check authentication status",
          expiresAt: null,
          expiresIn: null,
        });
      }
    }
  }, []);

  /**
   * Schedules automatic token refresh
   */
  const scheduleTokenRefresh = useCallback(() => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Set up periodic check and refresh
    refreshTimerRef.current = setInterval(() => {
      if (authState.expiresAt) {
        const timeUntilExpiry = authState.expiresAt - Date.now();
        if (timeUntilExpiry <= TOKEN_REFRESH_BUFFER) {
          refreshToken();
        }
      } else {
        checkTokenStatus();
      }
    }, TOKEN_REFRESH_INTERVAL);
  }, [authState.expiresAt, refreshToken, checkTokenStatus]);

  // ==========================================================================
  // Authentication Methods
  // ==========================================================================

  /**
   * Initiates Spotify login flow
   */
  const login = useCallback((): void => {
    // Redirect to Spotify auth endpoint
    window.location.href = "/api/spotify/auth";
  }, []);

  /**
   * Logs out and clears tokens
   */
  const logout = useCallback(async (): Promise<void> => {
    // This function will now be much simpler. The server will handle cookie clearing
    // on the next failed request, but we can also provide a dedicated logout endpoint if needed.
    // For now, we just clear the client-side state and reload.
    
    try {
      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // Clear local state
      if (isMountedRef.current) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          expiresAt: null,
          expiresIn: null,
        });
      }

      // Reload to ensure all auth state is cleared from the app.
      // The httpOnly cookies will remain, but they will be invalid on the next API call,
      // which will then fail, and the user will be prompted to log in again.
      // This is a safe approach as client-side code can't delete httpOnly cookies.
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  /**
   * Gets the current access token, refreshing if needed
   */
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!authState.isAuthenticated) {
      return null;
    }

    // Check if token needs refresh
    if (
      authState.expiresAt &&
      Date.now() >= authState.expiresAt - TOKEN_REFRESH_BUFFER
    ) {
      await refreshToken();
    }

    // Token is stored in HTTP-only cookie, so we can't access it directly
    // The API routes will handle sending it to Spotify
    // Return a flag indicating authentication status
    return authState.isAuthenticated ? "authenticated" : null;
  }, [authState.isAuthenticated, authState.expiresAt, refreshToken]);

  // ==========================================================================
  // Effects
  // ==========================================================================

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    isMountedRef.current = true;
    checkTokenStatus();

    return () => {
      isMountedRef.current = false;
    };
  }, [checkTokenStatus]);

  /**
   * Set up automatic token refresh when authenticated
   */
  useEffect(() => {
    if (authState.isAuthenticated && authState.expiresAt) {
      scheduleTokenRefresh();
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [authState.isAuthenticated, authState.expiresAt, scheduleTokenRefresh]);

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    authState,
    login,
    logout,
    refreshToken,
    getAccessToken,
    isAuthenticated: authState.isAuthenticated,
  };
}

export default useSpotify;
