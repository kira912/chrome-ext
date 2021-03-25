<template>
  <v-card rounded light>
    <v-card-title class="grey darken-3">
      <span class="title font-weight-light">Timing Navigation</span>
    </v-card-title>
      <Charts v-model="timing" v-if="timing" :timing="timing"></Charts>
  </v-card>
</template>

<script>
import Charts from '@/components/Charts'
export default {
  components: {
    Charts
  },
  props: {
    currentTab: {
      type: Number
    }
  },
  data: () => ({
    timing: {},
    time: ''
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
        if (this.currentTab === msg.tabId) {
          this.time = msg.time
          this.timing = msg.timingPage
        }
      }
    })
  }
}
</script>
