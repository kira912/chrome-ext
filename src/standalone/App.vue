<template>
  <v-app>
    <v-card>
      <v-tabs dark center-active>
        <v-tab v-for="tab in tabs" :key="tab.id" @click="handleTab(tab.id)">
          {{ tab.title }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(request, index) in tabsRequests"
          :key="index"
          :value="request.tabId"
        >
          <RequestRow :requests="request.requests" :timingPage="timingNavigation" :currentTab="tab" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-app>
</template>

<script>
import RequestRow from '../components/RequestRow'

export default {
  name: 'App',
  components: {
    RequestRow
  },
  data: () => ({
    tab: null,
    tabs: [],
    tabsRequests: [],
    beforeRequest: [],
    sendHeaders: [],
    headersReceived: [],
    requestCompleted: [],
    timingNavigation: {}
  }),
  methods: {
    handleTab (tabId) {
      this.tab = tabId
    }
  },
  computed: {
    getTabRequests () {
      const beforeRequest = this.beforeRequest.find(
        (el) => el.tabId === this.tab
      )
      const sendHeaders = this.sendHeaders.find((el) => el.tabId === this.tab)
      const headersReceived = this.headersReceived.find(
        (el) => el.tabId === this.tab
      )
      const requestCompleted = this.requestCompleted.find(
        (el) => el.tabId === this.tab
      )

      return Object.assign(
        {},
        beforeRequest,
        sendHeaders,
        headersReceived,
        requestCompleted
      )
    }
  },
  beforeCreate () {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.msg === 'getTabId') {
        sendResponse(sender.tab.id)
      }

      // if (msg.msg === 'sendRequest') {
      //   const tab = this.tabsRequests.find((tab) => tab.tabId === msg.tabId)
      //   tab.requests.find((request) => {
      //     msg.allEntriesRequestPage.some((entrieRequest) => {
      //       if (entrieRequest.name === request.url) {
      //         request.timing = entrieRequest
      //       }
      //     })
      //   })
      // }
    })
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      this.tab = tabs[0].id

      tabs.forEach((tab) => {
        if (tab.title !== undefined) {
          this.tabs.push(tab)
        }
        this.tabsRequests.push({ tabId: tab.id, requests: [] })
      })

      chrome.webRequest.onSendHeaders.addListener(
        (details) => {
          this.tabsRequests.find((tab) => {
            if (details.tabId === tab.tabId) {
              const request = tab.requests.find((request) => {
                if (details.requestId === request.requestId) {
                  return request
                }
              })

              if (request !== undefined) {
                request.requestHeaders = details.requestHeaders

                return
              }

              tab.requests.push(details)
            }
          })
        },
        { urls: ['<all_urls>'] },
        ['extraHeaders', 'requestHeaders']
      )

      chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
          this.tabsRequests.find((tab) => {
            if (details.tabId === tab.tabId) {
              const request = tab.requests.find((request) => {
                if (details.requestId === request.requestId) {
                  return request
                }
              })

              if (request !== undefined) {
                request.requestBody = details.requestBody

                return
              }

              tab.requests.push(details)
            }
          })
        },
        { urls: ['<all_urls>'] },
        ['requestBody']
      )

      chrome.webRequest.onHeadersReceived.addListener(
        (details) => {
          this.tabsRequests.find((tab) => {
            if (details.tabId === tab.tabId) {
              tab.requests.find((request) => {
                if (details.requestId === request.requestId) {
                  request.extraHeadersReceived = details.extraHeaders
                  request.responseHeadersReceived = details.responseHeaders
                }
              })
            }
          })
        },
        { urls: ['<all_urls>'] },
        ['extraHeaders', 'responseHeaders']
      )

      chrome.webRequest.onCompleted.addListener(
        (details) => {
          this.tabsRequests.find((tab) => {
            if (details.tabId === tab.tabId) {
              tab.requests.find((request) => {
                if (details.requestId === request.requestId) {
                  request.extraHeaders = details.extraHeaders
                  request.responseHeaders = details.responseHeaders
                  request.statusCode = details.statusCode
                }
              })
            }
          })
        },
        { urls: ['<all_urls>'] },
        ['extraHeaders', 'responseHeaders']
      )
    })
  }
}
</script>

<style lang="sass">
html
  background-color: #212121
</style>
