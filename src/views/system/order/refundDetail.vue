<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="action-row" style="margin-top: -15px !important; margin-left: -18px">
        <a-button type="link" icon="left" @click="goBack()">返回</a-button>
        <span style="font-size: 14px; color: #4d4d4d">{{ queryParams.billDate }}对账单</span>
      </div>
    </div>

    <div class="recon-content">
      <div style="margin-top: 5px; color: #4d4d4d">对账状态：</div>
      <div class="red-text" v-if="isNot">
        {{ statusName }}
      </div>
      <div class="div-status" v-else>
        {{ statusName }}
      </div>

      <a-button type="primary" ghost icon="export" style="margin-left: 8px; margin-right: 0" @click="exportExcel"
        >导出</a-button
      >
    </div>

    <div class="div-radio">
      <div
        v-for="(item, index) in tabDataList"
        :key="index"
        :value="item.chanelName"
        class="radio-item"
        :class="{ 'checked-btn': item.isChecked }"
        @click="onRadioClick(index)"
      >
        <span style="margin-left: 3px">{{ item.chanelName + '（' + item.total + '）' }}</span>
      </div>
    </div>

    <div class="tab-all-content">
      <!-- 订单总额 -->
      <div class="tab-total">
        <div class="content-dis">
          <a-icon style="width: 14px; height: 16px; margin-top: 7px" type="container" />
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">{{ totalDataList[0].title }}</span>
          <div style="float: right">
            <img style="padding-left: 110px; margin-top: -10px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ totalDataList[0].totalFee }}</span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px"
            >(差异：{{ totalDataList[0].diffFee }})</span
          >
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ totalDataList[0].totalCount }}</span>
          <span style="font-size: 12px; margin-left: 5px">(差异：{{ totalDataList[0].diffCount }})</span>
        </div>
      </div>

      <!-- 微信支付 -->
      <div class="tab-wx">
        <div class="content-dis">
          <a-icon style="width: 14px; height: 16px; margin-top: 7px" type="wechat" />
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">{{ totalDataList[1].title }}</span>
          <div style="float: right">
            <img style="padding-left: 74px; margin-top: -8px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ totalDataList[1].totalFee }}</span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px"
            >(差异：{{ totalDataList[1].diffFee }})</span
          >
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ totalDataList[1].totalCount }}</span>
          <span style="font-size: 12px; margin-left: 5px">(差异：{{ totalDataList[1].diffCount }})</span>
        </div>
      </div>

      <!-- 支付宝支付 -->
      <div class="tab-alipay">
        <div class="content-dis">
          <a-icon style="width: 14px; height: 16px; margin-top: 7px" type="alipay" />
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">{{ totalDataList[2].title }}</span>
          <div style="float: right">
            <img style="padding-left: 61px; margin-top: -9px" src="@/assets/icons/tc.png" />
          </div>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px">{{ totalDataList[2].totalFee }}</span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px"
            >(差异：{{ totalDataList[2].diffFee }})</span
          >
        </div>
        <div class="line"></div>
        <div class="content-dis">
          <span style="font-size: 12px">总笔数：{{ totalDataList[2].totalCount }}</span>
          <span style="font-size: 12px; margin-left: 5px">(差异：{{ totalDataList[2].diffCount }})</span>
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
      <span slot="refundOrderId" slot-scope="text, record">
        <a @click="goRufundDetail(record)"
          ><a-icon style="margin-right: 5px" type="hdd"></a-icon>{{ record.refundOrderId }}</a
        >
      </span>
      <span slot="orderId" slot-scope="text, record">
        <a @click="goOrderDetail(record)"><a-icon style="margin-right: 5px" type="hdd"></a-icon>{{ record.orderId }}</a>
      </span>
      <span slot="status" slot-scope="text, record" :class="getColor(record.billStatus)">
        {{ record.statusName }}
      </span>
    </s-table>
  </a-card>
</template>
       
       <script>
import { STable } from '@/components'
import {
  refundRecordPage,
  refundRecordTab,
  refundRecordChannelSummary,
  refundRecordExport,
} from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      treeData: [],
      gropListData: [],
      packgeList: [],
      confirmLoading: false,

      //默认为获取总数请求参数，先获取总数，然后获取tab，然后tab切换可以更新列表
      queryParams: {
        billDate: undefined,
        hospitalCode: undefined,
        payeeId: undefined,
        channel: 'all',
      },
      selectChannel: 'all',

      // 表头
      columns: [
        {
          title: '退款单号',
          // dataIndex: 'refundOrderId',
          scopedSlots: { customRender: 'refundOrderId' },
        },
        {
          title: '原订单号',
          // dataIndex: 'orderId',
          scopedSlots: { customRender: 'orderId' },
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
          title: '退款单时间',
          dataIndex: 'refundTime',
        },
        {
          title: '收款方',
          dataIndex: 'payeeName',
        },
        {
          title: '退款流水号',
          dataIndex: 'refundAgtOrdNum',
          align: 'right',
        },
        {
          title: '应退',
          dataIndex: 'refundTotal',
          align: 'right',
        },
        {
          title: '实退',
          dataIndex: 'actualRefundTotal',
          align: 'right',
        },
        {
          title: '退款方式',
          dataIndex: 'refundMode',
          //   width: 160,
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatusDesc',
        },
        {
          title: '差异状态',
          scopedSlots: { customRender: 'status' },
        },
        //   {
        //     title: '操作',
        //     fixed: 'right',
        //     with: 130,
        //     dataIndex: 'action',
        //     scopedSlots: { customRender: 'action' },
        //   },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let params = {
          billDate: this.queryParams.billDate,
          hospitalCode: this.queryParams.hospitalCode,
          payeeId: this.queryParams.payeeId,
          channel: this.selectChannel,
        }
        return refundRecordPage(Object.assign(parameter, params))
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
                // 0 正常
                // 1 长款
                // 2 短款
                if (item.billStatus == 0) {
                  this.$set(item, 'statusName', '正常')
                } else if (item.billStatus == 1) {
                  this.$set(item, 'statusName', '长款')
                } else {
                  this.$set(item, 'statusName', '短款')
                }
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
      statusName: '',
      isNot: false,
      totalDataList: [{}, {}],
      tabDataList: [],
    }
  },

  activated() {
    // console.log('KKKppppppppppp:',this.queryParams.orderStatus)
    this.leadingOut()
  },

  watch: {
    $route(to, from) {
      console.log('watch----refundDetail out', to, from)
      if (to.path.indexOf('refundDetail') > -1) {
        console.log('watch----refundDetail', to, from)
        let data = JSON.parse(this.$route.query.dataStr)
        console.log('data---', data)

        this.queryParams.billDate = data.billDate
        this.statusName = data.statusName
        this.isNot = this.statusName == '有差异'?true:false
        this.queryParams.hospitalCode = data.hospitalCode
        this.queryParams.payeeId = data.payeeId
        this.getTotalList()
      }
    },
  },

  created() {
    let data = JSON.parse(this.$route.query.dataStr)
    console.log('data---', data)

    this.queryParams.billDate = data.billDate
    this.statusName = data.statusName
    this.isNot = this.statusName == '有差异'?true:false
    this.queryParams.hospitalCode = data.hospitalCode
    this.queryParams.payeeId = data.payeeId
    this.getTotalList()
  },

  methods: {
    goRufundDetail(record) {
      this.$router.push({
        path: '/order/refundExamine',
        query: {
          // orderId: record.refundOrderId,
          orderId: record.applyRefundId,
        },
      })
    },
    goOrderDetail(record) {
      this.$router.push({
        path: '/order/orderDetail',
        query: {
          orderId: record.orderId,
        },
      })
    },
    getTotalList() {
      let data = JSON.parse(JSON.stringify(this.queryParams))
      refundRecordChannelSummary(data).then((res) => {
        if (res.code == 0) {
          this.totalDataList = res.data
          this.getTabList()
        } else {
          // this.$message.error('获取失败：' + res.message)
        }
        // this.confirmLoading=false
      })
    },

    exportExcel() {
      let params = JSON.parse(JSON.stringify(this.queryParams))
      refundRecordExport(params)
        .then((res) => {
          this.downloadfile(res)
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
    },

    downloadfile(res) {
      var blob = new Blob([res.data], { type: 'application/msexcel; charset=UTF-8' })
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

    getTabList() {
      let params = {
        billDate: this.queryParams.billDate,
        hospitalCode: this.queryParams.hospitalCode,
        payeeId: this.queryParams.payeeId,
      }
      refundRecordTab(params).then((res) => {
        if (res.code == 0) {
          this.tabDataList = res.data
          this.tabDataList.forEach((item) => {
            this.$set(item, 'isChecked', false)
          })
          this.queryParams.payeeId = this.tabDataList[0].payeeId
          this.$set(this.tabDataList[0], 'isChecked', true)
          this.$refs.table.refresh()
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    //状态；0正常 1 长款 2 短款
    getColor(state) {
      if (state == 1) {
        return 'span-blue'
      } else if (state == 2) {
        return 'span-red'
      } else {
        return 'span-gray'
      }
    },

    isLoading() {
      return this.confirmLoading
    },

    //导出
    leadingOut() {},

    //返回
    goBack() {
      this.$bus.$emit('orderRefresh', '刷新数据')
      this.$router.go(-1)
      // this.$router.back()
    },

    onRadioClick(index) {
      //如果在加载中  不让点击
      if (this.confirmLoading) {
        return
      }

      this.tabDataList.forEach((item) => {
        this.$set(item, 'isChecked', false)
      })
      // console.log('watch----configEdit', to, from)
      this.$set(this.tabDataList[index], 'isChecked', true)
      this.selectChannel = this.tabDataList[index].channel
      this.$refs.table.refresh()
    },

    handleOk() {
      this.getTabOut()
      this.$refs.table.refresh()
    },
  },
}
</script>
       
  <style lang="less" scoped>
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
  .red-text {
    margin-top: 5px;
    color: #f21010 !important;
  }
  .div-status {
    margin-top: 5px;
    color: #0e9b0b;
  }
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
      height: calc(100% - 238px);
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