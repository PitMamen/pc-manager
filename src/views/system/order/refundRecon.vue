<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          allow-clear
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">对账月份:</span>
        <a-month-picker
          placeholder="选择月份"
          :default-value="nowMonth"
          :allow-clear="false"
          :disabled-date="disabledDate"
          :format="monthFormat"
          v-model="monthValue"
        />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="goQuery">查询</a-button>
          <a-button type="primary" ghost icon="export" style="margin-left: 8px; margin-right: 0" @click="exportExcel"
            >导出</a-button
          >
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div
        v-for="(item, index) in tabDataList"
        :key="index"
        :value="item.payeeId"
        class="radio-item"
        :class="{ 'checked-btn': item.isChecked }"
        @click="onRadioClick(index)"
      >
        <span style="margin-left: 3px">{{ item.payeeName + '（' + item.total + '）' }}</span>
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
          <span style="font-size: 12px">退款总笔数：{{ totalDataList[0].totalCount }}</span>
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
          <span style="font-size: 12px">退款总笔数：{{ totalDataList[1].totalCount }}</span>
          <span style="font-size: 12px; margin-left: 5px">(差异：{{ totalDataList[1].diffCount }})</span>
        </div>
      </div>

      <!-- 支付宝支付 -->
      <div class="tab-alipay">
        <div class="content-dis">
          <!-- <a-icon style="width: 14px; height: 16px;margin-top: 7px;" type="alipay" /> -->
          <img style="width: 14px; height: 16px; margin-top: 5px" src="@/assets/icons/zhifubao.png" />
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
          <span style="font-size: 12px">退款总笔数：{{ totalDataList[2].totalCount }}</span>
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
      <span slot="action" slot-scope="text, record">
        <a @click="goExamine(record)"><a-icon style="margin-right: 5px" type="hdd"></a-icon>详情</a>
      </span>

      <span slot="status" slot-scope="text, record" :class="getColor(record.state)">
        {{ record.statusName }}
      </span>
    </s-table>
    <!-- <orderDetail ref="orderDetail" @ok="handleOk" /> -->
  </a-card>
</template>
     
<script>
import { STable } from '@/components'
import moment from 'moment'
import {
  refundBillPage,
  refundBillTab,
  refundBillSummary,
  refundBillExport,
  accessHospitals,
} from '@/api/modular/system/posManage'
import { getMonthNow } from '@/utils/util'
import addForm from './addForm'
// import orderDetail from './orderDetail'

export default {
  components: {
    STable,
    addForm,
    // orderDetail,
    // editForm,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      treeData: [],
      gropListData: [],
      confirmLoading: false,
      currentTab: 'qb',
      numberData: {
        quanbu: 0,
        yy: 0,
        cw: 0,
        wc: 0,
      },
      zbs: 102,
      queryParams: {
        hospitalCode: undefined,
        billMonth: getMonthNow(),
        payeeId: undefined,
      },

      // 表头
      columns: [
        {
          title: '对账日期',
          dataIndex: 'billDate',
          ellipsis: true,
        },
        {
          title: '微信退款金额',
          dataIndex: 'wechatTotal',
        },
        {
          title: '微信退款单数',
          dataIndex: 'wechatCount',
        },
        {
          title: '支付宝退款金额',
          dataIndex: 'alipayTotal',
          ellipsis: true,
        },
        {
          title: '支付宝退款单数',
          dataIndex: 'alipayCount',
        },
        // {
        //   title: '线下退款金额',
        //   dataIndex: 'orderTotal',
        //   align: 'right',
        // },
        // {
        //   title: '线下退款单数',
        //   dataIndex: 'payTotal',
        //   align: 'right',
        // },
        {
          title: '总单数',
          dataIndex: 'platformCount',
          align: 'right',
        },
        {
          title: '应退总金额',
          dataIndex: 'platformTotal',
          //   width: 160,
        },

        {
          title: '实退总金额',
          dataIndex: 'channelTotal',
          ellipsis: true,
        },
        {
          title: '差异金额',
          dataIndex: 'diffTotal',
        },
        {
          title: '差异状态',
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
        return refundBillPage(Object.assign(parameter, this.queryParams))
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
                this.$set(item, 'statusName', item.state == 0 ? '无差异' : '有差异')
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
      monthFormat: 'YYYY-MM',
      dateFormat: 'YYYY-MM-DD',
      nowMonth: '',
      monthValue: {}, //Date类型对象，用于与请求参数的转换
      tabDataList: '',
      totalDataList: '',
    }
  },

  // activated() {
  //   this.leadingOut()
  // },

  created() {
    this.nowMonth = moment(getMonthNow(), this.monthFormat)
    this.monthValue = moment(getMonthNow(), this.monthFormat)
    this.queryHospitalListOut()

    this.getTabList(true)
  },

  methods: {
    moment,

    /**
     *
     * @param {*} needGet 是否需要全部刷新
     */
    getTabList(needGet) {
      this.queryParams.billMonth = this.formatDate(this.monthValue).substring(0, 7)
      let params = {
        billMonth: this.queryParams.billMonth,
        hospitalCode: this.queryParams.hospitalCode,
      }
      refundBillTab(params).then((res) => {
        if (res.code == 0) {
          this.tabDataList = res.data
          this.tabDataList.forEach((item) => {
            this.$set(item, 'isChecked', false)
          })
          this.queryParams.payeeId = this.tabDataList[0].payeeId
          this.$set(this.tabDataList[0], 'isChecked', true)
          if (needGet) {
            this.getTotalList(needGet)
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    getTotalList(needGet) {
      let params = {
        billMonth: this.queryParams.billMonth,
        payeeId: this.queryParams.payeeId,
        hospitalCode: this.queryParams.hospitalCode,
      }
      refundBillSummary(params).then((res) => {
        if (res.code == 0) {
          this.totalDataList = res.data
          if (needGet) {
            this.$refs.table.refresh()
          }
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },

    //详情
    goExamine(record) {
      let data = {
        billDate: record.billDate,
        statusName: record.statusName,
        hospitalCode: this.queryParams.hospitalCode,
        payeeId: this.queryParams.payeeId,
      }
      this.$router.push({
        path: '/order/refundDetail',
        query: {
          dataStr: JSON.stringify(data),
        },
      })
    },

    //状态；0正常，1异常
    getColor(state) {
      if (state == 0) {
        return 'span-green'
      } else if (state == 1) {
        return 'span-red'
      }
    },

    isLoading() {
      return this.confirmLoading
    },

    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      accessHospitals(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    exportExcel() {
      this.queryParams.billMonth = this.formatDate(this.monthValue).substring(0, 7)
      let params = JSON.parse(JSON.stringify(this.queryParams))
      refundBillExport(params)
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

    onRadioClick(index) {
      //如果在加载中  不让点击
      if (this.confirmLoading) {
        return
      }
      if (index == 2) {
        return
      }
      this.tabDataList.forEach((item) => {
        this.$set(item, 'isChecked', false)
      })
      this.$set(this.tabDataList[index], 'isChecked', true)
      this.queryParams.payeeId = this.tabDataList[index].payeeId
      this.getTotalList(true)
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

    goQuery() {
      this.getTabList(true)
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

// a {
//   color: #333 !important;
// }

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

 <style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>






     
       
       <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 98px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 158px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 98px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>