<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div v-if="jbxx" style="overflow-y: auto; height: 380px; padding-right: 10px; padding-bottom: 10px">
      
      <div class="div-line-wrap">
        <div class="div-item-two">入院情况：</div>
      </div>
      <div class="div-line-wrap">
        <span class="div-item-content"
          >增加一个医疗机构级的系统参数用于配置执行随访界面时的内容展示：0表示调用HIS的实时接口展示健康档案；1表示调用私有云展示健康档案，默认机构为0，湘雅二医院配置改为0。</span >
      </div>
      <div class="div-line-wrap">
        <div class="div-item-two">入院诊断：</div>
      </div>
      <div class="div-line-wrap">
        <span class="div-item-content"
          >增加一个医疗机构级的系统参数用于配置执行随访界面时的内容展示：0表示调用HIS的实时接口展示健康档案；1表示调用私有云展示健康档案，默认机构为0，湘雅二医院配置改为0。</span >
      </div>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
  </div>
</template>


<script>
export default {
  components: {},
  props: {
    jbxx: Object,
    patientInfo: Object,
  },
  data() {
    return {
      insideZdxx: this.jbxx.zdxx,
      columns: [
        {
          title: '医院诊断类别名称',
          dataIndex: 'zdlbmc',
        },
        {
          title: '诊断编码',
          dataIndex: 'zdbm',
          ellipsis: true,
        },
        {
          title: '医院诊断名称',
          // innerHeight:20,
          dataIndex: 'zdbmmc',
        },
        {
          title: '诊断时间',
          dataIndex: 'zdsj',
          ellipsis: true,
        },
        {
          title: '主要诊断标志',
          dataIndex: 'zyzdbz',
          ellipsis: true,
        },
        {
          title: '疑似诊断标志',
          dataIndex: 'yzdbz',
          ellipsis: true,
        },
      ],
    }
  },

  created() {},
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

    refreshData(zdxx) {
      this.insideZdxx = zdxx
    },
  },
}
</script>
<style lang="less" scoped>
.nodata {
  height: 90%;
  width: 99%;
  text-align: center;
  padding-top: 150px;
}

.inner-wrap {
  max-height: 388px;
  // overflow-y: auto;
  // overflow: hidden;
  font-size: 12px;
  padding: 10px;
  // background-color: aquamarine;
  width: 99%;

  .div-title {
    // margin-top: 10px;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100% !important;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;

    .div-line-blue {
      width: 5px;
      height: 100%;
      background-color: #1890ff;
    }
    .span-title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }


    // border: #eaeaea solid 1px;
    .div-line-wrap {
      width: 100%;
     
      display: flex;
      align-items: center;
      flex-direction: row;

      .div-item-content {
        margin-bottom: 20px;
        color: #333;
      }

      .div-item-two {
        margin-bottom: 10px;
      }
    }
  
}
</style>
