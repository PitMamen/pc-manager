<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.combinedCondition"
          allow-clear
          placeholder="输入用户名/电话/订单号"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">套餐类型:</span>
        <a-select v-model="queryParams.classifyId" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in packgeList" :key="index" :value="item.id">{{
            item.classifyName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">更新时间:</span>
        <a-range-picker style="width: 185px" :value="orderTimeValue" @change="onChange" />
      </div>

      <div class="search-row">
        <span class="name">创建时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChangeOrder" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset(true)">重置</a-button>
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'qb' }" @click="onRadioClick('qb')">
        <span style="margin-left: 3px">全部订单({{ numberData.quanbu }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'yy' }" @click="onRadioClick('yy')">
        <span style="margin-left: 3px">运营审核({{ numberData.yy }}) </span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'cw' }" @click="onRadioClick('cw')">
        <span style="margin-left: 3px">财务退款({{ numberData.cw }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'wc' }" @click="onRadioClick('wc')">
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
        <!-- {{ getType(record) }} -->
        {{ record.status.description }}
      </span>
    </s-table>
    <orderDetail ref="orderDetail" @ok="handleOk" />
  </a-card>
</template>
   
   <script>
import { STable } from '@/components'
import moment from 'moment'
import { queryHospitalList, getCommodityClassify, getTab, getPage } from '@/api/modular/system/posManage'
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
      createValue: [],
      orderTimeValue: [],
      treeData: [],
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

      queryParams: {
        classifyId: undefined,
        combinedCondition: undefined,
        hospitalCode: undefined,
        createEndTime: getCurrentMonthLast(),
        createStartTime: getDateNow(),

        updateEndTime: getCurrentMonthLast(),
        updateStartTime: getDateNow(),
        tabCode: '',
      },

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '订单号',
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
    // console.log('KKKppppppppppp:',this.queryParams.orderStatus)
    this.reset(false)
    this.queryParams.tabCode = this.currentTab
    this.queryParamsTemp.tabCode = this.currentTab
  },

  created() {
    this.queryHospitalListOut()
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

    this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

    this.getTabOut()

    getCommodityClassify({}).then((res) => {
      if (res.code == 0) {
        this.packgeList = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    //详情
    goExamine(record) {
      // this.$refs.orderDetail.orderDetail(record)
      this.$router.push({
        path: '/order/refundExamine',
        query: {
          orderId: record.applyId,
          // orderId:1623236088379908098,
        },
      })
    },

    getType(record) {
      if (record.value == 1) {
        return '运营审核'
      } else if (record.value == 2) {
        return '财务审核'
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
      } else if (value == 3 || value == 5) {
        return 'span-red'
      } else if (value == 6) {
        return 'span-blue'
      } else if (value == 4) {
        return 'span-gray'
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
      queryHospitalList(queryData)
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

    reset(clearTime) {
      this.queryParams.combinedCondition = ''
      this.queryParams.hospitalCode = undefined
      if (clearTime) {
        this.createValue = []
        this.orderTimeValue = []
      }
      this.queryParams.createStartTime = clearTime ? '' : getDateNow() + ' 00:00:00'
      this.queryParams.createEndTime = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'
      this.queryParams.updateStartTime = clearTime ? '' : getDateNow() + ' 00:00:00'
      this.queryParams.updateEndTime = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'
      this.queryParams.classifyId = ''

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

        this.orderTimeValue=[]
        this.queryParams.updateStartTime = ''
        this.queryParams.updateEndTime = ''
        return
      }
      if (dateArr) {
        if (dateArr[0] > dateArr[1]) {
          this.$message.error('开始时间不能大于结束时间')
          this.orderTimeValue=[]
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
        this.createValue=[]
        this.queryParams.createStartTime = ''
        this.queryParams.createEndTime = ''
        return
      }
      if (dateArr2) {
        if (dateArr2[0] > dateArr2[1]) {
          this.$message.error('开始时间不能大于结束时间')
          this.createValue=[]
          this.queryParams.updateStartTime = ''
          this.queryParams.updateEndTime = ''
          return
        }
      }

      if (dateArr2[0] == '' && dateArr2[1] == '') {
        this.queryParams.createStartTime = ''
        this.queryParams.createEndTime = ''
        return
      }

      this.createValue = momentArr
      this.queryParams.createStartTime = dateArr2[0] + ' 00:00:00'
      this.queryParams.createEndTime = dateArr2[1] + ' 23:59:59'
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