chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url) {
    chrome.tabs.query({ pinned: false }, function (tabs) {
      chrome.tabs.sendMessage(tabId, {
        type: tab.url,
        tabLength: tabs.length,
      });
    });
  }
});
