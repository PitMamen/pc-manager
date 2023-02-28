<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="action-row" style="margin-top: -15px !important; margin-left: -18px">
        <a-button type="link" icon="left" @click="goBack()">返回</a-button>
        <span style="font-size: 14px; color: #4d4d4d">{{ reconData }}对账单</span>
      </div>
    </div>

    <div class="recon-content">
      <div style="margin-top: 5px; color: #4d4d4d">对账状态：</div>
      <div :class="getStyle(statusShow)">{{ statusShow }}</div>
      <a-button type="primary" ghost icon="export" style="margin-left: 8px; margin-right: 0" @click="leadingOut()"
        >导出</a-button
      >
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.channel == 'all' }" @click="onRadioClick('all')">
        <span style="margin-left: 3px">全部({{ numberData.all }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.channel == 'wechat' }" @click="onRadioClick('wechat')">
        <span style="margin-left: 3px">微信支付({{ numberData.wechat }}) </span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.channel == 'alipay' }" @click="onRadioClick('alipay')">
        <span style="margin-left: 3px">支付宝支付({{ numberData.zhifub }})</span>
      </div>

      <!-- <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'wc' }" @click="onRadioClick('wc')">
            <span style="margin-left: 3px">已完成({{ numberData.wc }})</span>
          </div> -->
    </div>

    <div class="tab-all-content">
      <!-- 订单总额 -->
      <div class="tab-total">
        <div class="content-dis">
          <a-icon style="width: 14px; height: 16px; margin-top: 7px" type="container" />
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">{{SummaryDataList[0].title}}</span>
          <div style="float: right">
            <img style="padding-left: 110px; margin-top: -10px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ SummaryDataList[0].totalFee }}</span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">(差异：{{ SummaryDataList[0].diffFee }})</span>
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ SummaryDataList[0].totalCount }}</span>
          <span style="font-size: 12px; margin-left: 5px">(差异：{{ SummaryDataList[0].diffCount }})</span>
        </div>
      </div>

      <!-- 微信支付 -->
      <div class="tab-wx">
        <div class="content-dis">
          <a-icon style="width: 14px; height: 16px; margin-top: 7px" type="wechat" />
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">{{SummaryDataList[1].title}}</span>
          <div style="float: right">
            <img style="padding-left: 74px; margin-top: -8px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ SummaryDataList[1].totalFee }}</span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">(差异：{{ SummaryDataList[1].diffFee }})</span>
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ SummaryDataList[1].totalCount }}</span>
          <span style="font-size: 12px; margin-left: 5px">(差异：{{ SummaryDataList[1].diffCount }})</span>
        </div>
      </div>

      <!-- 支付宝支付 -->
      <div class="tab-alipay">
        <div class="content-dis">
          <img style="width: 14px; height: 16px; margin-top: 5px" src="@/assets/icons/zhifubao.png" />
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">{{SummaryDataList[2].title}}</span>
          <div style="float: right">
            <img style="padding-left: 61px; margin-top: -9px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ SummaryDataList[2].totalFee }}</span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">(差异：{{ SummaryDataList[2].diffFee }})</span>
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ SummaryDataList[2].totalCount }}</span>
          <span style="font-size: 12px; margin-left: 5px">(差异：{{ SummaryDataList[2].diffCount }})</span>
        </div>
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

      <span slot="ordrstatus" slot-scope="text, record" style="color:#409EFF" >
        {{ record.orderStatusDesc }}
      </span>
    </s-table>
    <orderDetail ref="orderDetail" @ok="handleOk" />
  </a-card>
</template>
       
       <script>
import { STable } from '@/components'
import moment from 'moment'
import {
  tradeRecordTab,
  tradeRecordPage,
  tradeRecordChannelSummary,
  tradeRecordExport,
} from '@/api/modular/system/posManage'
import { getDateNow, getCurrentMonthLast } from '@/utils/util'
import addForm from './addForm'
import orderDetail from './orderDetail'

export default {
  components: {
    STable,
    addForm,
    orderDetail,
    // editForm,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      orderTimeValue: [],
      SummaryDataList:[],
      confirmLoading: false,
      currentTab: 0,
      numberData: {
        all: 0,
        wechat: 0,
        zhifub: 0,
      },
      queryParams: {
        billDate: '',
        channel: 'all',
        payeeId: 0,
      },

      reconData: '',  //对账 日期
      statusShow: '',  //状态

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderId',
          ellipsis: true,
        },
        {
          title: '用户姓名',
          dataIndex: 'name',
        },
        {
          title: '手机号',
          dataIndex: 'phone',
        },
        {
          title: '套餐名称',
          dataIndex: 'commodityName',
          ellipsis: true,
        },
        {
          title: '医院名称',
          dataIndex: 'hospitalName',
        },
        {
          title: '应收',
          dataIndex: 'orderTotal',
          align: 'right',
        },
        {
          title: '实收',
          dataIndex: 'payTotal',
          align: 'right',
        },
        {
          title: '下单时间',
          dataIndex: 'orderTime',
          //   width: 160,
        },

        {
          title: '支付方式',
          dataIndex: 'payMode',
        },
        {
          title: '支付流水号',
          dataIndex: 'agtOrdNum',
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatusDesc',
          scopedSlots: { customRender: 'ordrstatus' },
        },
        {
          title: '差异状态',
          dataIndex: 'billStatusDesc',
          scopedSlots: { customRender: 'billStatus' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
        this.queryParamsTemp.payeeId = this.currentTab
        return tradeRecordPage(Object.assign(parameter, this.queryParams))
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
                // this.$set(item, 'serveTime', item.startTime + ' ' + item.endTime)
                // this.$set(item, 'status', 1)
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
    if (this.$route.query) {
      this.reconData = this.$route.query.billDate
      this.statusShow = this.$route.query.state
      this.currentTab = this.$route.query.payeeId
      this.queryParams.billDate = this.reconData
      this.queryParams.payeeId = this.currentTab
      this.getTabOut()
     this.tradeRecordChannelSummaryOut()
     this.$refs.table.refresh()


      // var orderId = this.$route.query.orderId
      // this.init(orderId)
    }
  },

  created() {
    this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
  },

  methods: {

      //汇总信息
      tradeRecordChannelSummaryOut(){
        tradeRecordChannelSummary(this.queryParams).then((res)=>{
        if(res.code==0){
          this.SummaryDataList = res.data
        }
        
      })
    },

    // getType(record) {
    //   if (record.value == 1) {
    //     return '运营审核'
    //   } else if (record.value == 2) {
    //     return '财务审核'
    //   } else if (record.value == 3) {
    //     return '审核拒绝'
    //   } else if (record.value == 4) {
    //     return '退款中'
    //   } else if (record.value == 5) {
    //     return '退款失败'
    //   } else if (record.value == 6) {
    //     return '已完成'
    //   }
    // },

    getColor(value) {
      if (value ==0) {
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


    //导出
    leadingOut() {

      tradeRecordExport(this.queryParams)
        .then((res) => {
          this.downloadfile(res)
          // eslint-disable-next-line handle-callback-err
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
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
      this.$bus.$emit('orderRefresh', '刷新数据')
      this.$router.go(-1)
      // this.$router.back()
    },

    //订单分组
    getTabOut() {
      tradeRecordTab(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              if (res.data[index].channel == 'all') {
                //全部
                this.numberData.all = res.data[index].total
              } else if (res.data[index].channel == 'wechat') {
                //微信
                this.numberData.wechat = res.data[index].total
              } else if (res.data[index].channel == 'alipay') {
                //支付宝
                this.numberData.zhifub = res.data[index].total
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
      this.queryParams.channel = type
      this.queryParamsTemp.channel = type
      // this.getTabOut()
      this.tradeRecordChannelSummaryOut()
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

    //下单时间
    onChangeOrder(momentArr, dateArr) {
      this.orderTimeValue = momentArr
      this.queryParams.refundStartTime = dateArr[0]
      this.queryParams.refundEndTime = dateArr[1]
    },

    handleOk() {
      this.getTabOut()
      this.tradeRecordChannelSummaryOut()
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
    background: #f28c73;
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
    background: #8fcb4a;

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
    background: #5794e9;
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
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 138px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 48px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>