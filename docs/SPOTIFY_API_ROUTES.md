# Spotify API Routes Documentation

This document outlines all the available API routes for the Spotify integration in this application. These routes act as a secure backend proxy to interact with the official Spotify Web API.

---

## Table of Contents

- [Authentication Routes](#authentication-routes)
- [User Data Routes](#user-data-routes)
- [Player Control Routes](#player-control-routes)
- [Playlist Routes](#playlist-routes)

---

## Authentication Routes

These routes handle the OAuth 2.0 flow for authenticating the user with Spotify.

### `GET /api/spotify/auth`

-   **Functionality**: Initiates the Spotify authentication process.
-   **Action**: Generates a Spotify authorization URL and redirects the user to it.
-   **File**: `src/app/api/spotify/auth/route.ts`

### `GET /api/spotify/callback`

-   **Functionality**: Handles the callback from Spotify after the user grants permission.
-   **Action**: It receives an authorization `code`, exchanges it for an `access_token` and `refresh_token`, and securely stores these tokens in Firestore. It then redirects the user to the main Spotify content page.
-   **File**: `src/app/api/spotify/callback/route.ts`

### `POST /api/spotify/refresh`

-   **Functionality**: Refreshes an expired access token.
-   **Action**: Uses the stored `refresh_token` to request a new `access_token` from Spotify and updates the tokens in Firestore.
-   **File**: `src/app/api/spotify/refresh/route.ts`

### `POST /api/spotify/logout`

-   **Functionality**: Logs the user out of the Spotify integration.
-   **Action**: Deletes the user's Spotify tokens from Firestore, effectively ending their session.
-   **File**: `src/app/api/spotify/logout/route.ts`

---

## User Data Routes

These routes fetch data related to the authenticated user's Spotify account.

### `GET /api/spotify/me/playlists`

-   **Functionality**: Fetches all playlists created or followed by the current user.
-   **Action**: Supports `limit` and `offset` query parameters for pagination.
-   **File**: `src/app/api/spotify/me/playlists/route.ts`

### `GET /api/spotify/me/tracks`

-   **Functionality**: Fetches all the songs the user has "Liked".
-   **Action**: Automatically handles pagination to retrieve all liked songs, not just the first page.
-   **File**: `src/app/api/spotify/me/tracks/route.ts`

---

## Player Control Routes

These routes are used to control the Spotify player on any of the user's active devices.

### `GET /api/spotify/player`

-   **Functionality**: Gets the current state of the user's Spotify player.
-   **Action**: Returns detailed information, including the currently playing track, playback status (playing/paused), progress, device, shuffle, and repeat state. Returns `204 No Content` if nothing is playing.
-   **File**: `src/app/api/spotify/player/route.ts`

### `PUT /api/spotify/player/play`

-   **Functionality**: Starts or resumes playback.
-   **Action**: Can optionally accept a request body with `uris` (to play specific tracks) or a `context_uri` (to play a playlist or album).
-   **File**: `src/app/api/spotify/player/play/route.ts`

### `PUT /api/spotify/player/pause`

-   **Functionality**: Pauses the current playback.
-   **File**: `src/app/api/spotify/player/pause/route.ts`

### `POST /api/spotify/player/next`

-   **Functionality**: Skips to the next track in the queue.
-   **File**: `src/app/api/spotify/player/next/route.ts`

### `POST /api/spotify/player/previous`

-   **Functionality**: Skips to the previously played track.
-   **File**: `src/app/api/spotify/player/previous/route.ts`

### `GET /api/spotify/player/devices`

-   **Functionality**: Fetches all devices available for playback for the current user.
-   **File**: `src/app/api/spotify/player/devices/route.ts`

### `PUT /api/spotify/player/transfer`

-   **Functionality**: Transfers playback to a different device.
-   **Action**: Requires a `device_id` in the request body.
-   **File**: `src/app/api/spotify/player/transfer/route.ts`

### `PUT /api/spotify/player/seek`

-   **Functionality**: Seeks to a specific position in the currently playing track.
-   **Action**: Requires a `position_ms` (milliseconds) query parameter.
-   **File**: `src/app/api/spotify/player/seek/route.ts`

### `PUT /api/spotify/player/shuffle`

-   **Functionality**: Toggles shuffle mode on or off.
-   **Action**: Requires a `state` (true or false) query parameter.
-   **File**: `src/app/api/spotify/player/shuffle/route.ts`

### `PUT /api/spotify/player/repeat`

-   **Functionality**: Sets the repeat mode.
-   **Action**: Requires a `state` query parameter (`track`, `context`, or `off`).
-   **File**: `src/app/api/spotify/player/repeat/route.ts`

### `PUT /api/spotify/player/volume`

-   **Functionality**: Sets the volume for the current playback device.
-   **Action**: Requires a `volume_percent` (0-100) query parameter.
-   **File**: `src/app/api/spotify/player/volume/route.ts`

---

## Playlist Routes

These routes handle fetching playlist-specific information.

### `GET /api/spotify/playlists/[playlistId]`

-   **Functionality**: Fetches the details and track list for a single, specific playlist.
-   **Action**: Uses the dynamic `playlistId` from the URL to request the correct playlist from Spotify.
-   **File**: `src/app/api/spotify/playlists/[playlistId]/route.ts`
