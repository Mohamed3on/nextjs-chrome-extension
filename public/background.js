chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html'),
    });

    const twitterTab = tabs.find((tab) => tab.url.includes('twitter.com'));
    if (!twitterTab) {
      chrome.tabs.create({ url: 'https://twitter.com' });
    } else {
      chrome.tabs.sendMessage(twitterTab.id, { message: 'refresh' }, function (response) {
        if (chrome.runtime.lastError || (response && response.type !== 'success')) {
          // If there's an error or response is not 'success', open Twitter
          chrome.tabs.create({ url: 'https://twitter.com' });
        }
      });
    }
  });
});
