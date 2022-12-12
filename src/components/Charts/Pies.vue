<template>
  <div :id="ids" :style="{ width: widths, height: heights }"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])
export default {
  props: {
    ids: {
      type: String,
      default: 'pies',
    },
    name: {
      type: String,
      default: 'name',
    },
    widths: {
      type: String,
      default: 'auto',
    },
    heights: {
      type: String,
      default: '400px',
    },
  },
  data() {
    return {
      chart: null,
      // data: [],
      option: {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          type: 'scroll',
          // type: 'plain',
          orient: 'vertical',
          // align: 'left',
          x: 'left',
          // right: 10,
          // top: 20,
          // bottom: 20,
          data: [],
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    }
  },
  methods: {
    init(option) {
      this.option.legend = JSON.parse(JSON.stringify(option.data))
      this.data = JSON.parse(JSON.stringify(option.data))
      console.log('init option', JSON.parse(JSON.stringify(option)))
      const options = JSON.parse(JSON.stringify(this.option))
      options.series[0] = { ...options.series[0], ...{ name: this.name }, ...option }
      this.hideLoading()
      this.getChart(true).setOption(options)
    },
    getChart(isNew) {
      if (isNew) {
        if (this.chart !== null) {
          this.chart.dispose()
          this.chart = null
        }
      }
      if (this.chart === null) {
        const chartDom = document.getElementById(this.ids)
        this.chart = echarts.init(chartDom)
      }
      return this.chart
    },
    showLoading() {
      this.getChart().showLoading()
    },
    hideLoading() {
      this.getChart().hideLoading()
    },
  },
}
</script>
