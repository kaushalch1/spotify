# Spokify

Spokify is a Chrome extension that enables users to search YouTube music and play audio from a browser popup. It uses a Node.js backend for YouTube search, audio extraction, and Socket.IO-based room synchronization.

## Current limitation

The room and synchronized playback features are currently unavailable. Shared playback depends on server-side audio extraction with `yt-dlp`, and YouTube may block requests from the server with a bot-check message such as:

```text
Sign in to confirm you're not a bot
```

Updating `yt-dlp` does not reliably resolve this issue. Browser cookies must not be uploaded to the server. Search may continue to function, but audio playback and synchronized rooms may fail when YouTube blocks the server.

## Features

- Search YouTube music from the extension popup.
- Quick searches for lofi, pop, chill, and workout music.
- Display search suggestions and video titles.
- Play and pause audio from the extension popup.
- Seek through the current audio track.
- Cache extracted audio URLs while the server is running.
- Socket.IO infrastructure for shared rooms and playback synchronization; this feature is currently unavailable because of YouTube restrictions.
- Chrome Manifest V3 background and offscreen audio support.
- Optional deployment to another machine or server by changing the backend URL.

## Requirements

- Windows, macOS, or Linux
- Node.js 18 or newer
- npm
- Google Cloud YouTube Data API v3 key
- Google Chrome or another Chromium browser

## quick start


1. Install Node.js 18 or later from [nodejs.org](https://nodejs.org/).
2. Download or clone this repository.
3. Open PowerShell or another terminal in the project directory.
4. Install the dependencies:

	```powershell
	npm install
	```

5. Create a YouTube Data API v3 key in Google Cloud and enable **YouTube Data API v3** for the relevant project.
6. Create a file named `.env` in the project folder with:

	```env
	apiKey=THE_REVIEWER_API_KEY
	PORT=3000
	```

7. Start the backend:

	```powershell
	node app.js
	```

	A successful startup displays `Server is running on PORT:3000`.

8. Verify the backend by opening this URL in a browser:

	```text
	http://localhost:3000/api/song?q=music
	```

	A JSON response containing YouTube results confirms that the backend is operating correctly.

9. Open Chrome and visit `chrome://extensions`.
10. Enable **Developer mode**, click **Load unpacked**, and select the project folder.
11. Open Spokify, search for a song, and select a result.

The `node app.js` process must remain running during testing. The API key must not be added to extension files, committed to Git, or shared with other users.


## Project structure

```text
app.js             Express and Socket.IO server
background.js      Chrome extension service worker
index.html         Extension popup UI
offscreen.html     Offscreen audio document
index.js           Popup behavior and API requests
offscreen.js       Audio and Socket.IO behavior
manifest.json      Chrome extension configuration
style.css          Popup styles
socket.io.min.js   Browser Socket.IO client
package.json       Node.js dependencies and scripts
```

## Run the server locally

Open PowerShell in the project folder:

```powershell
cd "C:\html projects\spotify"
npm install
```

Create a `.env` file in the project root. Do not commit this file or share your API key.

```env
apiKey=YOUR_YOUTUBE_API_KEY
PORT=3000
```

Start the server:

```powershell
node app.js
```

A successful start prints:

```text
Server is running on PORT:3000
```

For development with automatic restart:

```powershell
npm run dev
```

Test the search API in a browser or PowerShell:

```text
http://localhost:3000/api/song?q=music
```

PowerShell alternative:

```powershell
Invoke-WebRequest "http://localhost:3000/api/song?q=music" | Select-Object -ExpandProperty Content
```

## Load the extension locally

Keep the Node server running, then:

1. Open Chrome.
2. Visit `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder: `C:\html projects\spotify`.
6. Click the Spokify extension icon.
7. Search for a song and select a result.

After changing `manifest.json` or extension JavaScript, return to `chrome://extensions` and click **Reload**.

The current local configuration uses:

```text
http://localhost:3000
```

The extension and the Node server must run on the same computer for this configuration to work.


## API endpoints

### `GET /api/song?q=QUERY`

Searches YouTube using the configured YouTube Data API key and returns up to 12 video results.

Example:

```text
http://localhost:3000/api/song?q=chill%20music
```

### `GET /api/playsong?v=VIDEO_ID`

Uses `yt-dlp` to find an audio stream and proxies it to the extension. This endpoint can fail when YouTube blocks the server with a bot check.

## Troubleshooting

### `Failed to fetch` or `Bad Gateway`

Confirm that `node app.js` is still running and that the extension URL matches the server URL in `manifest.json` and `index.js`.

### `The YouTube API key is not configured`

Confirm that `.env` exists in the same folder as `app.js` and contains:

```env
apiKey=YOUR_YOUTUBE_API_KEY
```

Restart the server after changing `.env`.

### `Sign in to confirm you're not a bot`

YouTube is blocking `yt-dlp`. This is a hosting and YouTube restriction, not an extension syntax error. Search may continue to work while audio playback and room synchronization remain unavailable.

### `Receiving end does not exist`

Reload the extension from `chrome://extensions`, close the popup, and open it again. This usually means the extension's offscreen document was not ready.


This project uses the license specified in `package.json`.
