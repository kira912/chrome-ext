<template>
  <v-card rounded light>
    <v-card-title class="grey darken-3">
      <span class="title font-weight-light">Request Timing Navigation</span>
    </v-card-title>
    {{timing}}
      <Charts :timing="timing"></Charts>
  </v-card>
</template>

<script>
import Charts from '@/components/Charts'
export default {
  components: {
    Charts
  },
  props: {
    requestUrl: {
      type: String
    }
  },
  data: () => ({
    timing: {}
  }),
  watch: {
    timing: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.timing = newVal
      }
    }
  },
  beforeMount () {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.msg === 'sendRequest') {
        console.log(msg.allEntriesRequestPage)
        msg.allEntriesRequestPage.some((entrieRequest) => {
          if (entrieRequest.name === this.currentUrl) {
            this.timing = entrieRequest
          }
        })
      }
    })
  }
}
</script>
