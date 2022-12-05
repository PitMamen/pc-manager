<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div v-if="jbxx">
      <span>{{ jbxx.name }}</span>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
  </div>
</template>


<script>
import {
  getSoundRecordingList,
} from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'

export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },
  props: {
    jbxx: Object,
  },
  data() {
    return {
      showResultInfo: false,
      audioSrc: '',
    }
  },

  created() {
    // followPlanPhoneHistory(this.record.userId).then((res) => {
    //   if (res.code === 0) {
    //     this.historyList = res.data
    //     if (res.data && res.data.length > 0) {
    //       this.onHistoryItemClick(res.data[0].id)
    //     }
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // })
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },
  },
}
</script>
<style lang="less">
.nodata {
  height: 90%;
  width: 99%;
  text-align: center;
  padding-top: 150px;
}

.inner-wrap {
  height: 388px;
  overflow: hidden;
  // background-color: aquamarine;
  width: 99%;
}
</style>
