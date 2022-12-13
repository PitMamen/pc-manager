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
      default: 'pies'
    },
    name: {
      type: String,
      default: 'name'
    },
    widths: {
      type: String,
      default: 'auto'
    },
    heights: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      chart: null,
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            }
          }
        ]
      }
    }
  },
  methods: {
    init(option) {
      const options = JSON.parse(JSON.stringify(this.option))
      options.series[0] = { ...options.series[0], ...{ name: this.name }, ...option }
      this.hideLoading()
      this.getChart(true).setOption(options)
    },
    getChart(isNew) {
      if (isNew){
        if (this.chart !== null){
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
    }
  }
}
</script>
