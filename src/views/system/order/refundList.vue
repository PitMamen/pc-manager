<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择机构"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="width: 180px"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.combinedCondition"
          allow-clear
          placeholder="输入用户名/电话/订单号查询"
          style="width: 210px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <!-- <div class="search-row">
        <span class="name">套餐类型:</span>
        <a-select v-model="queryParams.classifyId" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in packgeList" :key="index" :value="item.id">{{
            item.classifyName
          }}</a-select-option>
        </a-select>
      </div> -->

      <div class="search-row">
        <span class="name">更新时间:</span>
        <a-range-picker style="width: 190px" :value="orderTimeValue" @change="onChange" />
      </div>

      <div class="search-row">
        <span class="name">订单分类:</span>
        <a-select v-model="queryParams.orderType" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in ordertypeList" :key="index" :value="item.code">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>

      <!-- <div class="search-row">
        <span class="name">下单时间:</span>
        <a-range-picker style="width: 190px" :value="createValue" @change="onChangeOrder" />
      </div> -->

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset(true)">重置</a-button>
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'qb' }" @click="onRadioClick('qb')">
        <img v-if="queryParamsTemp.tabCode == 'qb'" src="~@/assets/icons/dingdan_c.png" />
        <img v-else src="~@/assets/icons/dingdan_n.png" />
        <span style="margin-left: 3px">全部订单({{ numberData.quanbu }})</span>
      </div>
      <div
        class="radio-item"
        v-show="showTabyy"
        :class="{ 'checked-btn': queryParamsTemp.tabCode == 'yy' }"
        @click="onRadioClick('yy')"
      >
      <img v-if="queryParamsTemp.tabCode == 'yy'" src="~@/assets/icons/ywc_c.png" />
        <img v-else src="~@/assets/icons/ywc_n.png" />
        <span style="margin-left: 3px">运营审核({{ numberData.yy }}) </span>
      </div>
      <div
        class="radio-item"
        v-show="showTabcw"
        :class="{ 'checked-btn': queryParamsTemp.tabCode == 'cw' }"
        @click="onRadioClick('cw')"
      >
      <img v-if="queryParamsTemp.tabCode == 'cw'" src="~@/assets/icons/byjs_c.png" />
        <img v-else src="~@/assets/icons/byjs_n.png" />
        <span style="margin-left: 3px">财务退款({{ numberData.cw }})</span>
      </div>
<!-- chenggong_c -->
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'wc' }" @click="onRadioClick('wc')">
        <img v-if="queryParamsTemp.tabCode == 'wc'" src="~@/assets/icons/ywc_c.png" />
        <img v-else src="~@/assets/icons/ywc_n.png" />
        <span style="margin-left: 3px">已完成({{ numberData.wc }})</span>
      </div>
    </div>

    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="goExamine(record)"><a-icon style="margin-right: 5px" type="hdd"></a-icon>详情</a>
      </span>

      <span slot="status" slot-scope="text, record" :class="getColor(record.status.value)">
        {{ record.status.description }}
      </span>

      <span slot="commodityName" slot-scope="text, record" class="multiLine">
        {{ record.commodityName }}
      </span>
    </s-table>
  </a-card>
</template>
   
   <script>
import { STable } from '@/components'
import moment from 'moment'
import { accessHospitals1, getCommodityClassify, getTab, getPage } from '@/api/modular/system/posManage'
import { getDateNow, getCurrentMonthLast, gethalfYearToday } from '@/utils/util'
import addForm from './addForm'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import refundExamine from './refundExamine'
import yzRefund from './yzRefund'
import followRefund from './followRefund'
import { setHidden } from '@/api/modular/system/banner'
import { noop } from 'ant-design-vue/es/_util/vue-types/utils'

export default {
  components: {
    STable,
    addForm,
    refundExamine,
    yzRefund,
    followRefund,
    // editForm,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      showTabyy: false,
      showTabcw: false,
      createValue: [],
      orderTimeValue: [],
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      gropListData: [],
      packgeList: [],
      confirmLoading: false,
      currentTab: 'qb',
      numberData: {
        quanbu: 0,
        yy: 0,
        cw: 0,
        wc: 0,
      },
      ordertypeList: [
        { code: 'consultOrder', value: '咨询订单' },
        { code: 'srvPackOrder', value: '专科服务' },
        { code: 'youzanOrder', value: '商城订单' },
      ],
      queryParams: {
        classifyId: undefined,
        combinedCondition: undefined,
        hospitalCode: undefined,
        // createEndTime: getCurrentMonthLast(),
        // createStartTime: getDateNow(),
        orderType: undefined,
        updateEndTime: getCurrentMonthLast(),
        updateStartTime: gethalfYearToday(),
        tabCode: '',
      },

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderId',
          ellipsis: true,
        },
        {
          title: '订单分类',
          dataIndex: 'orderfl',
          ellipsis: true,
        },
        {
          title: '退款单号',
          dataIndex: 'refundId',
          ellipsis: true,
        },
        {
          title: '用户姓名',
          dataIndex: 'userName',
        },
        {
          title: '手机号',
          dataIndex: 'userPhone',
        },
        {
          title: '套餐名称',
          dataIndex: 'commodityName',
          ellipsis: true,
          // scopedSlots: { customRender: 'commodityName' },
          // ellipsis: true,
        },
        {
          title: '医院名称',
          dataIndex: 'hospitalName',
        },
        {
          title: '订单金额',
          dataIndex: 'orderTotal',
          align: 'right',
        },
        {
          title: '实收',
          dataIndex: 'payTotal',
          align: 'right',
        },
        {
          title: '应退',
          dataIndex: 'refundMoney',
          align: 'right',
        },
        {
          title: '实退',
          dataIndex: 'actualRefundMoney',
          align: 'right',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 120,
        },

        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 120,
        },
        {
          title: '退款方式',
          dataIndex: 'refundMethod',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          fixed: 'right',
          with: 130,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
        this.queryParamsTemp.tabCode = this.currentTab
        return getPage(Object.assign(parameter, this.queryParams))
          .then((res) => {
            if (res.code == 0 && res.data.records.length > 0) {
              //组装控件需要的数据结构
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.total,
                totalPage: res.data.total / parameter.pageSize,
                rows: res.data.records,
              }

              //设置序号
              data.rows.forEach((item, index) => {
                this.$set(item, 'orderfl', item.orderType ? item.orderType.description : '')
                // this.$set(item, 'serveTime', item.startTime + ' ' + item.endTime)
                // item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
                // item.nameDes = item.name
              })
            } else {
              data = []
            }

            return data
          })
          .finally((data) => {
            this.confirmLoading = false
          })
      },
    }
  },

  activated() {
    this.reset(false)
    this.queryParams.tabCode = this.currentTab
    this.queryParamsTemp.tabCode = this.currentTab
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
      //如果不是运营人员 或者 财务人员  不显示顶部按钮
      this.showTabyy = this.user.dataAccessActors.includes('operationManager')
      this.showTabcw = this.user.dataAccessActors.includes('financialManager')
    }
    this.queryHospitalListOut(undefined)
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

    this.orderTimeValue = [moment(gethalfYearToday(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

    this.getTabOut()

    getCommodityClassify({}).then((res) => {
      if (res.code == 0) {
        this.packgeList = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  mounted() {
    this.$bus.$on('refundRefresh', (record) => {
      console.log('refundRefresh', record)
      this.$refs.table.refresh()
    })
  },

  methods: {
    //详情
    goExamine(record) {
      var path = ''
      //复诊续方
      if (record.orderType.value == 'appPreRegister') {
        path = '/order/followRefund'
        //有赞
      } else if (record.orderType.value == 'youzanOrder') {
        path = '/order/yzRefund'
      } else {
        path = '/order/refundExamine'
      }
      this.$router.push({
        path: path,
        query: {
          orderId: record.applyId,
        },
      })
    },

    getType(record) {
      if (record.value == 1) {
        return '运营审核'
      } else if (record.value == 2) {
        return '财务退款'
      } else if (record.value == 3) {
        return '审核拒绝'
      } else if (record.value == 4) {
        return '退款中'
      } else if (record.value == 5) {
        return '退款失败'
      } else if (record.value == 6) {
        return '已完成'
      }
    },

    getColor(value) {
      if (value == 1 || value == 2) {
        return 'span-green'
      } else if (value == 3 || value == 5 || value == 7) {
        return 'span-red'
      } else if (value == 6) {
        return 'span-blue'
      } else if (value == 4) {
        return 'span-green-p'
      }
    },

    isLoading() {
      return this.confirmLoading
    },

    // queryHospitalListOut() {
    //   //   let queryData = {
    //   //     tenantId: '',
    //   //     status: 1,
    //   //     hospitalName: '',
    //   //   }
    //   this.confirmLoading = true
    //   accessHospitals()
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalCode)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalCode)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }
    //       return []
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },

    /**
     * 所属机构接口
     */
    queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      accessHospitals1(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.queryParams.hospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //机构搜索
    onHospitalSelectSearch(value) {
      this.treeData = []
      this.queryHospitalListOut(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.localHospitalCode = undefined
        this.treeData = []
        this.queryHospitalListOut(undefined)
      }
    },

    reset(clearTime) {
      this.queryParams.combinedCondition = ''
      this.queryParams.hospitalCode = undefined
      if (clearTime) {
        this.createValue = []
        this.orderTimeValue = []
      } else {
        this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

        this.orderTimeValue = [
          moment(gethalfYearToday(), this.dateFormat),
          moment(getCurrentMonthLast(), this.dateFormat),
        ]
      }
      // this.queryParams.createStartTime = clearTime ? '' : getDateNow() + ' 00:00:00'
      // this.queryParams.createEndTime = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'
      this.queryParams.updateStartTime = clearTime ? '' : gethalfYearToday() + ' 00:00:00'
      this.queryParams.updateEndTime = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'
      this.queryParams.classifyId = ''
      this.queryParams.orderType = undefined

      this.handleOk()
    },

    //订单分组
    getTabOut() {
      getTab(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              if (res.data[index].code == 'qb') {
                //全部
                this.numberData.quanbu = res.data[index].count
              } else if (res.data[index].code == 'yy') {
                //运营
                this.numberData.yy = res.data[index].count
              } else if (res.data[index].code == 'cw') {
                //财务
                this.numberData.cw = res.data[index].count
              } else if (res.data[index].code == 'wc') {
                //完成
                this.numberData.wc = res.data[index].count
              }
            }
          }
        })
        .catch((err) => {
          this.$message.error('请求错误：' + err.message)
        })
    },

    onRadioClick(type) {
      //如果在加载中  不让点击
      if (this.confirmLoading) {
        return
      }
      this.currentTab = type
      this.queryParams.tabCode = type
      this.queryParamsTemp.tabCode = type
      this.$refs.table.refresh()
    },

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    //更新时间
    onChange(momentArr, dateArr) {
      if (Math.abs(moment(dateArr[1]).unix() - moment(dateArr[0]).unix()) > 7776000) {
        this.$message.error('开始时间与结束时间跨度不能超过三个月!')

        this.orderTimeValue = []
        this.queryParams.updateStartTime = ''
        this.queryParams.updateEndTime = ''
        return
      }
      if (dateArr) {
        if (dateArr[0] > dateArr[1]) {
          this.$message.error('开始时间不能大于结束时间')
          this.orderTimeValue = []
          this.queryParams.updateStartTime = ''
          this.queryParams.updateEndTime = ''
          return
        }
      }

      if (dateArr[0] == '' && dateArr[1] == '') {
        this.queryParams.updateStartTime = ''
        this.queryParams.updateEndTime = ''
        return
      }

      this.orderTimeValue = momentArr
      this.queryParams.updateStartTime = dateArr[0] + ' 00:00:00'
      this.queryParams.updateEndTime = dateArr[1] + ' 23:59:59'
    },

    //创建时间
    onChangeOrder(momentArr, dateArr2) {
      if (Math.abs(moment(dateArr2[1]).unix() - moment(dateArr2[0]).unix()) > 7776000) {
        this.$message.error('开始时间与结束时间跨度不能超过三个月!')
        this.createValue = []
        // this.queryParams.createStartTime = ''
        // this.queryParams.createEndTime = ''
        return
      }
      if (dateArr2) {
        if (dateArr2[0] > dateArr2[1]) {
          this.$message.error('开始时间不能大于结束时间')
          this.createValue = []
          this.queryParams.updateStartTime = ''
          this.queryParams.updateEndTime = ''
          return
        }
      }

      if (dateArr2[0] == '' && dateArr2[1] == '') {
        // this.queryParams.createStartTime = ''
        // this.queryParams.createEndTime = ''
        return
      }

      this.createValue = momentArr
      // this.queryParams.createStartTime = dateArr2[0] + ' 00:00:00'
      // this.queryParams.createEndTime = dateArr2[1] + ' 23:59:59'
    },

    handleOk() {
      this.getTabOut()
      this.$refs.table.refresh()
    },
  },
}
</script>




   
   <style lang="less" scoped>
.multiLine {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  // -webkit-line-clamp: 2;
  line-clamp: 2 !important;
}

.span-blue {
  background-color: #ecf5ff;
  padding: 2px 10px;
  font-size: 12px;
  color: #3894ff;
  border: #3894ff 1px solid;
  // background-color: #3894ff;
}

.span-green {
  background-color: #edffed;
  padding: 2px 4px;
  font-size: 12px;
  color: #0e9b0b;
  border: #69c07d 1px solid;
}

.span-green-p {
  background-color: #edffed;
  padding: 2px 10px;
  font-size: 12px;
  color: #0e9b0b;
  border: #69c07d 1px solid;
}

.span-red {
  background-color: #fff2f1;
  padding: 2px 4px;
  font-size: 12px;
  color: #f26161;
  border: #f26161 1px solid;
}

.span-gray {
  background-color: #fafafa;
  padding: 2px 10px;
  font-size: 12px;
  color: #4d4d4d;
  border: #4d4d4d 1px solid;
  // background-color: #85888e;
}

// .span-green {
//   padding: 2px 4px;
//   font-size: 12px;
//   color: #69c07d;
//   // background-color: #85888e;
// }

// .span-green-p {
//   background-color: #edffed;
//   padding: 2px 10px;
//   font-size: 12px;
//   color: #69c07d;
//   border: #0e9b0b 1px solid;
//   // border: #69c07d 1px solid;
// }

.small-modal {
  display: flex;
  flex-direction: column;

  .tital-t {
    display: flex;
    flex-direction: row;
  }
}

// a {
//   color: #333 !important;
// }

.sitemore {
  .ant-select-selection.ant-select-selection--single {
    height: 28px !important;
  }

  margin-left: 5px;
  align-items: center;

  .ant-select-selection--multiple {
    width: 100%;
    height: 28px;

    .ant-select-selection__rendered {
      height: 100%;
      ul {
        width: 100%;
        height: 28px;
        overflow-y: hidden;
        display: -webkit-box;
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        &::-webkit-scrollbar-track {
          background-color: #dedede;
          -webkit-border-radius: 1em;
          -moz-border-radius: 1em;
          border-radius: 1em;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #bfbfbf;
          -webkit-border-radius: 1em;
          -moz-border-radius: 1em;
          border-radius: 1em;
        }
        & li {
          padding: 0px 10px 0px 5px;
          box-sizing: border-box;
          width: 75px;
          float: unset;
          margin-top: 1px !important;
        }

        /deep/.ant-select-selection__choice {
          margin-top: 1px !important;
        }
      }
    }
  }
}

.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}
.table-page-search-wrapper {
  padding-bottom: 10px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 10px;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px !important;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}

.div-radio {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  .radio-item {
    display: flex;
    // color: white;
    overflow: hidden;
    padding: 10px 20px;
    align-items: center;
    flex-direction: row;
    &:hover {
      cursor: pointer;
    }

    .table-operator {
      margin-bottom: 30px;
      float: right !important;
    }
  }

  .checked-btn {
    // background-color: #eff7ff;
    color: #1890ff;
    border-bottom: #1890ff 2px solid;
  }

  .text-color {
    background-color: #eff7ff;
    color: #1890ff;
  }

  // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
  .checked-icon {
    filter: drop-shadow(#1890ff 200px 0);
    transform: translateX(-200px);
  }
}

.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>
   
   <style lang="less">
.top-title {
  .ant-select-selection__rendered {
    li {
      margin-top: 1px !important;
    }
  }
}
</style>

<style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>
     
    