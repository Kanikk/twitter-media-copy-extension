function addDownloadIcons() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');

    tweets.forEach(tweet => {
        const mediaContainer = tweet.querySelector('[data-testid="tweetPhoto"]');
        const images = mediaContainer ? Array.from(mediaContainer.querySelectorAll('img')) : [];
        const video = tweet.querySelector('video');
        const bookmarkContainer = tweet.querySelector('[data-testid="bookmark"]')?.parentElement;

        if ((images.length > 0 || video) && bookmarkContainer && !tweet.querySelector('.download-icon')) {
            // Tworzenie nowego przycisku pobierania
            const downloadContainer = document.createElement('div');
            downloadContainer.className = 'css-175oi2r r-18u37iz r-1h0z5md r-1wron08';

            const downloadButton = document.createElement('button');
            downloadButton.className = 'css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l download-icon';
            downloadButton.type = 'button';
            downloadButton.setAttribute('aria-label', images.length > 0 ? 'Download images' : 'Download video');
            downloadButton.setAttribute('role', 'button');

            const innerDiv = document.createElement('div');
            innerDiv.className = 'css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q';
            innerDiv.style.color = 'rgb(113, 118, 123)';

            const iconContainer = document.createElement('div');
            iconContainer.className = 'css-175oi2r r-xoduu5';

            const downloadIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            downloadIcon.setAttribute('viewBox', '0 0 24 24');
            downloadIcon.classList.add('r-4qtqp9', 'r-yyyyoo', 'r-dnmrzs', 'r-bnwqim', 'r-lrvibr', 'r-m6rgpd', 'r-1xvli5t', 'r-1hdv0qi');
            downloadIcon.setAttribute('aria-hidden', 'true');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z');

            downloadIcon.appendChild(path);
            iconContainer.appendChild(downloadIcon);
            innerDiv.appendChild(iconContainer);
            downloadButton.appendChild(innerDiv);
            downloadContainer.appendChild(downloadButton);

            downloadButton.style.transition = 'background-color 0.2s ease-in-out';
            downloadButton.addEventListener('mouseenter', () => {
                innerDiv.style.color = 'rgb(29, 155, 240)';
            });
            downloadButton.addEventListener('mouseleave', () => {
                innerDiv.style.color = 'rgb(113, 118, 123)';
            });

            const parentGroup = bookmarkContainer.parentElement;
            parentGroup.insertBefore(downloadContainer, bookmarkContainer.nextSibling);

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