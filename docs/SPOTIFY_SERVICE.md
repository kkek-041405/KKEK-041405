# Spotify Service Documentation

Comprehensive guide for using the Spotify authentication service in your Next.js application.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Service Architecture](#service-architecture)
- [Usage Examples](#usage-examples)
- [API Routes](#api-routes)
- [React Hook](#react-hook)
- [Token Management](#token-management)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Spotify Service provides a complete OAuth 2.0 authentication flow for Spotify, including:

- ✅ Authorization URL generation
- ✅ Authorization code exchange for access tokens
- ✅ Automatic token refresh before expiration
- ✅ Secure token storage in HTTP-only cookies
- ✅ React hook for easy integration
- ✅ TypeScript type safety

---

## Setup

### 1. Create Spotify Application

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the details:
   - **App Name**: Your application name
   - **App Description**: Brief description
   - **Redirect URI**: `http://localhost:9002/api/spotify/callback` (for development)
4. Save your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Spotify API Configuration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:9002/api/spotify/callback
NEXT_PUBLIC_SPOTIFY_SCOPES=user-read-private,user-read-email,user-library-read,user-read-playback-state,user-modify-playback-state,streaming
```

### 3. Update Redirect URI for Production

For production, update the redirect URI in both:
- Spotify Dashboard
- Environment variables (`.env.production`)

```env
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/spotify/callback
```

---

## Service Architecture

### File Structure

```
src/
├── services/
│   └── spotify-service.ts          # Core Spotify service
├── hooks/
│   └── useSpotify.ts               # React hook for components
└── app/
    └── api/
        └── spotify/
            ├── auth/
            │   └── route.ts        # Auth initialization
            ├── callback/
            │   └── route.ts        # OAuth callback handler
            └── refresh/
                └── route.ts        # Token refresh endpoint
```

### Component Diagram

```
┌─────────────────┐
│  React Component │
└────────┬─────────┘
         │
         │ uses
         ▼
┌─────────────────┐
│  useSpotify()   │ ◄─── React Hook
└────────┬─────────┘
         │
         │ calls
         ▼
┌─────────────────┐
│   API Routes    │ ◄─── Next.js API
└────────┬─────────┘
         │
         │ uses
         ▼
┌─────────────────┐
│ SpotifyService  │ ◄─── Core Service
└────────┬─────────┘
         │
         │ calls
         ▼
┌─────────────────┐
│  Spotify API    │ ◄─── External API
└─────────────────┘
```

---

## Usage Examples

### 1. Basic Authentication

```tsx
// src/app/components/SpotifyLoginButton.tsx
'use client';

import { useSpotify } from '@/hooks/useSpotify';

export function SpotifyLoginButton() {
  const { authState, login, logout } = useSpotify();

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (authState.isAuthenticated) {
    return (
      <div>
        <p>Connected to Spotify ✓</p>
        <button onClick={logout}>Disconnect</button>
      </div>
    );
  }

  return (
    <button onClick={login}>
      Connect with Spotify
    </button>
  );
}
```

### 2. Making Authenticated API Calls

```tsx
// src/app/components/CurrentlyPlaying.tsx
'use client';

import { useSpotify } from '@/hooks/useSpotify';
import { useEffect, useState } from 'react';

export function CurrentlyPlaying() {
  const { isAuthenticated, getAccessToken } = useSpotify();
  const [track, setTrack] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCurrentTrack = async () => {
      // Token is automatically managed and refreshed
      const token = await getAccessToken();
      
      // Make API call through your backend to avoid exposing token
      const response = await fetch('/api/spotify/currently-playing', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrack(data);
      }
    };

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, getAccessToken]);

  if (!track) return <div>No track playing</div>;

  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.artists.join(', ')}</p>
    </div>
  );
}
```

### 3. Direct Service Usage (Server-Side)

```tsx
// src/app/api/spotify/currently-playing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSpotifyService } from '@/services/spotify-service';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('spotify_access_token')?.value;
    const refreshToken = request.cookies.get('spotify_refresh_token')?.value;
    
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if token needs refresh
    const expiresAt = parseInt(
      request.cookies.get('spotify_token_expires_at')?.value || '0'
    );
    
    let token = accessToken;
    
    if (Date.now() >= expiresAt - 5 * 60 * 1000) {
      // Token expired, refresh it
      const spotifyService = createSpotifyService();
      const tokenData = await spotifyService.refreshAccessToken(refreshToken);
      token = tokenData.accessToken;
    }

    // Call Spotify API
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch currently playing track');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch track' },
      { status: 500 }
    );
  }
}
```

### 4. Programmatic Token Management

```tsx
// Advanced usage with custom token storage
import { SpotifyService } from '@/services/spotify-service';

const spotifyService = new SpotifyService({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
  scopes: [
    'user-read-private',
    'user-read-email',
    'streaming',
  ],
});

// Register callback for token refresh
spotifyService.onTokenRefresh(async (tokenData) => {
  console.log('Token refreshed!', tokenData);
  // Save to database, update state, etc.
  await saveTokenToDatabase(tokenData);
});

// Load existing tokens
const savedToken = await loadTokenFromDatabase();
if (savedToken) {
  spotifyService.setTokenData(savedToken);
}

// Get access token (auto-refreshes if needed)
const accessToken = await spotifyService.getAccessToken();
```

---

## API Routes

### GET /api/spotify/auth

Initiates the Spotify OAuth flow.

**Response**: Redirects to Spotify authorization page

**Example**:
```tsx
window.location.href = '/api/spotify/auth';
```

---

### GET /api/spotify/callback

Handles OAuth callback and exchanges code for tokens.

**Query Parameters**:
- `code` - Authorization code from Spotify
- `state` - CSRF protection state parameter

**Response**: Redirects to `/auth/success` or `/auth/error`

**Cookies Set**:
- `spotify_access_token` (1 hour)
- `spotify_refresh_token` (30 days)
- `spotify_token_expires_at` (1 hour)

---

### POST /api/spotify/refresh

Manually refreshes the access token.

**Request**: No body required (uses cookies)

**Response**:
```json
{
  "success": true,
  "expiresAt": 1234567890000,
  "expiresIn": 3600
}
```

**Error Response**:
```json
{
  "error": "Failed to refresh token",
  "message": "Detailed error message"
}
```

---

### GET /api/spotify/refresh

Checks token status and auto-refreshes if needed.

**Response**:
```json
{
  "authenticated": true,
  "expiresAt": 1234567890000,
  "expiresIn": 3600
}
```

---

## React Hook

### useSpotify()

Custom React hook for managing Spotify authentication in components.

#### Return Values

```typescript
interface UseSpotifyReturn {
  authState: {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    expiresAt: number | null;
    expiresIn: number | null;
  };
  login: () => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  isAuthenticated: boolean;
}
```

#### Example

```tsx
const {
  authState,      // Current auth state
  login,          // Start login flow
  logout,         // Logout user
  refreshToken,   // Manually refresh token
  getAccessToken, // Get valid token
  isAuthenticated // Shortcut for authState.isAuthenticated
} = useSpotify();
```

---

## Token Management

### Automatic Refresh

Tokens are automatically refreshed:
- **5 minutes before expiration** (configurable)
- **Every 50 minutes** (periodic check)
- **On-demand** when `getAccessToken()` is called

### Token Storage

Tokens are stored in secure HTTP-only cookies:

| Cookie | Duration | Purpose |
|--------|----------|---------|
| `spotify_access_token` | 1 hour | Current access token |
| `spotify_refresh_token` | 30 days | Long-lived refresh token |
| `spotify_token_expires_at` | 1 hour | Token expiration timestamp |

### Manual Refresh

```tsx
// In a component
const { refreshToken } = useSpotify();
await refreshToken();

// Or via API
await fetch('/api/spotify/refresh', { 
  method: 'POST',
  credentials: 'include'
});
```

---

## Best Practices

### 1. Security

✅ **DO**:
- Store tokens in HTTP-only cookies
- Use CSRF protection (state parameter)
- Keep `SPOTIFY_CLIENT_SECRET` secure
- Validate state parameter in callback
- Use HTTPS in production

❌ **DON'T**:
- Store tokens in localStorage
- Expose tokens in client-side code
- Commit secrets to git
- Skip state validation

### 2. Error Handling

```tsx
const { authState, login } = useSpotify();

if (authState.error) {
  // Handle authentication errors
  console.error('Auth error:', authState.error);
  
  if (authState.error.includes('expired')) {
    // Prompt user to re-authenticate
    login();
  }
}
```

### 3. Token Refresh

```tsx
// Automatic refresh is handled by the hook
// But you can force a refresh if needed
const { refreshToken } = useSpotify();

try {
  await refreshToken();
} catch (error) {
  console.error('Failed to refresh:', error);
  // Handle refresh failure (e.g., redirect to login)
}
```

### 4. Scope Management

Request only the scopes you need:

```env
# Minimal scopes
NEXT_PUBLIC_SPOTIFY_SCOPES=user-read-private,user-read-email

# Full player control
NEXT_PUBLIC_SPOTIFY_SCOPES=user-read-private,user-read-email,user-library-read,user-read-playback-state,user-modify-playback-state,streaming
```

---

## Troubleshooting

### Token Not Refreshing

**Problem**: Token expires but doesn't auto-refresh

**Solution**:
1. Check that `useSpotify()` hook is mounted
2. Verify refresh token is present in cookies
3. Check console for refresh errors
4. Ensure API route `/api/spotify/refresh` is accessible

### Redirect URI Mismatch

**Problem**: Error: `redirect_uri_mismatch`

**Solution**:
1. Ensure URIs match exactly in:
   - Spotify Dashboard
   - Environment variable
   - No trailing slashes
2. Example: `http://localhost:9002/api/spotify/callback`

### CORS Errors

**Problem**: CORS errors when calling Spotify API

**Solution**:
- Never call Spotify API directly from client
- Always proxy through your API routes
- Use `credentials: 'include'` in fetch calls

### Invalid Client Error

**Problem**: Error: `invalid_client`

**Solution**:
1. Verify `SPOTIFY_CLIENT_SECRET` is correct
2. Check Base64 encoding of credentials
3. Ensure no extra spaces in environment variables

### Session Expired

**Problem**: User logged out unexpectedly

**Solution**:
1. Check cookie expiration settings
2. Verify refresh token is valid
3. Implement proper error handling:

```tsx
const { authState, login } = useSpotify();

useEffect(() => {
  if (authState.error?.includes('expired')) {
    // Auto-redirect to login
    login();
  }
}, [authState.error, login]);
```

---

## Advanced Topics

### Custom Token Storage

```typescript
// Store tokens in database instead of cookies
import { SpotifyService } from '@/services/spotify-service';
import { prisma } from '@/lib/prisma';

const spotifyService = new SpotifyService(config);

spotifyService.onTokenRefresh(async (tokenData) => {
  await prisma.spotifyToken.upsert({
    where: { userId },
    update: tokenData,
    create: { userId, ...tokenData },
  });
});
```

### Multiple Users

```typescript
// Manage tokens for multiple users
import { SpotifyService } from '@/services/spotify-service';

const userServices = new Map<string, SpotifyService>();

function getSpotifyService(userId: string): SpotifyService {
  if (!userServices.has(userId)) {
    const service = new SpotifyService(config);
    // Load user's tokens from database
    const tokens = await loadUserTokens(userId);
    service.setTokenData(tokens);
    userServices.set(userId, service);
  }
  return userServices.get(userId)!;
}
```

### Webhook Integration

```typescript
// Handle Spotify webhooks for real-time updates
// src/app/api/spotify/webhook/route.ts
export async function POST(request: NextRequest) {
  const event = await request.json();
  
  // Process Spotify events
  switch (event.type) {
    case 'track.changed':
      // Update UI, save to database, etc.
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

---

## Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [OAuth 2.0 Authorization Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [Available Scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes)
- [API Reference](https://developer.spotify.com/documentation/web-api/reference)

---

## Support

For issues or questions:
1. Check this documentation
2. Review console errors
3. Check Spotify API status
4. Verify environment variables
5. Test with Spotify's API console

---

**Last Updated**: 2024
**Version**: 1.0.0