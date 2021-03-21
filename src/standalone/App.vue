<template>
  <v-app>
    <v-card>
    <v-tabs
      background-color="blue darken-3 accent-4"
      center-active
      dark
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.id"
        @click="handleTab(tab.id)"
      >
        {{tab.title}}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(request, index) in tabsRequests" 
        :key="index" 
        :value="request.tabId"
      >
          <RequestRow :requests="request.requests" />
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
    requests: []
  }),
  methods: {
    handleTab (tabId) {
      this.tab = tabId
    }
  },
  mounted () {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      this.tab = tabs[0].id

      tabs.forEach(tab => {
        if (tab.title !== undefined) {
          this.tabs.push(tab)
        }
        this.tabsRequests.push({ tabId: tab.id, requests: [] })
      })
      chrome.webRequest.onSendHeaders.addListener(details => {
        this.tabsRequests.find(tab => {
          if (details.tabId === tab.tabId) {
            tab.requests.push(details)
          }
        })
      }, {urls: ["<all_urls>"]}, [
          'extraHeaders',
          'requestHeaders'
      ])

      chrome.webRequest.onHeadersReceived.addListener(details => {
        this.tabsRequests.find(tab => {
          if (details.tabId === tab.tabId) {
            tab.requests.find(request => {
              if (details.requestId === request.requestId) {
                request.extraHeadersReceived = details.extraHeaders
                request.responseHeadersReceived = details.responseHeaders
              }
            })
          }
        })
      }, {urls: ["<all_urls>"]}, [
          'extraHeaders',
          'responseHeaders'
      ])

      chrome.webRequest.onCompleted.addListener((details) => {
        this.tabsRequests.find(tab => {
          if (details.tabId === tab.tabId) {
            tab.requests.find(request => {
              request.extraHeaders = []
              request.responseHeaders = []
              if (details.requestId === request.requestId) {
                request.extraHeaders = details.extraHeaders
                request.responseHeaders = details.responseHeaders
                request.statusCode = details.statusCode
                console.log(request)
              }
            })
          }
        })
      }, {urls: ['<all_urls>'] }, [
          'extraHeaders',
          'responseHeaders'
      ])
    })
  }
}
</script>

<style lang="sass">
body
  background-color: #E8E8E8
</style>