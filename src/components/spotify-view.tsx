
"use client";

import { useSpotify, type SpotifyAuthState } from "@/hooks/useSpotify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Music, Power, PowerOff } from "lucide-react";

export default function SpotifyView() {
  const { authState, login, logout } = useSpotify();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4">
            <Music className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Spotify Control</CardTitle>
          <CardDescription className="text-md">
            Connect your Spotify account to control playback and view what's playing.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {authState.isLoading ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Checking connection...</span>
            </div>
          ) : authState.isAuthenticated ? (
            <div className="text-center space-y-4">
              <p className="text-lg font-medium text-green-500">
                ✓ Successfully connected to Spotify
              </p>
              {/* Placeholder for player controls */}
              <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                Player controls will appear here.
              </div>
              <Button variant="destructive" onClick={logout} className="w-full">
                <PowerOff className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
                 <p className="text-lg font-medium text-destructive">
                    Not connected to Spotify
                </p>
              <Button onClick={login} className="w-full bg-green-600 hover:bg-green-700">
                <Power className="mr-2 h-4 w-4" />
                Connect with Spotify
              </Button>
            </div>
          )}
          {authState.error && (
            <p className="text-sm text-destructive">{authState.error}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
