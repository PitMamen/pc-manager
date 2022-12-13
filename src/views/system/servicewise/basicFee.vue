<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div
      class="div-fee"
      v-if="sfxx && sfxx.length > 0"
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
          总费用：<span>{{ total }}</span>
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
  // props: {
  //   jbxx: Object,
  // },
  data() {
    return {
      // insideJbxx: this.jbxx,
      total: 0,
      sfxx: [],
      data: [],
    }
  },

  created() {
    this.$nextTick(() => {})
  },
  methods: {
    refreshData(sfxx) {
      this.total = 0
      console.log('basicFee insideJbxx', this.sfxx)
      this.sfxx = sfxx

      this.$nextTick(() => {
        // this.$refs.pies.showLoading()
        let option = { data: [] }

        for (let index = 0; index < this.sfxx.length; index++) {
          option.data.push({
            name: this.sfxx[index].mxxmmc,
            // name: this.insideJbxx.sfxx[index].mxxmmc,
            value: this.sfxx[index].mxxmje,
          })
          this.total = this.total + parseInt(this.sfxx[index].mxxmje)
        }
        console.log('this.total', this.total)
        this.total = this.total > 0 ? this.total.toFixed(2) : 0
        this.data = JSON.parse(JSON.stringify(option.data))

        this.$refs.pies.init(option)
      })
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
