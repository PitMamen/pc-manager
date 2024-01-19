<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div v-if="jbxx" style="overflow-y: auto; height: 480px; padding-right: 10px; padding-bottom: 10px">
      <div class="top-title">
        <div class="left-text" :class="{ 'checked-btn': currentText == 1 }" @click="textChange(1)">长期医嘱</div>
        <div class="right-text" :class="{ 'checked-btn': currentText == 2 }" @click="textChange(2)">临时医嘱</div>
      </div>

      <!-- :scroll="{ x: true }" -->
      <!-- style="margin-left: 2%; min-height: 450px; overflow-y: auto" -->
      <!-- :data-source="jbxx.operationInfo" -->
      <a-table
        v-if="currentText == 1"
        :scroll="{ x: true }"
        ref="table"
        :pagination="false"
        style="margin-top: 10px"
        size="default"
        :data-source="jbxx"
        bordered
        :columns="columnsSurgery"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </a-table>
      
      <!-- :data-source="jbxx.operationInfo" -->
      <a-table
        v-if="currentText == 2"
        :scroll="{ x: true }"
        ref="table"
        :pagination="false"
        style="margin-top: 10px"
        size="default"
        :data-source="jbxx"
        bordered
        :columns="columnsright"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </a-table>
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
    // patientInfo: Object,
  },
  data() {
    return {
      info: { reqDocName: '' },
      insideZdxx: this.jbxx,
      currentText: 1,
      columnsSurgery: [
        {
          title: '起始',
          dataIndex: 'ssczbm',

          children: [
            {
              title: '日期',
              dataIndex: 'zxrq',
              align: 'center',
              width:100,
            },
            {
              title: '时间',
              dataIndex: 'zxsj',
              align: 'center',
              width:85,
            },
          ],
        },
        {
          title: '医嘱',
          dataIndex: 'yzmxmc',
          ellipsis: true,
          colSpan:2,
          align: 'center',
          with: 300,
        },

        {
          title: '',
          colSpan:0,
          dataIndex: 'yzzh',
          align: 'left',
          width:30
        },
        {
          title: '医生',
          // innerHeight:20,
          dataIndex: 'xdrxm',
          align: 'center',
          width:80
        },
        {
          title: '护士',
          dataIndex: 'zxrxm',
          ellipsis: true,
          align: 'center',
        },


        {
          title: '停止',
          dataIndex: 'ssczbd',

          children: [
            {
              title: '日期',
              dataIndex: 'tzrq',
              align: 'center',
              width:100,
            },
            {
              title: '时间',
              dataIndex: 'tzsj',
              align: 'center',
              width:85,
            },
          ],
        },

        
        {
          title: '医生',
          dataIndex: 'tzyzzqm',
          ellipsis: true,
          // colSpan:1,
          align: 'center',
        },
        {
          title: '护士',
          // colSpan:1,
          dataIndex: 'hdyzhsqm',
          ellipsis: true,
          align: 'center',
        },
      ],

      //   dfddd
      columnsright: [
        {
          title: '日期',
          // ellipsis: true,
          // width:90,
          dataIndex: 'ksrq',
          align: 'center',
        },
        {
          title: '时间',
          dataIndex: 'kssj',
          ellipsis: true,
          align: 'center',
        },

        {
          title: '临时医嘱',
          dataIndex: 'yzmxmc',
          ellipsis: true,
          colSpan:2,
          align: 'center',
          with: 300,
        },

        {
          title: '',
          colSpan:0,
          dataIndex: 'yzzh',
          align: 'left',
          width:120
        },

        {
          title: '医生',
          dataIndex: 'xdrxm',
          ellipsis: true,
          align: 'center',
        },

        {
          title: '执行',
          dataIndex: 'yzzxsj',
          ellipsis: true,
          align: 'center',

          children: [
            {
              title: '日期',
              dataIndex: 'zxrq',
              align: 'center',
            },
            {
              title: '时间',
              dataIndex: 'zxsj',
              align: 'center',
            },
          ],
        },

        {
          title: '护士',
          dataIndex: 'zxrxm',
          ellipsis: true,
          align: 'center',
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

    textChange(value) {
      if (value == this.currentText) {
        return
      }
      this.currentText = value
      this.$emit('ok', value)
    },




    refreshData(yizhuData) {
    //   this.currentText = 1
      this.jbxx = yizhuData
      console.log("222222:",this.jbxx)
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
  max-height: 488px;
  // overflow-y: auto;
  // overflow: hidden;
  font-size: 12px;
  padding: 10px;
  // background-color: aquamarine;
  width: 99%;

  .top-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    cursor: pointer;

    .left-text {
      margin-right: 30px;
      font-size: 14px;
    }

    .right-text {
      margin-right: 30px;
      font-size: 14px;
    }

    .checked-btn {
      // background-color: #eff7ff;
      color: #1890ff;
      border-bottom: #1890ff 2px solid;
      font-size: 15px;
    }
  }

  .div-fee {
    .div-fee-line {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      // align-items: center;

      .fee-des {
        color: #1a1a1a;
        font-weight: bold;
      }
      .name {
        padding-left: 10px;
        padding-right: 10px;
        &:first-child {
          padding-left: 0px;
        }
      }
      .value {
        padding-left: 5px;
        padding-right: 20px;
        border-bottom: 1px solid #1a1a1a;
        &.image {
          display: inline-block;
          max-width: 80px;
          max-height: 80px;
          vertical-align: bottom;
          border-bottom: none;
        }
      }
    }
  }
}
</style>
  