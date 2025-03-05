chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openDownloaderTab') {
    chrome.tabs.create({
      url: 'https://ssstwitter.com/'
    }, (tab) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to open new tab:', chrome.runtime.lastError.message);
      } else {
        console.log('New tab opened with ssstwitter.com, tab ID:', tab.id);
      }
    });
  }
});