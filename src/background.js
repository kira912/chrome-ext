chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log(msg)
  if (msg.msg === 'getTabId') {
    sendResponse(sender.tab.id)

    return true
  }

  if (msg.msg === 'sendRequest') {
    chrome.storage.local.get('cache').then(data => {
      if (!data.cache) data.cache = {}
      data.cache[sender.tab.id].timingPage = request.timingPage
      data.cache[sender.tab.id].requests = request.allEntriesRequestPage
      browser.storage.local.set(data)
      console.log(data)
    })
  }
})

browser.runtime.onMessage.addListener((request, sender) => {
  console.log(browser.storage)
  
})
// chrome.tabs.query({active: true, currentWindow: true},(tabs) => {

// })

// cache eviction
browser.tabs.onRemoved.addListener(tabId => {
  browser.storage.local.get('cache').then(data => {
    if (data.cache) delete data.cache[tabId]
    browser.storage.local.set(data)
  })
})
