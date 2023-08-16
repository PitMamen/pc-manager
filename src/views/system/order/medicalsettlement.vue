<template>
  <a-card :bordered="false" class="sys-card">
    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParams.checkStatus == 0 }" @click="onRadioClick(0)">
        <span style="margin-left: 3px">待结算</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.checkStatus == 1 }" @click="onRadioClick(1)">
        <span style="margin-left: 3px">已结算</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.checkStatus == 2 }" @click="onRadioClick(2)">
        <span style="margin-left: 3px">不予结算</span>
      </div>
    </div>

    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 230px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">医护人员:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="输入用户名/医生"
          style="width: 188px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">订单完成时间:</span>
        <a-month-picker
          placeholder="选择月份"
          :allow-clear="false"
          :disabled-date="disabledDate"
          :default-value="nowMonth"
          :format="monthFormat"
          v-model="queryParams.statMonth"
        />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <a-button
      style="margin-top: 15px; margin-bottom: 15px"
      type="primary"
      icon="safety"
      ghost
      @click="goSettlement('agree')"
      >结算</a-button
    >
    <a-button
      style="margin-left: 20px; margin-top: 15px; margin-bottom: 15px"
      type="primary"
      icon="stop"
      ghost
      @click="goSettlement('disagree')"
      >不予结算</a-button
    >

    <s-table
      bordered
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="action" slot-scope="text, record">
        <a-icon type="export" style="color: #1890ff; margin-right: 3px" />
        <a @click="goExamine(record)">详情</a>
      </span>
    </s-table>

    <settlement ref="settlement" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import { getMonthNow } from '@/utils/util'
import { accessHospitals, getTbBizMerchantPageList } from '@/api/modular/system/posManage'
import settlement from './settlement'
import moment from 'moment'
export default {
  components: {
    STable,
    settlement,
  },
  data() {
    return {
      monthFormat: 'YYYY-MM',
      dateFormat: 'YYYY-MM-DD',
      nowMonth: '',
      fetching: false,
      user: {},

      selectedRowKeys: [],
      selectedRows: [],
      queryParams: {
        hospitalCode: undefined,
        checkStatus: '',
        statMonth: getMonthNow(), //statMonth
      },
      queryParamsOrigin: {
        hospitalCode: undefined,
        checkStatus: '',
        statMonth: getMonthNow(), //statMonth
      },
      treeData: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '医疗机构',
          dataIndex: 'hospitalName',
          width: 120,
          ellipsis: true,
        },

        {
          title: '医生姓名',
          dataIndex: 'docName',
          width: 120,
          ellipsis: true,
        },

        {
          title: '人员类型',
          dataIndex: 'peopletype',
          width: 120,
          ellipsis: true,
        },

        {
          title: '手机号码',
          dataIndex: 'phone',
          width: 120,
          ellipsis: true,
        },

        {
          title: '身份证号码',
          dataIndex: 'cardNo',
          width: 120,
          ellipsis: true,
        },

        {
          title: '合计',
          dataIndex: 'consultOrder',
          children: [
            {
              title: '待结算笔数',
              dataIndex: 'wechat1',
              align: 'center',
              //   key: 'wechat',
              // width: 100,
            },
            {
              title: '待结算金额',
              dataIndex: 'alipay1',
              align: 'center',
              //   key: 'alipay',
              // width: 100,
            },
          ],
        },
        {
          title: '在线咨询',
          dataIndex: 'srvPackOrder',
          children: [
            {
              title: '待结算笔数',
              dataIndex: 'wechat2',
              align: 'center',
              //   key: 'wechat',
              // width: 100,
            },
            {
              title: '待结算金额',
              dataIndex: 'alipay2',
              align: 'center',
              //   key: 'alipay',
              // width: 100,
            },
          ],
        },
        {
          title: '专科服务',
          dataIndex: 'appPreRegister',
          children: [
            {
              title: '待结算笔数',
              dataIndex: 'wechat4',
              align: 'center',
              //   key: 'wechat',
              // width: 100,
            },
            {
              title: '待结算金额',
              dataIndex: 'alipay4',
              align: 'center',
              //   key: 'alipay',
              // width: 100,
            },
          ],
        },
        {
          title: '操作',
          // fixed: 'right',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getTbBizMerchantPageList(Object.assign(parameter, this.queryParams)).then((res) => {
          let data = {}
          if (res.code == 0 && res.data && res.data.records.length > 0) {
            //组装控件需要的数据结构
            data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            //设置序号
            data.rows.forEach((item, index) => {
              item.configData.forEach((itemChilden, indexChilden) => {
                //在线咨询
                if (itemChilden.order_type == 'consultOrder') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat1', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay1', itemChilden.name)
                  }
                  //   专科服务
                } else if (itemChilden.order_type == 'srvPackOrder') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat2', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay2', itemChilden.name)
                  }
                  //   复诊续方
                } else if (itemChilden.order_type == 'appPreRegister') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat3', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay3', itemChilden.name)
                  }
                  //   在线咨询处方
                } else if (itemChilden.order_type == 'consultOrderPrescription') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat4', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay4', itemChilden.name)
                  }
                  //   本院复诊处方
                } else if (itemChilden.order_type == 'appPrePrescription') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat5', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay5', itemChilden.name)
                  }
                }
              })
              //   this.$set(item, 'key', item.hospitalCode)
            })
          }
          return data
        })
      },
    }
  },

  mounted() {},

  watch: {},

  created() {
    this.queryHospitalListOut()
    this.queryParams.statMonth = moment(getMonthNow(), this.monthFormat)
    this.nowMonth = moment(getMonthNow(), this.monthFormat)
    this.queryParams.statMonth = this.formatDate(this.queryParams.statMonth).substring(0, 7)
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
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

    /**
     * 全选
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("vvvv:",selectedRowKeys,selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },


 //更新选中
 updateSelect() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.updateSelect(this.selectedRowKeys, [])
      this.$refs.table.updateSelect(this.selectedRows, [])
    },







    // 不予结算/结算 点击
    goSettlement(type) {
      console.log('444:', type)
      this.$refs.settlement.settltmentOut(type)
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

    onRadioClick(type) {
      //如果在加载中  不让点击
      if (this.confirmLoading) {
        return
      }
      this.currentTab = type
      this.queryParams.checkStatus = type
      this.queryParamsOrigin.checkStatus = type
      this.$refs.table.refresh()
    },

    handleOk() {
      this.refresh()
    },
    refresh() {
      this.$refs.table.refresh(true)
    },

    editPlan(record) {
      this.$router.push({
        name: 'package_config_edit',
        query: {
          recordStr: JSON.stringify(record),
        },
      })
    },

    //详情
    goExamine(record) {
      // this.$refs.orderDetail.orderDetail(record)
      this.$router.push({
        path: '/order/settlementDetail',
        query: {
          billDate: '2023-08-01',
          state: '无差异',
          payeeId: 0,
          hospitalCode: this.queryParams.hospitalCode,
        },
      })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.refresh()
    },
  },
}
</script>
    <style lang="less" scoped>
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
  padding-bottom: 20px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}

.div-radio {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;
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

.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>
    
    <!-- tree-select限制高度 -->
    <style>
.ant-select-tree-dropdown {
  max-height: 60vh !important;
}
</style>
    
    