<template>
   <v-container fluid id="chart">
    <apexchart 
      type="donut"
      :options="chartOptions"
      :series="Object.values(getRequestTime())"
      width="70%"
      height="70%"
    ></apexchart>
  </v-container>
</template>

<script>

export default {
  props: {
    timing: {
      type: Object
    }
  },
  data: () => ({
    chartOptions: {
      chart: {
        type: 'donut',
        width: '10%',
        height: '10%'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '10%',
            height: '10%'
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  }),
  methods: {
    getRequestTime() {
      let times = {
        redirect: 0,
        dns: 0,
        connect: 0,
        request: 0,
        response: 0,
        dom: 0,
        domParse: 0,
        domScripts: 0,
        contentLoaded: 0,
        domSubRes: 0,
        load: 0
      }
      const sparkLineValues = []
      if (this.timing === undefined) {
        return []
      }

      const total = this.timing.duration

      if (this.timing.redirectEnd > 0) {
        const redirectStart = this.timing.redirectStart
        const redirectEnd = this.timing.redirectEnd
        const redirectLength = Math.round(redirectEnd - redirectStart)
        // const x = Math.round(start / total * 300)

        times.redirect = Math.round(redirectLength / total * 300)
      }

      if (this.timing.domainLookupEnd > 0) {
        const start = this.timing.domainLookupStart
        const end = this.timing.domainLookupEnd
        const length = Math.round(end - start)
        // const x = Math.round(start / total * 300)

        times.dns = Math.round(length / total * 300)
      }

      if (this.timing.connectEnd > 0) {
        const start = this.timing.connectStart
        const end = this.timing.connectEnd
        const length = Math.round(end - start)
        // const x = Math.round(start / total * 300)

        times.connect = Math.round(length / total * 300)
      }

      if (this.timing.requestStart > 0 && this.timing.responseStart > 0) {
        const start = this.timing.requestStart
        const end = this.timing.responseStart
        const length = Math.round(end - start)
        // const x = Math.round(start / total * 300)

        times.request = Math.round(length / total * 300)
      }

      if (this.timing.responseEnd > 0) {
        const start = this.timing.responseStart
        const end = this.timing.responseEnd
        const length = Math.round(end - start)
        // const x = Math.round(start / total * 300)

        times.response = Math.round(length / total * 300)
      }

      if (this.timing.domComplete > 0 && this.timing.responseEnd > 0) {
        const start = this.timing.domComplete
        const end = this.timing.responseEnd
        const length = Math.round(end - start)
        // const x = Math.round(start / total * 300)

        times.dom = Math.round(length / total * 300)
      }

      return times
      // times.dns = 
    }
  }
}
</script>