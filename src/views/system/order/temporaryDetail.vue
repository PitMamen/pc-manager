<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper" style="margin-bottom: 10px">
      <div class="action-row" style="margin-top: -15px !important; margin-left: -18px; width: 100%">
        <a-button type="link" icon="left" @click="goBack()">返回</a-button>
        <span style="font-size: 14px; color: #4d4d4d">{{ record.user_name }}交易详情</span>
        <span style="font-size: 14px; color: #4d4d4d; margin-left: 78%">钱包余额：￥</span>
        <span style="font-size: 14px; color: #1990ec; margin-left: auto">{{ record.settlement_sum }}</span>
        <div style="display: flex; flex-wrap: wrap; margin-left: auto"></div>
      </div>
    </div>

    <span v-if="bankList.length > 0" style="color: #1a1a1a; margin-left: 10px; margin-top: 10px; font-weight: bold"
      >绑定账户</span
    >

    <div class="tab-all-content">
      <!-- 订单总额 -->
      <div class="tab-total" v-if="bankList.length >= 1">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 2px; margin-top: 3px; width: 73%">{{ bankList[0].bankName }}</span>
          <div style="float: right; margin-left: 25px">
            <img style="margin-top: -10px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <span style="margin-left: 20px; margin-top: -5px; color: #ffffff">储蓄卡</span>
        <span style="margin-left: 20px; margin-top: 20px; color: #ffffff">{{
          bankList[0].bankCard.replace(/(?<=\d{4})\d+(?=\d{4})/, ' **** **** ')
        }}</span>
      </div>

      <div class="tab-wx" v-if="bankList.length >= 2">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 2px; margin-top: 3px; width: 73%">{{ bankList[1].bankName }}</span>
          <div style="float: right; margin-left: 25px">
            <img style="margin-top: -10px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <span style="margin-left: 20px; margin-top: -5px; color: #ffffff">储蓄卡</span>
        <span style="margin-left: 20px; margin-top: 20px; color: #ffffff">{{
          bankList[1].bankCard.replace(/(?<=\d{4})\d+(?=\d{4})/, ' **** **** ')
        }}</span>
      </div>

      <div class="tab-alipay" v-if="bankList.length >= 3">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 2px; margin-top: 3px; width: 73%">{{ bankList[2].bankName }}</span>
          <div style="float: right; margin-left: 25px">
            <img style="margin-top: -10px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <span style="margin-left: 20px; margin-top: -5px; color: #ffffff">储蓄卡</span>
        <span style="margin-left: 20px; margin-top: 20px; color: #ffffff">{{
          bankList[2].bankCard.replace(/(?<=\d{4})\d+(?=\d{4})/, ' **** **** ')
        }}</span>
      </div>
    </div>

    <span style="color: #1a1a1a; margin-left: 10px; margin-top: 10px; font-weight: bold">交易明细</span>

    <div style="margin-top: 10px; margin-bottom: 10px" class="search-row">
      <span style="margin-left: 10px; color: #4d4d4d">交易时间：</span>
      <a-month-picker
          placeholder="选择月份"
          :allow-clear="false"
          :disabled-date="disabledDate"
          :default-value="nowMonth"
          :format="monthFormat"
          v-model="queryParams.createdTime"
        />
      <a-button style="margin-left: 5px" type="primary" icon="search" @click="handleOk()">查询</a-button>
    </div>

    <div class="div-radio" style="margin-bottom: 10px">
      <div class="radio-item" :class="{ 'checked-btn': currentTab == 'all' }" @click="onRadioClick('all')">
        <span style="margin-left: 3px">全部</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': currentTab == 'settle' }" @click="onRadioClick('settle')">
        <span style="margin-left: 3px">结算</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': currentTab == 'withdrawal' }" @click="onRadioClick('withdrawal')">
        <span style="margin-left: 3px">提现</span>
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
      <span slot="billStatus" slot-scope="text, record" :class="getColor(record.billStatus)">
        {{ record.billStatusDesc }}
      </span>

      <span slot="ordrstatus" slot-scope="text, record" style="color: #409eff">
        {{ record.orderStatusDesc }}
      </span>
    </s-table>
  </a-card>
</template>
           
           <script>
import { STable } from '@/components'
import moment from 'moment'
import {
  getOrderSettlementDetailForUserId,
  getBankListByUserId,
  getPcTradeRecord,
} from '@/api/modular/system/posManage'
import { getMonthNow, getCurrentMonthLast } from '@/utils/util'
import addForm from './addForm'

export default {
  components: {
    STable,
    addForm,
  },

  data() {
    return {
      monthFormat: 'YYYY-MM',
      dateFormat: 'YYYY-MM-DD',
      orderTimeValue: [],
      confirmLoading: false,
      bankList: [],
      record: {},
      currentTab: 'all',
      queryParams: {
        createdTime: getMonthNow(),
        tabStr: 'all',
        userId: 2042,
      },
      nowMonth: '',

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '交易订单',
          dataIndex: 'orderId',
          ellipsis: true,
        },

        {
          title: '交易类型',
          dataIndex: 'orderTypeDesc',
          ellipsis: true,
        },

        {
          title: '结算大类',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '结算单号',
          dataIndex: 'userPhone',
          ellipsis: true,
        },

        {
          title: '账户',
          dataIndex: 'commodityName',
          ellipsis: true,
        },
        {
          title: '交易金额',
          dataIndex: 'orderTotal',
          align: 'right',
          ellipsis: true,
        },

        {
          title: '管理费',
          dataIndex: 'realTotalPayMoney',
          align: 'right',
          ellipsis: true,
        },

        {
          title: '钱包余额',
          dataIndex: 'orderTime',
          ellipsis: true,
          //   width: 160,
        },

        {
          title: '交易结果',
          dataIndex: 'orderTime',
          ellipsis: true,
          //   width: 160,
        },

        {
          title: '交易时间',
          dataIndex: 'endtime',
          ellipsis: true,
          //   width: 160,
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParams.createdTime = this.formatDate(this.queryParams.createdTime).substring(0, 7)
        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
        return getPcTradeRecord(Object.assign(parameter, this.queryParamsTemp))
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
                // this.$set(item, 'orderTypeDesc', item.orderType.description)
                // this.$set(item, 'orderId', item.orderIdStr)
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
    this.getBankListByUserIdOut()
  },

  watch: {
    $route(to, from) {
      console.log('ddd:', from)
      if (to.path.indexOf('temporaryDetail') > -1) {
        console.log("11111111111111111")
        this.initData()
      }
    },
  },

  created() {
    this.queryParams.createdTime = moment(getMonthNow(), this.monthFormat)
    this.nowMonth = moment(getMonthNow(), this.monthFormat)
    this.queryParams.createdTime = this.formatDate(this.queryParams.createdTime).substring(0, 7)
    // this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

    this.initData()
  },

  methods: {


    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },




    onRadioClick(type) {
      //如果在加载中  不让点击
      if (this.confirmLoading) {
        return
      }
      this.currentTab = type
      this.queryParams.tabStr = type
      // this.queryParamsOrigin.settlementStatus = type
      // this.queryParamsGroup.settlementType = type
      this.$refs.table.refresh()
    },

    //更新时间
    onChange(momentArr, dateArr) {
      this.orderTimeValue = momentArr
      // this.queryParamsGroup.startTime = dateArr[0]  //开始时间
      // this.queryParamsGroup.endTime = dateArr[1]    //结束时间
    },

    initData() {
      this.record = JSON.parse(this.$route.query.dataStr)
      console.log('FFFF:', this.record)
      this.queryParams.userId = this.record.userId

      this.$refs.table.refresh()
    },

    // 获取银行卡列表
    getBankListByUserIdOut() {
      getBankListByUserId({ userId: this.record.userId }).then((res) => {
        if (res.code == 0) {
          this.bankList = res.data
        }
      })
    },

    getorderType(string) {
      if (string == 'consultOrder') {
        return '在线咨询'
      } else if (string == 'srvPackOrder') {
        return '专科服务'
      }
    },

    getColor(value) {
      if (value == 0) {
        return 'span-gray'
      } else if (value == 2) {
        return 'span-red'
      } else if (value == 1) {
        return 'span-blue'
      }
    },

    getStyle(value) {
      if (value == '无差异') {
        return 'green-color'
      } else if (value == '有差异') {
        return 'red-color'
      }
    },

    isLoading() {
      return this.confirmLoading
    },

    downloadfile(res) {
      var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      var filename = result[1]
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      var reg = /^["](.*)["]$/g
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href)
    },

    //返回
    goBack() {
      this.$router.go(-1)
      // this.$router.back()
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

    //下单时间
    onChangeOrder(momentArr, dateArr) {
      this.orderTimeValue = momentArr
      this.queryParams.refundStartTime = dateArr[0]
      this.queryParams.refundEndTime = dateArr[1]
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>
           
           <style lang="less" scoped>
.green-color {
  color: #0e9b0b;
  margin-top: 5px;
}

.red-color {
  color: #f21010;
  margin-top: 5px;
}

.span-blue {
  background-color: #ecf5ff;
  padding: 2px 4px;
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
  border: #0e9b0b 1px solid;
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
  padding: 2px 4px;
  font-size: 12px;
  color: #4d4d4d;
  border: #4d4d4d 1px solid;
  // background-color: #85888e;
}

.span-green {
  padding: 2px 4px;
  font-size: 12px;
  color: #69c07d;
  // background-color: #85888e;
}
.small-modal {
  display: flex;
  flex-direction: column;

  .tital-t {
    display: flex;
    flex-direction: row;
  }
}

.recon-content {
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  margin-top: 10px;
}

.table-page-search-wrapper {
  // padding-bottom: 10px !important;
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

.tab-all-content {
  display: flex;
  flex-direction: row;
  width: 100%;

  .tab-total {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 260px;
    height: 120px;
    background: #e57490;
    box-shadow: 0px 2px 4px 0px rgba(242, 140, 115, 0.35);

    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .tab-wx {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 260px;
    height: 120px;
    background: #15a663;

    .content-dis {
      margin-left: 15px;
      margin-top: 8px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .tab-alipay {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 260px;
    height: 120px;
    background: #1084ce;
    box-shadow: 0px 2px 4px 0px rgba(87, 148, 233, 0.35);
    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      // margin-right: 15px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
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
    background-color: #eff7ff;
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
      
       <style lang="less" scoped>
/deep/.ant-card-body {
  margin-top: -20px;
}
</style>
             
             <style lang="less" scoped>
.ant-layout-content {
  height: calc(100vh - 82px) !important;
}
</style>