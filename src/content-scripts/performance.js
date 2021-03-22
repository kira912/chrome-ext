(function () {
  'use strict'

  chrome.runtime.sendMessage({ msg: 'getTabId' }, tabId => {
    if (document.readyState === 'complete') {
      startCollect()
    } else {
      window.addEventListener('load', startCollect)
    }

    function startCollect () {
      const timingPage = performance.getEntriesByType('navigation')[0].toJSON()
      let allEntriesRequestPage = performance.getEntries()
      allEntriesRequestPage.shift()
      timingPage.start = performance.requestStart
      delete timingPage.serverTiming
      if (timingPage.duration > 0) {
        // fetchStart sometimes negative in FF, make an adjustment based on fetchStart
        var adjustment = timingPage.fetchStart < 0 ? -timingPage.fetchStart : 0
        const loopKey = [
          'domainLookupStart',
          'domainLookupEnd',
          'connectStart',
          'connectEnd',
          'requestStart',
          'responseStart',
          'responseEnd',
          'domComplete',
          'domInteractive',
          'domContentLoadedEventStart',
          'domContentLoadedEventEnd',
          'loadEventStart',
          'loadEventEnd',
          'duration'
        ]
        loopKey.forEach(i => {
          timingPage[i] += adjustment
        })

        // we have only 4 chars in our disposal including decimal point
        var duration = timingPage.duration / 1000
        var precision = (duration >= 100) ? 0 : (duration >= 10 ? 1 : 2)
        var time = duration.toFixed(precision).substring(0, 4)
        chrome.runtime.sendMessage({msg: 'sendRequest', time: time, timingPage: timingPage, allEntriesRequestPage: allEntriesRequestPage, tabId: tabId })
      } else {
        setTimeout(startCollect, 100)
      }
    }
  })
})()
