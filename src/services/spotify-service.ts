
/**
 * Spotify Service
 *
 * Handles Spotify authentication, token management, and automatic token refresh.
 * Provides methods for:
 * - Generating authorization URLs
 * - Exchanging authorization codes for access tokens
 * - Refreshing access tokens automatically
 * - Managing token lifecycle
 *
 * @module spotify-service
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Spotify token response from OAuth flow
 */
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

/**
 * Stored Spotify tokens with metadata
 */
export interface SpotifyTokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
  tokenType: string;
}

/**
 * Spotify authentication configuration
 */
export interface SpotifyAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

/**
 * Token refresh callback function type
 */
export type TokenRefreshCallback = (
  tokenData: SpotifyTokenData,
) => void | Promise<void>;

// ============================================================================
// Constants
// ============================================================================

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // Refresh 5 minutes before expiry

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generates a random string for PKCE state parameter
 *
 * @param length - Length of the random string
 * @returns Random string
 */
function generateRandomString(length: number): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join("");
}

/**
 * Encodes data to Base64.
 *
 * @param data - Data to encode
 * @returns Base64 encoded string
 */
function base64Encode(data: string): string {
    return Buffer.from(data).toString('base64');
}

// ============================================================================
// Main Service Class
// ============================================================================

/**
 * Spotify Service
 *
 * Manages Spotify OAuth authentication and token lifecycle.
 * Automatically refreshes tokens before expiration.
 */
export class SpotifyService {
  private config: SpotifyAuthConfig;
  private tokenData: SpotifyTokenData | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshCallback: TokenRefreshCallback | null = null;

  /**
   * Creates a new SpotifyService instance
   *
   * @param config - Spotify authentication configuration
   */
  constructor(config: SpotifyAuthConfig) {
    this.config = config;
  }

  // ==========================================================================
  // Authentication Methods
  // ==========================================================================

  /**
   * Generates Spotify authorization URL for OAuth flow
   *
   * @param state - Optional state parameter for CSRF protection
   * @returns Authorization URL and state
   */
  public generateAuthUrl(state?: string): { url: string; state: string } {
    const stateParam = state || generateRandomString(16);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: "code",
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(" "),
      state: stateParam,
    });

    const url = `${SPOTIFY_AUTH_URL}?${params.toString()}`;

    return { url, state: stateParam };
  }

  /**
   * Exchanges authorization code for access and refresh tokens
   *
   * @param code - Authorization code from OAuth callback
   * @returns Token data including access token, refresh token, and expiry
   * @throws Error if token exchange fails
   */
  public async exchangeCodeForToken(code: string): Promise<SpotifyTokenData> {
    try {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
      });

      const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Encode(`${this.config.clientId}:${this.config.clientSecret}`)}`,
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to exchange code for token: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
        );
      }

      const data: SpotifyTokenResponse = await response.json();

      if (!data.refresh_token) {
        throw new Error("No refresh token received from Spotify");
      }

      const tokenData: SpotifyTokenData = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        scope: data.scope,
        tokenType: data.token_type,
      };

      this.tokenData = tokenData;
      this.scheduleTokenRefresh();

      return tokenData;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }

  // ==========================================================================
  // Token Management Methods
  // ==========================================================================

  /**
   * Refreshes the access token using the refresh token
   *
   * @param refreshToken - Optional refresh token (uses stored token if not provided)
   * @returns Updated token data
   * @throws Error if token refresh fails
   */
  public async refreshAccessToken(
    refreshToken?: string,
  ): Promise<SpotifyTokenData> {
    const tokenToUse = refreshToken || this.tokenData?.refreshToken;

    if (!tokenToUse) {
      throw new Error("No refresh token available");
    }

    try {
      const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokenToUse,
      });

      const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Encode(`${this.config.clientId}:${this.config.clientSecret}`)}`,
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to refresh access token: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
        );
      }

      const data: SpotifyTokenResponse = await response.json();

      const tokenData: SpotifyTokenData = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || tokenToUse, // Keep old refresh token if new one not provided
        expiresAt: Date.now() + data.expires_in * 1000,
        scope: data.scope,
        tokenType: data.token_type,
      };

      this.tokenData = tokenData;
      this.scheduleTokenRefresh();

      // Call the refresh callback if registered
      if (this.refreshCallback) {
        await this.refreshCallback(tokenData);
      }

      return tokenData;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }

  /**
   * Sets the current token data and schedules automatic refresh
   *
   * @param tokenData - Token data to set
   */
  public setTokenData(tokenData: SpotifyTokenData): void {
    this.tokenData = tokenData;
    this.scheduleTokenRefresh();
  }

  /**
   * Gets the current token data
   *
   * @returns Current token data or null if not authenticated
   */
  public getTokenData(): SpotifyTokenData | null {
    return this.tokenData;
  }

  /**
   * Gets the current access token, refreshing if necessary
   *
   * @returns Valid access token
   * @throws Error if no token is available or refresh fails
   */
  public async getAccessToken(): Promise<string> {
    if (!this.tokenData) {
      throw new Error("No token data available. Please authenticate first.");
    }

    // Check if token is expired or about to expire
    if (this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    return this.tokenData!.accessToken;
  }

  /**
   * Checks if the current token is expired or about to expire
   *
   * @returns True if token is expired or expires soon
   */
  public isTokenExpired(): boolean {
    if (!this.tokenData) {
      return true;
    }

    return Date.now() >= this.tokenData.expiresAt - TOKEN_REFRESH_BUFFER_MS;
  }

  /**
   * Registers a callback to be called when tokens are refreshed
   *
   * @param callback - Function to call with new token data
   */
  public onTokenRefresh(callback: TokenRefreshCallback): void {
    this.refreshCallback = callback;
  }

  /**
   * Clears all token data and stops automatic refresh
   */
  public clearTokens(): void {
    this.tokenData = null;
    this.stopTokenRefresh();
  }

  // ==========================================================================
  // Automatic Refresh Management
  // ==========================================================================

  /**
   * Schedules automatic token refresh before expiration
   *
   * @private
   */
  private scheduleTokenRefresh(): void {
    // Clear existing timer
    this.stopTokenRefresh();

    if (!this.tokenData) {
      return;
    }

    // Calculate time until refresh (refresh 5 minutes before expiry)
    const timeUntilRefresh =
      this.tokenData.expiresAt - Date.now() - TOKEN_REFRESH_BUFFER_MS;

    if (timeUntilRefresh <= 0) {
      // Token is already expired or about to expire, refresh immediately
      this.refreshAccessToken().catch((error) => {
        console.error("Failed to refresh token automatically:", error);
      });
      return;
    }

    // Schedule refresh
    this.refreshTimer = setTimeout(() => {
      this.refreshAccessToken().catch((error) => {
        console.error("Failed to refresh token automatically:", error);
      });
    }, timeUntilRefresh);
  }

  /**
   * Stops automatic token refresh
   *
   * @private
   */
  private stopTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Cleanup method to stop all timers
   * Should be called when the service is no longer needed
   */
  public destroy(): void {
    this.stopTokenRefresh();
    this.tokenData = null;
    this.refreshCallback = null;
  }
}

// ============================================================================
// Singleton Instance Creator
// ============================================================================

/**
 * Creates a configured Spotify service instance from environment variables
 *
 * @returns Configured SpotifyService instance
 * @throws Error if required environment variables are missing
 */
export function createSpotifyService(): SpotifyService {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const scopes = process.env.NEXT_PUBLIC_SPOTIFY_SCOPES?.split(",") || [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "streaming",
  ];

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Missing required Spotify configuration. Please set NEXT_PUBLIC_SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and NEXT_PUBLIC_SPOTIFY_REDIRECT_URI environment variables.",
    );
  }

  return new SpotifyService({
    clientId,
    clientSecret,
    redirectUri,
    scopes,
  });
}

// ============================================================================
// Default Export
// ============================================================================

export default SpotifyService;
