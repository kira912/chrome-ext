chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg, sender)
  if (msg.text === 'scan_request') {
    chrome.webRequest.onBeforeRequest.addListener((details) => {
      console.log(details)
    },
    { tabId: msg.tabId, urls: '<all_urls>' })
  }
})
