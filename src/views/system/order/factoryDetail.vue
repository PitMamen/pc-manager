<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="action-row" style="margin-top: -10px !important; margin-left: -18px">
        <a-button type="link" icon="left" @click="goBack()">返回</a-button>
        <span style="font-size: 14px; color: #4d4d4d">{{ passItem.statMonth + '/' + passItem.hospitalName + '/' +
          passItem.serviceItemName }}</span>
      </div>
    </div>

    <div class="tab-all-content">
      <!-- 收款金额 -->
      <div class="tab-total">
        <div class="content-dis">
          <span style="font-size: 12px; margin-top: 3px">收款金额</span>
          <div style="float: right">
            <img style="padding-left: 133px; margin-top: -10px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ resData.inTotalMoney }}</span>
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ resData.inTotalNum }}</span>
        </div>
      </div>

      <!-- 退款金额 -->
      <div class="tab-wx">
        <div class="content-dis">
          <!-- <a-icon style="width: 14px; height: 16px; margin-top: 7px" type="wechat" /> -->
          <span style="font-size: 12px; margin-top: 3px">退款金额</span>
          <div style="float: right">
            <img style="padding-left: 133px; margin-top: -8px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ resData.refundTotalMoney }}</span>
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ resData.refundTotalNum }}</span>
        </div>
      </div>

      <!-- 结算金额 -->
      <div class="tab-alipay">
        <div class="content-dis">
          <span style="font-size: 12px; margin-top: 3px">结算金额</span>
          <div style="float: right">
            <img style="padding-left: 133px; margin-top: -9px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ resData.realTotalMoney }}</span>
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ resData.totalNum }}</span>
        </div>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 1 }" @click="onRadioClick(1)">
        <span style="margin-left: 3px">收款单</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 2 }" @click="onRadioClick(2)">
        <span style="margin-left: 3px">退款单 </span>
      </div>

    </div>

    <s-table :scroll="{ x: true }" style="margin-top: 20px;" ref="table" size="default" :columns="columns"
      :data="loadData" :alert="true" :rowKey="(record) => record.code">
      <span slot="billStatus" slot-scope="text, record">
        <span class="fee-in" v-if="record.type == 1">收款</span>
        <span class="fee-refund" v-else>退款</span>
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
  statFactoryDetail,
} from '@/api/modular/system/posManage'
import { formatDateFull, formatDate } from '@/utils/util'
import addForm from './addForm'
import orderDetail from './orderDetail'
import events from '@/components/MultiTab/events'


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
      confirmLoading: false,
      currentTab: 0,

      queryParams: {
        factoryId: "",
        hospitalCode: [],
        serviceItemId: 17,
        statMonth: "",
        type: 1//查询类型 1收入2退费
      },

      reconData: '', //对账 日期
      statusShow: '', //状态

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
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '手机号',
          dataIndex: 'userPhone',
          ellipsis: true,
        },
        {
          title: '套餐名称',
          dataIndex: 'commodityName',
          ellipsis: true,
        },
        {
          title: '商品名称',
          dataIndex: 'serviceItemName',
          ellipsis: true,
        },
        {
          title: '订单金额',
          dataIndex: 'payTotal',
          align: 'right',
          ellipsis: true,
        },
        {
          title: '厂商分成',
          dataIndex: 'money',
          align: 'right',
          ellipsis: true,
        },
        {
          title: '下单时间',
          // dataIndex: 'payTime',
          dataIndex: 'payTimeStr',
          ellipsis: true,
          //   width: 160,
        },

        {
          title: '支付方式',
          dataIndex: 'payWay',
          ellipsis: true,
        },

        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          ellipsis: true,
          scopedSlots: { customRender: 'orderStatus' },
        },
        {
          title: '订单类型',
          // dataIndex: 'billStatusDesc',
          // ellipsis: true,
          scopedSlots: { customRender: 'billStatus' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
        this.queryParamsTemp.payeeId = this.currentTab
        return statFactoryDetail(Object.assign(parameter, this.queryParams))
          .then((res) => {
            if (res.code == 0) {


              this.resData = res.data

              //组装控件需要的数据结构 //查询类型 1收入2退费
              var data = {}
              if (this.queryParams.type == 1) {
                data = res.data.inData
              } else {
                data = res.data.refundData
              }

              //设置序号
              data.rows.forEach((item, index) => {
                this.$set(item, 'payTimeStr', formatDateFull(item.payTime))
                this.$set(item, 'type', this.queryParams.type)
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

      passItem: {},
      resData: {},
    }
  },

  // activated() {
  //   if (this.$route.query) {
  //     this.reconData = this.$route.query.billDate
  //     this.statusShow = this.$route.query.state
  //     this.currentTab = this.$route.query.payeeId
  //     console.log("hospitalCode:", this.$route.query.hospitalCode)
  //     this.queryParams.billDate = this.reconData
  //     this.queryParams.payeeId = this.currentTab
  //     this.queryParams.hospitalCode = this.$route.query.hospitalCode
  //     this.getTabOut()
  //     this.tradeRecordChannelSummaryOut()
  //     this.$refs.table.refresh()

  //     // var orderId = this.$route.query.orderId
  //     // this.init(orderId)
  //   }
  // },

  watch: {
    $route(to, from) {
      if (to.path.indexOf('factoryDetail') > -1) {
        this.initData()
      }
    },
  },

  created() {
    this.initData()

  },

  methods: {
    initData() {
      this.passItem = JSON.parse(this.$route.query.dataStr)
      this.queryParams.factoryId = this.passItem.factoryId
      this.queryParams.hospitalCode = []
      this.queryParams.hospitalCode.push(this.passItem.hospitalCode)
      this.queryParams.serviceItemId = this.passItem.serviceItemId
      this.queryParams.statMonth = this.passItem.statMonth
      // this.queryParams.type = this.passItem.type
      console.log('-----------------passItem', this.passItem)
      this.handleOk()
    },

    //导出
    leadingOut() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      tradeRecordExport(params)
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
      events.$emit('close')
      // this.$bus.$emit('orderRefresh', '刷新数据')
      // this.$router.go(-1)
      // this.$router.back()
    },

    onRadioClick(type) {
      //如果在加载中  不让点击
      if (this.confirmLoading) {
        return
      }

      if (type == this.queryParams.type) {
        return
      }

      this.queryParams.type = type
      this.handleOk()
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>
       
<style lang="less" scoped>
.fee-in {
  color: #0e9b0b;
  border: #0e9b0b 1px solid;
  padding: 1px 7px;
  border-radius: 3px;
  background-color: #ecf5ff;
}

.fee-refund {
  color: #f21010;
  border: #f21010 1px solid;
  padding: 1px 7px;
  border-radius: 3px;
  background-color: #ecf5ff;
}

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
  // margin-top: -20px;
}
</style>
         
<style lang="less" scoped>
.ant-layout-content {
  height: calc(100vh - 82px) !important;
}
</style>