<template>
   <v-container fluid id="chart">
    <apexchart
      type="donut"
      :options="chartOptions"
      :series="chartOptions.series"
      width="90%"
      height="90%"
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
    data: {}
  }),
  computed: {
    getData () {
      this.setDataCharts('redirect', this.timing.redirectStart, this.timing.redirectEnd)
      this.setDataCharts('dns', this.timing.domainLookupStart, this.timing.domainLookupEnd)
      this.setDataCharts('connect', this.timing.connectStart, this.timing.connectEnd)
      this.setDataCharts('request', this.timing.requestStart, this.timing.responseStart)
      this.setDataCharts('response', this.timing.responseStart, this.timing.responseEnd)
      this.setDataCharts('dom', this.timing.responseEnd, this.timing.domComplete)
      this.setDataCharts('domParse', this.timing.responseEnd, this.timing.domInteractive)
      this.setDataCharts('domScripts', this.timing.domInteractive, this.timing.domContentLoadedEventStart)
      this.setDataCharts('contentLoaded', this.timing.domContentLoadedEventStart, this.timing.domContentLoadedEventEnd)
      this.setDataCharts('domSubRes', this.timing.domContentLoadedEventEnd, this.timing.domComplete)
      this.setDataCharts('load', this.timing.loadEventStart, this.timing.loadEventEnd)

      return this.data
    },
    chartOptions: function () {
      return {
        labels: Object.keys(this.data),
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Ms',
                  color: '#373d3f',
                  formatter: () => {
                    return Math.round(this.timing.duration)
                  }
                }
              }
            }
          }
        },
        series: Object.values(this.getData).filter(Boolean)
      }
    }
  },
  methods: {
    setDataCharts (type, start, end) {
      console.log(end - start, end, start, this.timing)
      // const x = Math.round(start - this.timing.duration)
      const length = Math.round(end - start)
      this.data[type] = length
    }
  }
}
</script>
