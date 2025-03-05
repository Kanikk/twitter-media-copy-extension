function addDownloadIcons() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');

    tweets.forEach(tweet => {
        const mediaContainer = tweet.querySelector('[data-testid="tweetPhoto"]');
        const images = mediaContainer ? Array.from(mediaContainer.querySelectorAll('img')) : [];
        const video = tweet.querySelector('video');
        const bookmarkButton = tweet.querySelector('[data-testid="bookmark"]');

        if ((images.length > 0 || video) && bookmarkButton && !tweet.querySelector('.download-icon')) {
            const downloadButton = document.createElement('button');
            downloadButton.className = 'download-icon';
            downloadButton.setAttribute('aria-label', images.length > 0 ? 'Copy images to clipboard' : 'Copy video link and open downloader');

            const bookmarkStyles = window.getComputedStyle(bookmarkButton);
            downloadButton.style.cssText = bookmarkStyles.cssText;
            downloadButton.style.background = 'none';
            downloadButton.style.border = 'none';
            downloadButton.style.padding = '0';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.marginLeft = '10px';

            const bookmarkColor = bookmarkStyles.color || 'rgb(113, 118, 123)';
            downloadButton.style.color = bookmarkColor;

            downloadButton.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-1q142lx">
                <g>
                    <path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path>
                </g>
            </svg>
            `;

            bookmarkButton.parentNode.insertBefore(downloadButton, bookmarkButton.nextSibling);

            downloadButton.addEventListener('click', () => {
                if (images.length > 0) {
                    copyImagesToClipboard(images);
                } else if (video) {
                    copyVideoLinkAndOpenDownloader(tweet);
                }
            });
        }
    });
}

async function copyImagesToClipboard(images) {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        for (let index = 0; index < images.length; index++) {
            const image = images[index];
            try {
                const response = await fetch(image.src, { mode: 'cors' });
                const blob = await response.blob();

                const img = new Image();
                img.crossOrigin = 'Anonymous';
                const loadPromise = new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = URL.createObjectURL(blob);
                });
                await loadPromise;

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const pngBlob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/png');
                });

                const item = new ClipboardItem({ 'image/png': pngBlob });
                await navigator.clipboard.write([item]);
                console.log(`Image ${index + 1} copied to clipboard as PNG:`, image.src);

                URL.revokeObjectURL(img.src);
            } catch (err) {
                console.error(`Failed to copy image ${index + 1} to clipboard:`, err);
            }
        }
    } else {
        console.error('Extension context invalidated. Cannot copy images to clipboard.');
    }
}

function copyVideoLinkAndOpenDownloader(tweet) {
    const tweetLinkElement = tweet.querySelector('a[href*="/status/"]');
    if (!tweetLinkElement) {
        console.error('Tweet link not found');
        return;
    }
    const tweetUrl = tweetLinkElement.href;

    console.log('Copying tweet URL and opening downloader:', tweetUrl);

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        try {
            writeClipboardText(tweetUrl);
            chrome.runtime.sendMessage({
                action: 'openDownloaderTab'
            });
        } catch (err) {
            console.error('Error copying tweet URL:', err);
        }
    } else {
        console.error('Extension context invalidated. Cannot copy to clipboard or send message.');
    }
}

async function writeClipboardText(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard:', text);
    } catch (err) {
        console.error('Error copying text to clipboard:', err);
    }
}

setTimeout(addDownloadIcons, 2000);

const observer = new MutationObserver(() => {
    try {
        addDownloadIcons();
    } catch (err) {
        console.error('MutationObserver error:', err);
    }
});
observer.observe(document.body, { childList: true, subtree: true });