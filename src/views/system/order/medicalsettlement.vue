<template>
  <a-card :bordered="false" class="sys-card">
    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParams.settlementStatus == 1 }" @click="onRadioClick(1)">
        <img v-if="queryParams.settlementStatus == 1" src="~@/assets/icons/djs_c.png" />
        <img v-else src="~@/assets/icons/djs_n.png" />
        <span style="margin-left: 3px">待结算</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.settlementStatus == 2 }" @click="onRadioClick(2)">
        <img v-if="queryParams.settlementStatus == 2" src="~@/assets/icons/yjs_c.png" />
        <img v-else src="~@/assets/icons/yjs_n.png" />
        <span style="margin-left: 3px">已结算</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.settlementStatus == 3 }" @click="onRadioClick(3)">
        <img v-if="queryParams.settlementStatus == 3" src="~@/assets/icons/byjs_c.png" />
        <img v-else src="~@/assets/icons/byjs_n.png" />
        <span style="margin-left: 3px">不予结算</span>
      </div>
    </div>

    <div class="table-page-search-wrapper">
      <div v-if="currentTab == 1" class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 230px"
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

      <div v-if="currentTab == 1" class="search-row">
        <span class="name">医护人员:</span>
        <a-input
          v-model="queryParams.doctorName"
          allow-clear
          placeholder="输入用户名/医生"
          style="width: 188px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div v-if="currentTab == 1" class="search-row">
        <span class="name">订单完成时间:</span>
        <a-month-picker
          placeholder="选择月份"
          :allow-clear="false"
          :disabled-date="disabledDate"
          :default-value="nowMonth"
          :format="monthFormat"
          v-model="monthValue"
        />
      </div>

      <div v-if="currentTab == 2 || currentTab == 3" class="search-row">
        <span class="name">结算时间:</span>
        <a-range-picker style="width: 190px" :value="orderTimeValue" @change="onChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="refresh()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <a-button
      v-if="currentTab == 1"
      style="margin-top: 15px; margin-bottom: 15px"
      type="primary"
      icon="safety"
      ghost
      @click="goSettlement('agree')"
      >结算</a-button
    >
    <a-button
      v-if="currentTab == 1"
      style="margin-left: 20px; margin-top: 15px; margin-bottom: 15px"
      type="primary"
      icon="stop"
      ghost
      @click="goSettlement('disagree')"
      >不予结算</a-button
    >

    <s-table
      v-if="currentTab == 1"
      bordered
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.flagId"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="action" slot-scope="text, record">
        <a-icon type="export" style="color: #1890ff; margin-right: 3px" />
        <a @click="goExamine(record)">详情</a>
      </span>
    </s-table>

    <div v-if="currentTab == 2 || currentTab == 3" class="div-down">
      <div class="div-service-left-control">
        <div class="left-control" style="height: 380px">
          <div class="div-wrap-control" style="margin-top: 5%">
            <div v-if="groupListTemp && groupListTemp.length > 0">
              <div
                class="div-part"
                v-for="(item, index) in groupListTemp"
                :class="{ checked: item.isChecked }"
                :value="item.user_name"
                :key="index"
                @click="onItemClick(item, index)"
              >
                <div class="div-rate">
                  <span style="color: #999999">结算人员:{{ item.person_name }}</span>
                  <span style="margin-top: 5px; color: #999999">结算时间:{{ item.create_time }}</span>

                  <div
                    :style="{
                      'margin-top': '5px',
                      width: '100%',
                      height: '0.5px',
                      background: item.isChecked ? '#3894ff' : '#CCCCCC',
                    }"
                  ></div>

                  <span style="color: #999999; margin-top: 5px">结算金额:{{ item.settlement_sum }}</span>
                  <span style="color: #999999; margin-top: 5px">订单数量:{{ item.co }}</span>
                  <span v-if="currentTab == 3" style="display: flex; flex-wrap: wrap; color: #999999; margin-top: 5px"
                    >原因:{{ item.description }}</span
                  >
                </div>
              </div>
            </div>
            <div v-else class="no-data">
              <img src="~@/assets/icons/no_data.jpg" />
              <span style="color: #bfbfbf; margin-top: 10px">暂无数据</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div></div> -->
      <!-- 去掉勾选框 -->
      <s-table
        v-if="currentTab == 2 || currentTab == 3"
        ref="table"
        size="default"
        class="card-right-control"
        :columns="notcolumns"
        :scroll="{ x: true }"
        :isShowLoading="false"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a-icon type="export" style="color: #1890ff; margin-right: 3px" />
          <a @click="goExamine(record)">详情</a>
        </span>
      </s-table>
    </div>

    <settlement ref="settlement" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import { getMonthNow } from '@/utils/util'
import {
  accessHospitals1,
  getOrderSettlementList,
  getalreadySettlementList,
  getOrderSettlementListGroupBy,
} from '@/api/modular/system/posManage'
import settlement from './settlement'
import moment from 'moment'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import { getType } from 'ant-design-vue/es/_util/vue-types/utils'
export default {
  components: {
    STable,
    settlement,
  },
  data() {
    return {
      monthFormat: 'YYYY-MM',
      dateFormat: 'YYYY-MM-DD',
      monthValue: {}, //Date类型对象，用于与请求参数的转换
      nowMonth: '',
      fetching: false,
      localHospitalCode: undefined,
      user: {},
      currentTab: 1,
      orderTimeValue: [],
      selectedRowKeys: [],
      selectedRows: [],

      groupList: [],
      groupListTemp: [],

      queryParams: {
        hospitalCode: undefined,
        settlementStatus: 1,
        createdTime: getMonthNow(),
        doctorName: '',
      },
      queryParamsOrigin: {
        hospitalCode: undefined,
        settlementStatus: '',
        createdTime: getMonthNow(),
        doctorName: '',
      },

      queryParamsGroup: {
        endTime: '',
        settlementType: 2,
        startTime: '',
        personName: '',
        // createTime: '',
        hospitalCode: undefined,
        createdTime: getMonthNow(),
      },

      selectInfo: {
        totalMoney: 0, //'总金额'
        totalCount: 0, // '总订单数'
        personNumber: 0, //'计算人员数量
        organNumber: 0, //'机构数量

        consultMoney: 0, //'在线咨询金额
        consultCount: 0, //'在线咨询订单数

        srvPackOrderMoney: 0, //‘专科服务金额’
        srvPackOrderCount: 0, // '专科服务订单数'

        createTime: '',
      },

      selectInfoTemp: {},

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
          dataIndex: 'doctorName',
          width: 120,
          ellipsis: true,
        },

        {
          title: '人员类型',
          dataIndex: 'personType',
          width: 120,
          ellipsis: true,
        },

        {
          title: '手机号码',
          dataIndex: 'doctorPhone',
          width: 120,
          ellipsis: true,
        },

        {
          title: '身份证号码',
          dataIndex: 'doctorIdCard',
          width: 120,
          ellipsis: true,
        },

        {
          title: '合计',
          dataIndex: 'consultOrder',
          children: [
            {
              title: '待结算笔数',
              dataIndex: 'countAll',
              align: 'center',
              //   key: 'wechat',
              // width: 100,
            },
            {
              title: '待结算金额',
              dataIndex: 'payTotalAll',
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
              dataIndex: 'consultOrderCount',
              align: 'center',
              //   key: 'wechat',
              // width: 100,
            },
            {
              title: '待结算金额',
              dataIndex: 'consultOrderSum',
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
              dataIndex: 'srvPackOrderCount',
              align: 'center',
              //   key: 'wechat',
              // width: 100,
            },
            {
              title: '待结算金额',
              dataIndex: 'srvPackOrderSum',
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

      // 已结算、不予结算的表头
      // 表头
      notcolumns: [
        {
          title: '医疗机构',
          dataIndex: 'hospitalName',
          width: 120,
          ellipsis: true,
        },

        {
          title: '医生姓名',
          dataIndex: 'doctorName',
          width: 120,
          ellipsis: true,
        },

        {
          title: '身份证号码',
          dataIndex: 'doctorIdCard',
          width: 120,
          ellipsis: true,
        },

        {
          title: '手机号',
          dataIndex: 'doctorPhone',
          width: 120,
          ellipsis: true,
        },

        {
          title: '业务类型',
          dataIndex: 'personType',
          width: 120,
          ellipsis: true,
        },

        {
          title: '结算笔数',
          dataIndex: 'orderCount',
          align: 'center',
        },
        {
          title: '结算金额',
          dataIndex: 'settlementSum',
          align: 'right',
        },
        {
          title: '结算情况',
          dataIndex: 'settlementStatus',
          align: 'center',
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
        if (this.currentTab == 1) {
          this.queryParams.createdTime = this.formatDate(this.monthValue).substring(0, 7)
          return getOrderSettlementList(Object.assign(parameter, this.queryParams)).then((res) => {
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

              data.rows.forEach((item, index) => {
                this.$set(item, 'personType', this.getPersonType(item.personType))
                // this.$set(item, 'id', (data.pageNo - 1) * data.pageSize + (index + 1))
                // item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
              })
            }
            return data
          })
        } else {
          return getalreadySettlementList(Object.assign(parameter, this.queryParamsGroup)).then((res) => {
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

              data.rows.forEach((item) => {
                this.$set(item, 'settlementStatus', this.getType(item.settlementType))
                this.$set(item, 'personType', this.getorderType(item.orderType))
              })
            }
            return data
          })
        }
      },
    }
  },

  mounted() {},

  watch: {},

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
    // this.queryParams.createdTime = moment(getMonthNow(), this.monthFormat)
    this.nowMonth = moment(getMonthNow(), this.monthFormat)
    this.monthValue = moment(getMonthNow(), this.monthFormat)
    this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
  },
  methods: {
    //更新时间
    onChange(momentArr, dateArr) {
      this.orderTimeValue = momentArr
      this.queryParamsGroup.startTime = dateArr[0]
      this.queryParamsGroup.endTime = dateArr[1]
    },

    getType(value) {
      if (value == 2) {
        return '已结算'
      } else if (value == 3) {
        return '不予结算'
      }
    },

    getorderType(string) {
      if (string == 'consultOrder') {
        return '在线咨询'
      } else if (string == 'srvPackOrder') {
        return '专科服务'
      }
    },

    getPersonType(string) {
      if (string == 'doctor') {
        return '医生'
      } else if (string == 'nurse') {
        return '护士'
      }
    },

    // 左侧卡片 点击
    onItemClick(item, indexClick) {
      for (let index = 0; index < this.groupListTemp.length; index++) {
        this.$set(this.groupListTemp[index], 'isChecked', false)
      }
      this.$set(this.groupListTemp[indexClick], 'isChecked', true)
      this.queryParamsGroup.personName = item.person_name
      this.queryParamsGroup.createTime = item.create_time

      // this.choseQues = JSON.parse(JSON.stringify(this.quesData[indexClick]))
      // this.queryParams.messageContentId = this.choseQues.questionnaireId
      this.$refs.table.refresh(true)
    },

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

    // 分组
    getOrderSettlementListGroupByOut() {
      this.confirmLoading = true
      getOrderSettlementListGroupBy(this.queryParamsGroup)
        .then((res) => {
          if (res.code == 0) {
            this.groupList = res.data.records
            this.groupListTemp = res.data.records
            res.data.records.forEach((item) => {
              this.$set(this.groupListTemp[0], 'isChecked', true)
            })
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 全选
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys

      if (selectedRowKeys.length == 0) {
        this.selectedRowKeys = []
        this.clearSelectData()
        return
      }

      var RowsList = []

      selectedRowKeys.forEach((key) => {
        this.selectedRows.forEach((item) => {
          if (key == item.flagId) {
            RowsList.push(item)
          }
        })
      })

      selectedRows.forEach((row) => {
        var b = this.selectedRows.every((item) => {
          return item.flagId !== row.flagId
        })
        if (b) {
          RowsList.push(row)
        }
      })

      this.selectedRows = RowsList
      // this.updateSelect()
      // console.log('vvvv:', selectedRowKeys, this.selectedRows)
      // 计算
      this.clearSelectData()
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.selectInfo.personNumber = this.selectedRows.length
        this.selectInfo.createTime = this.queryParams.createdTime
        this.selectInfo.organNumber = this.selectedRows.length //机构数量
        for (let index = 0; index < this.selectedRows.length; index++) {
          this.selectInfo.totalMoney += Number(this.selectedRows[index].payTotalAll)
          this.selectInfo.totalCount += Number(this.selectedRows[index].countAll)
          this.selectInfo.consultMoney += Number(this.selectedRows[index].consultOrderSum)
          this.selectInfo.consultCount += Number(this.selectedRows[index].consultOrderCount)
          this.selectInfo.srvPackOrderMoney += Number(this.selectedRows[index].srvPackOrderSum)
          this.selectInfo.srvPackOrderCount += Number(this.selectedRows[index].srvPackOrderCount)
        }

        this.selectInfo.totalMoney = parseFloat(this.selectInfo.totalMoney).toFixed(3)
        this.selectInfo.consultMoney = parseFloat(this.selectInfo.consultMoney).toFixed(3)
        this.selectInfo.srvPackOrderMoney = parseFloat(this.selectInfo.srvPackOrderMoney).toFixed(3)

        this.selectInfoTemp = JSON.parse(JSON.stringify(this.selectInfo))
        // console.log('papapap:', this.selectInfoTemp)
      }
    },

    clearSelectData() {
      // console.log('调用clear！！！！')
      this.selectInfo.personNumber = 0
      this.selectInfo.organNumber = 0
      this.selectInfo.totalMoney = 0
      this.selectInfo.totalCount = 0
      this.selectInfo.consultMoney = 0
      this.selectInfo.srvPackOrderMoney = 0
      this.selectInfo.srvPackOrderCount = 0
      this.selectInfo.consultCount = 0
      this.selectInfoTemp = {}
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
      if (this.selectedRows.length == 0) {
        this.$message.error('请先勾选需操作的账单!')
        return
      }

      this.$refs.settlement.settltmentOut(this.selectedRows, this.selectInfoTemp, type)
    },

    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   accessHospitals(queryData)
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





    onRadioClick(type) {
      //如果在加载中  不让点击
      if (this.confirmLoading) {
        return
      }
      this.currentTab = type
      this.queryParams.settlementStatus = type
      this.queryParamsOrigin.settlementStatus = type
      this.queryParamsGroup.settlementType = type
      this.queryParamsGroup.hospitalCode = this.queryParams.hospitalCode
      this.queryParamsGroup.doctorName = this.queryParams.doctorName
      this.queryParamsGroup.createdTime = this.queryParams.createdTime
      if (type != 1) {
        this.getOrderSettlementListGroupByOut()
      }
      this.$refs.table.refresh()
    },

    handleOk() {
      this.updateSelect()
      this.refresh()
    },

    refresh() {
      if (this.currentTab != 1) {
        this.getOrderSettlementListGroupByOut()
      }
      this.queryParams.createdTime = this.formatDate(this.queryParams.createdTime).substring(0, 7)
      this.$refs.table.refresh(true)
    },

    //详情
    goExamine(record) {
      let data = JSON.parse(JSON.stringify(record))
      this.$set(data, 'time', this.queryParams.createdTime)
      var state = ''
      if (this.currentTab == 1) {
        state = '待结算'
      } else if (this.currentTab == 2) {
        state = '已结算'
      } else if (this.currentTab == 3) {
        state = '不予结算'
      }
      this.$set(data, 'status', state)
      this.$router.push({
        path: '/order/settlementDetail',
        query: {
          dataStr: JSON.stringify(data),
        },
      })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.orderTimeValue = []
      this.queryParamsGroup.startTime = ''
      this.queryParamsGroup.endTime = ''
      this.queryParamsGroup.doctorName = ''
      this.queryParamsGroup.hospitalCode = undefined
      this.refresh()
    },
  },
}
</script>


<style  >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 190px !important;
}
</style>

    <style lang="less" scoped>
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

// 结算  、不予结算的
.div-down {
  height: 100%;
  .div-service-left-control {
    background-color: white;
    // padding: 20px 0 20px 20px;
    float: left;
    height: 100%;
    min-height: 300px;
    // border-right: 1px dashed #e6e6e6;
    // border: 1px solid #e6e6e6;
    width: 14.5%;
    overflow: hidden;

    .left-control {
      display: flex;
      // padding: 20px 0 20px 20px;
      // padding: 10px;
      // border: 1px solid #e6e6e6;
      flex-direction: column;
      // width: 100%;
      // // height: 100%;
      // min-height: 100%;
    }

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .span-current-ques {
      //限制一行
      overflow: hidden; //溢出隐藏
      text-overflow: ellipsis; //超出省略号显示
      white-space: nowrap; //文字不换行

      height: 20px;
      width: 80%;
      display: inline-block;
      font-size: 12px;
      border-bottom: #1890ff solid 1px;
      text-align: left;
      color: #1890ff;
      font-weight: bold;
    }

    .div-text-auto {
      width: 100%;
      display: inline-block;
      margin-top: 3%;
      .ant-input {
        height: 30px;
      }
    }

    .div-wrap-control {
      // max-height: 420px;
      margin-bottom: 10px;
      overflow-y: auto !important;
      // .checked {
      //   color: #1890ff !important;
      // }

      .no-data {
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .checked {
        // color: #1890ff !important;
        border: 1px solid #1890ff !important;
        box-shadow: 0px 0px 4px 1px #409eff !important;
      }

      .div-part {
        padding: 8px;
        background: rgba(0, 1, 3, 0);
        border: 1px solid #dfe3e5;
        overflow: hidden;
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        // padding-left: 5%;
        border-bottom: #e6e6e6 1px solid;

        &:hover {
          cursor: pointer;
        }

        .span-name {
          // margin-top: 3.5%;
          // display: inline-block;
          flex: 1;
          height: 85%;
          overflow: hidden; //溢出隐藏
          text-overflow: ellipsis; //超出省略号显示
          white-space: nowrap; //文字不换行

          // padding-left: 1%;
          // color: #000;
          margin-top: 1%;
          font-size: 12px;
          // text-align: left | center;
        }

        .div-rate {
          display: flex;
          font-size: 12px;
          flex-direction: column;
          margin-right: 3%;
        }
      }
    }
  }
}

.card-right-control {
  // overflow: hidden;
  // border-left: #eee solid 1px;
  // border: #eee solid 1px;
  float: right;
  width: 84%;
  margin-top: 10px;

  /deep/ .ant-card-body {
    padding: 0px 20px !important;
  }

  .span-red {
    font-size: 12px;
    color: #f26161 !important;
    // background-color: #f26161;
  }

  .span-gray {
    padding: 1% 2%;
    font-size: 12px;
    color: #69c07d !important;
    // background-color: #85888e;
  }

  .ant-select {
    width: 90px;
  }

  .table-operator {
    margin-bottom: 18px;
  }
  button {
    margin-right: 8px;
  }

  .title {
    background: #fff;
    font-size: 18px;
    font-weight: bold;
    color: #000;
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
    
 
    
    