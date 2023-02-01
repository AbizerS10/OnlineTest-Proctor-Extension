let ip;
chrome.webRequest.onCompleted.addListener(
  (details) => {
    ip = details.ip;
  },
  {
    urls: ["<all_urls>"],
  }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    chrome.tabs.query({ pinned: false }, function (tabs) {
      chrome.tabs.sendMessage(tabId, {
        type: tab.url,
        tabLength: tabs.length,
        ip: ip,
      });
    });
  }
});
