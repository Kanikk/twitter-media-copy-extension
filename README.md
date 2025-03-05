# Twitter Media Copier

**Twitter Media Copier** is a Chrome extension that enhances your Twitter/X experience by allowing you to easily copy media content from tweets. With this extension, you can copy images directly to your clipboard as PNG files or copy tweet URLs for videos and open a downloader page in a new tab.

## Features

- **Copy Images to Clipboard:** Click the chain icon next to tweets with images to copy them as PNG files to your clipboard, ready to paste into any image editor (e.g., Paint, Photoshop).
- **Copy Video Tweet URLs:** For tweets with videos, copy the tweet URL to your clipboard and automatically open `https://ssstwitter.com/` in a new tab for downloading.

## Installation

1. **Clone or Download the Repository:**
   - Clone this repository using `git clone https://github.com/Kanikk/twitter-media-copy-extension.git` or download it as a ZIP file and extract it.

2. **Load the Extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked" and select the folder containing the extension files (`manifest.json`, `content.js`, `background.js`, and icons).

3. **Verify Installation:**
   - The extension should appear in your Chrome extensions list with the name "Twitter Media Copier" and the chain icon.

## Usage

1. **Open Twitter/X:**
   - Navigate to `https://twitter.com/` or `https://x.com/` in Chrome.

2. **Find a Tweet with Media:**
   - Scroll to a tweet containing images or a video.

3. **Click the Chain Icon:**
   - Look for the chain icon next to the bookmark button in the tweet's action bar.
   - **Images:** Click the icon to copy each image to your clipboard sequentially (the last image remains in the clipboard). Paste (Ctrl+V) into an image editor.
   - **Videos:** Click the icon to copy the tweet URL to your clipboard and open `https://ssstwitter.com/` in a new tab. Paste the URL there to download the video.

## Requirements

- **Browser:** Google Chrome (tested on version 133.0.6943.142).
- **Permissions:**
  - `activeTab`: To interact with the current tab.
  - `clipboardWrite`: To copy images and URLs to the clipboard.
  - `tabs`: To open a new tab for video downloading.

## Files

- **`manifest.json`:** Extension configuration file.
- **`content.js`:** Script that adds the chain button to tweets and handles clipboard operations.
- **`background.js`:** Script that manages opening new tabs for video downloads.
- **`icon.png`:** Extension icon.

## Contributing

Feel free to fork this repository, submit issues, or create pull requests with improvements. Suggestions for better CORS handling, multi-image clipboard support, or UI enhancements are welcome!

## License

This project is licensed under the MIT License.

## Credits

Developed by Kanikk.

---
