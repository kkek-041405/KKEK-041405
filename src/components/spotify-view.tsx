
"use client";

import { useSpotify } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Music,
  Power,
  PowerOff,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { SpotifyTokenData } from "@/services/spotify-token-service";


// Login View
function SpotifyLogin({
  login,
  error,
}: {
  login: () => void;
  error: string | null;
}) {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4">
          <Music className="h-10 w-10 text-green-500" />
        </div>
        <CardTitle className="text-2xl md:text-3xl">Spotify Control</CardTitle>
        <CardDescription className="text-md">
          Connect your Spotify account to store tokens in Firestore and control playback.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <Button
          onClick={login}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Power className="mr-2 h-4 w-4" />
          Connect with Spotify
        </Button>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}

// Authenticated View
function AuthenticatedSpotifyView({
  logout,
  tokens,
  refreshToken,
}: {
  logout: () => void;
  tokens: SpotifyTokenData;
  refreshToken: () => Promise<void>;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (tokens.expiresAt) {
      const calculateTimeLeft = () => {
        const secondsLeft = Math.round((tokens.expiresAt - Date.now()) / 1000);
        setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
      };

      calculateTimeLeft();
      const interval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [tokens.expiresAt]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshToken();
    setIsRefreshing(false);
  };
  
  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds < 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6 flex flex-col items-center w-full max-w-lg">
      <Card className="w-full rounded-xl shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Spotify Session Active
          </CardTitle>
          <CardDescription>
            Your tokens are stored securely in Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm break-all">
          <div>
            <h4 className="font-semibold text-muted-foreground">Access Token</h4>
            <p className="font-mono text-xs p-2 bg-muted rounded-md">{tokens.accessToken}</p>
          </div>
          <div>
            <h4 className="font-semibold text-muted-foreground">Refresh Token</h4>
            <p className="font-mono text-xs p-2 bg-muted rounded-md">{tokens.refreshToken}</p>
          </div>
           <div className="flex items-center justify-between pt-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time until next refresh:
            </span>
            <span className="font-mono text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full sm:w-auto">
                {isRefreshing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh Now
            </Button>
            <Button variant="destructive" onClick={logout} className="w-full sm:w-auto">
                <PowerOff className="mr-2 h-4 w-4" />
                Disconnect
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


// Main View Component
export default function SpotifyView() {
  const { authState, login, logout, refreshToken } = useSpotify();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {authState.isLoading ? (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Checking session...</span>
        </div>
      ) : authState.isAuthenticated && authState.tokens ? (
        <AuthenticatedSpotifyView
          logout={logout}
          tokens={authState.tokens}
          refreshToken={refreshToken}
        />
      ) : (
        <SpotifyLogin login={login} error={authState.error} />
      )}
    </main>
  );
}
