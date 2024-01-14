chrome.action.onClicked.addListener(function (tab) {
  const indexUrl = chrome.runtime.getURL('index.html');

  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function (tabs) {
      // Check if a tab with index.html is already open
      const existingTab = tabs.find((tab) => tab.url === indexUrl);

      if (existingTab) {
        // If it exists, focus on that tab
        chrome.tabs.update(existingTab.id, { active: true });
      } else {
        // If it doesn't exist, create a new tab with index.html
        chrome.tabs.create({ url: indexUrl });
      }
    }
  );
});
