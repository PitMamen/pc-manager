<template>
  <div :id="ids" :style="{ width: widths, height: heights }"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer])
export default {
  props: {
    ids: {
      type: String,
      default: 'bars'
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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'name',
            type: 'bar',
            barWidth: '60%',
            data: []
          }
        ]
      }
    }
  },
  methods: {
    init(option) {
      const options = {
        ...this.option,
        ...option
      }
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
    }
  }
}
</script>
