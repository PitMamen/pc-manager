<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">生产厂商:</span>
        <a-select v-model="queryParams.factoryId" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in factoryListData" :key="item.id" :value="item.id">{{ item.factoryName
          }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select v-model="queryParams.hospitalCode" multiple style="min-width: 120px" :tree-data="treeData"
          placeholder="请选择" allow-clear tree-default-expand-all>
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">对账月份:</span>
        <a-month-picker placeholder="选择月份" :allow-clear="false" :disabled-date="disabledDate" :default-value="nowMonth"
          :format="monthFormat" v-model="queryParams.statMonth" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button type="primary" ghost icon="export" style="margin-left: 8px; margin-right: 0"
            @click="leadingOut()">导出</a-button>
        </span>
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
          <span style="font-size: 12px;  margin-top: 3px">退款金额</span>
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
          <span style="font-size: 12px;  margin-top: 3px">结算金额</span>
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

    <!-- <div class="div-radio">
      <div v-for="(item, index) in tabDataList" :key="index" :value="item.payeeId" class="radio-item"
        :class="{ 'checked-btn': item.isChecked }" @click="onRadioClick(index)">
        <span style="margin-left: 3px">{{ item.payeeName }}</span>
      </div>
    </div> -->

    <s-table bordered :scroll="{ x: true }" ref="table" style="margin-top: 20px;" :pageSize="10000"
      :showPagination="false" size="default" :columns="columns" :data="loadData" :alert="true"
      :rowKey="(record) => record.code">
      <span slot="action" slot-scope="text, record">
        <a @click="goExamine(record)"><a-icon type="edit" style="margin-left:10px" />详情</a>
      </span>
      </span>
    </s-table>
    <orderDetail ref="orderDetail" @ok="handleOk" />
  </a-card>
</template>
     
<script>
import { STable } from '@/components'
import moment from 'moment'
import {
  accessHospitals,
  statFactoryReport,
  exportDataTreatReport,
  qryFactoryList,
} from '@/api/modular/system/posManage'
import { getMonthNow } from '@/utils/util'
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
      monthFormat: 'YYYY-MM',
      dateFormat: 'YYYY-MM-DD',
      nowMonth: '',
      orderTimeValue: [],
      treeData: [],
      gropListData: [],
      packgeList: [],
      SummaryDataList: [],
      tabDataList: [{ payeeName: '收款单', code: 1, isChecked: true }, { payeeName: '退款单', code: 2, isChecked: false }],
      confirmLoading: false,
      currentTab: 0,
      numberData: {
        quanbu: 0,
        yy: 0,
        yiyuan: 0,
      },
      queryParams: {
        hospitalCode: undefined,
        factoryId: undefined,
        statMonth: getMonthNow(),//statMonth
        // pageNo: 0,
        // pageSize: 10,
        // type: 1,//查询类型 1收入2退费
      },
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未审核',
        },
        {
          id: 2,
          name: '已审核',
        },
        {
          id: 3,
          name: '未登记',
        },
      ],

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '产品名称',
          dataIndex: 'serviceItemName',
          align: 'center',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
        },
        {
          title: '结算金额',
          dataIndex: 'alipayTotal',
          align: 'center',
        },
        {
          title: '收入',
          dataIndex: 'alipayCount',
          align: 'center',
          children: [
            {
              title: '交易笔数',
              dataIndex: 'inNum',
              align: 'center'
            },
            {
              title: '平均价格',
              dataIndex: 'avgPrice',
              align: 'center'
            },
            {
              title: '收款金额',
              dataIndex: 'inMoney',
              align: 'center'
            },
          ],
        },
        {
          title: '退款',
          dataIndex: 'platformCount',
          align: 'center',
          children: [
            {
              title: '交易笔数',
              dataIndex: 'refundNum',
              align: 'center'
            },
            {
              title: '平均价格',
              dataIndex: 'refundAvgPrice',
              align: 'center'
            },
            {
              title: '退款金额',
              dataIndex: 'refundMoney',
              align: 'center'
            },
          ],
        },
        {
          title: '操作',
          align: 'center',
          // dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
        // this.queryParamsTemp.payeeId = this.currentTab
        return statFactoryReport(Object.assign(parameter, this.queryParams))
          .then((res) => {
            if (res.code == 0) {

              this.resData = res.data

              //组装控件需要的数据结构
              var data = {
                pageNo: 1,
                // pageSize: 10000,
                totalRows: res.data.dataList.length,
                // totalPage: res.data.dataList,
                rows: res.data.dataList,
              }

              //设置序号
              data.rows.forEach((item, index) => {
                // this.$set(item, 'status', 1)
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

      resData: {},

      factoryListData: [],
    }
  },

  created() {
    this.queryParams.statMonth = moment(getMonthNow(), this.monthFormat)
    this.nowMonth = moment(getMonthNow(), this.monthFormat)
    this.queryHospitalListOut()

    this.queryParams.statMonth = this.formatDate(this.queryParams.statMonth).substring(0, 7)
    this.qryFactoryListOut()
  },

  methods: {

    /**
 *
 * 生产厂商信息查询
 */
    qryFactoryListOut() {
      qryFactoryList({ factoryType: 4 })
        .then((res) => {
          debugger
          if (res.code == 0 && res.data.rows.length > 0) {
            this.factoryListData = res.data.rows
            debugger
            this.queryParams.factoryId = this.factoryListData[0].id
            this.handleOk()
          }
        })
    },

    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },

    //详情  传对象  这里需要把 生产厂商 查询月份 带入到详情
    goExamine(record) {
      let data = JSON.parse(JSON.stringify(record))
      this.$set(data, 'factoryId', this.queryParams.factoryId)
      this.$set(data, 'statMonth', this.queryParams.statMonth)
      this.$set(data, 'type', this.queryParams.type)
      this.$router.push({
        path: '/order/factoryDetail',
        query: {
          dataStr: JSON.stringify(data),
        },
      })
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

    //导出
    leadingOut() {
      this.queryParams.statMonth = this.formatDate(this.queryParams.statMonth).substring(0, 7)
      let params = JSON.parse(JSON.stringify(this.queryParams))
      exportDataTreatReport(params)
        .then((res) => {
          this.downloadfile(res)
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
    },

    downloadfile(res) {
      debugger
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

      if (index == this.radioIndex) {
        return
      }
      this.radioIndex = index
      // type: 1,//查询类型 1收入2退费
      this.queryParams.type = index == 0 ? 1 : 2


      this.tabDataList.forEach((item) => {
        this.$set(item, 'isChecked', false)
      })
      this.$set(this.tabDataList[index], 'isChecked', true)
      // this.queryParams.statMonth = this.formatDate(this.queryParams.statMonth).substring(0, 7)
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

    handleOk() {
      debugger
      this.queryParams.statMonth = this.formatDate(this.queryParams.statMonth).substring(0, 7)
      // this.getTabOut()
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
  // background-color: #edffed;
  padding: 2px 4px;
  font-size: 12px;
  color: #0e9b0b;
  // border: #0e9b0b 1px solid;
}

.span-red {
  // background-color: #fff2f1;
  padding: 2px 4px;
  font-size: 12px;
  color: #f26161;
  // border: #f26161 1px solid;
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

    /deep/ .ant-select-selection__choice {
      margin-top: 1px !important;
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






     
    