<template>
   <v-container fluid id="chart">
    <apexchart
      type="rangeBar"
      :options="chartOptions"
      :series="getData"
      height="350"
      dark
    ></apexchart>
  </v-container>
</template>

<script>

export default {
  props: {
    timing: {
      type: Object
    },
    time: {
      type: Number
    }
  },
  data: () => ({
    data: {
      dns: {},
      connect: {},
      request: {},
      response: {},
      dom: {},
      domParse: {},
      domScripts: {},
      contentLoaded: {},
      domSubRes: {},
      load: {}
    }
  }),
  computed: {
    chartOptions () {
      return {
        chart: {
          height: 350,
          type: 'rangeBar'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            dataLabels: {
              hideOverflowingLabels: false
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            const label = opts.w.globals.labels[opts.dataPointIndex]
            console.log()
            const line = opts.w.config.series[0].data.find(serie => {
              return serie.x === label
            })

            return `${Math.floor(line.y[1] - line.y[0])} ms`
          },
          style: {
            colors: ['#f3f4f5', '#fff']
          }
        },
        xaxis: {
          type: 'numeric'
        },
        yaxis: {
          show: false
        },
        grid: {
          row: {
            colors: ['#f3f4f5', '#fff'],
            opacity: 1
          }
        }
      }
    },
    getData () {
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

      const series = [{ data: [] }]
      for (const key in this.data) {
        if (Object.hasOwnProperty.call(this.data, key)) {
          const element = this.data[key]
          series[0].data.push(
            {
              x: key,
              y: [element.start, element.end]
            }
          )
        }
      }

      return series
    }
  },
  methods: {
    range (start, end, length = end - start + 1) {
      return Array.from({ length }, (_, i) => start + i)
    },
    setDataCharts (type, start, end) {
      this.data[type].start = start
      this.data[type].end = end
    }
  }
}
</script>
