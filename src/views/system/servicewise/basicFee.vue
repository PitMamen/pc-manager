<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div
      class="div-fee"
      v-if="insideJbxx.sfxx && insideJbxx.sfxx.length > 0"
      style="overflow-y: auto; height: 380px; padding-right: 10px; padding-bottom: 10px"
    >
      <div class="chart">
        <pies ref="pies" ids="pies" name="费用" widths="100%" heights="300px"></pies>
      </div>
      <div class="div-fee-wrap">
        <div class="div_list">
          <div class="div-item" v-for="(item, index) in data" :key="index" :value="item.code">
            {{ item.name }}：<span>{{ item.value }}</span>
          </div>
        </div>
        <div style="font-weight: bold; margin-top: 12px; color: #333">
          总费用：<span>{{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
  </div>
</template>


<script>
import { Pies } from '@/components'
export default {
  components: { Pies },
  props: {
    jbxx: Object,
  },
  data() {
    return {
      insideJbxx: this.jbxx,
      total: 0,
      dazdList: [
        { code: 1, name: '4r4rt', des: '555' },
        { code: 2, name: 'gtrh', des: '555' },
        { code: 3, name: 'hr', des: '555' },
        { code: 4, name: 'hythyt', des: '555' },
        { code: 5, name: 'hythty', des: '555' },
        { code: 6, name: 'hty', des: '555' },
        { code: 7, name: 'gtrh6', des: '555' },
        { code: 8, name: 'fergtr', des: '555' },
        { code: 8, name: 'fergtr', des: '555' },
        { code: 8, name: 'fergtr', des: '555' },
        { code: 8, name: 'fergtr', des: '555' },
        { code: 8, name: 'fergtr', des: '555' },
        { code: 8, name: 'fergtr', des: '555' },
      ],
    }
  },

  created() {
    this.$nextTick(() => {
      // this.getChartPies()
    })
  },
  methods: {
    getChartPies() {
      this.$refs.pies.showLoading()
      // getDiseaseStat().then((res) => {
      //   this.initPies(res.data)
      // })
      let data = []
      for (let index = 0; index < 8; index++) {
        data.push({ diagnosis: 1 + index + '个国家', num: index + 1 })
      }
      console.log('getChartPies data', data)
      this.initPies(data)
    },
    initPies(data) {
      const option = this.genePiesOption(data)
      console.log('option', option)
      this.$refs.pies.init(option)
    },

    genePiesOption(data = []) {
      const option = {
        data: [],
      }
      data.forEach((item) => {
        option.data.push({
          name: item.diagnosis,
          value: item.num,
        })
      })
      return option
    },

    refreshData(insideJbxx) {
      console.log('basicFee insideJbxx', this.insideJbxx)
      this.insideJbxx = insideJbxx

      // this.$nextTick(() => {
      this.$refs.pies.showLoading()
      let option = { data: [] }

      for (let index = 0; index < this.insideJbxx.sfxx.length; index++) {
        option.data.push({
          name: this.insideJbxx.sfxx[index].mxxmmc,
          // name: this.insideJbxx.sfxx[index].mxxmmc,
          value: this.insideJbxx.sfxx[index].mxxmje,
        })
        this.total = this.total + this.insideJbxx.sfxx[index].mxxmje
      }
      this.data = JSON.parse(JSON.stringify(option.data))

      this.$refs.pies.init(option)
      // })
    },
  },
}
</script>
<style lang="less" scoped>
.inner-wrap {
  font-size: 12px;
  height: 388px;
  font-size: 12px;
  padding: 10px;
  width: 99%;

  .div-fee {
    overflow-y: auto;
    height: 380px;
    padding-right: 10px;

    padding-bottom: 10px;
    display: flex;
    flex-direction: column;

    .chart {
      height: 300px;
      // overflow: hidden;
      // width: 100%;
      // padding: 0 20%;
      // border-top: 1px solid #d8e2ea;

      #pies {
        div {
          width: 100% !important;
          canvas {
            width: 100% !important;
          }
        }
      }
    }

    .div-fee-wrap {
      .div_list {
        .div-item {
          font-weight: bold;
          margin-top: 12px;
          color: #333;
          display: inline-block;
          width: 25%;
        }
      }
    }
  }

  .nodata {
    height: 90%;
    width: 99%;
    text-align: center;
    padding-top: 150px;
  }
}
</style>
