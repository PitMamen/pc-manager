<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">关键字查询:</span>
        <a-input
          v-model="queryParams.keyWord"
          allow-clear
          placeholder="可输入患者姓名或电话号码查询"
          style="width: 168px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">申请时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset(true)">重置</a-button>
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.status == '' }" @click="onRadioClick('')">
        <span style="margin-left: 3px">全部({{ numberData.TotalNum }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.status == 2 }" @click="onRadioClick(2)">
        <span style="margin-left: 3px">待接收({{ numberData.ReqCheckedNum }}) </span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.status == 4 }" @click="onRadioClick(4)">
        <span style="margin-left: 3px">已收治({{ numberData.CheckedNum }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.status == 5 }" @click="onRadioClick(5)">
        <span style="margin-left: 3px">不予收治({{ numberData.UncheckedNum }})</span>
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
        <a @click="goDetail(record)"><a-icon style="margin-right: 5px" type="hdd"></a-icon>详情</a>

        <a @click="goPrint" style="margin-left: 8px"><a-icon style="margin-right: 5px" type="printer" />打印</a>

        <a @click="goComment" style="margin-left: 8px"><a-icon style="margin-right: 5px" type="message" />评论</a>
      </span>

      <span style="cursor: pointer;" slot="actionstatus" slot-scope="text, record" :class="getColor(record)" @click="seekReason(record)">
        {{ getType(record) }}
      </span>
    </s-table>
    <!-- <recordDetail ref="recordDetail" @ok="handleOk" /> -->
  </a-card>
</template>
   
   <script>
import { STable } from '@/components'
import moment from 'moment'
import {
  orderList,
  accessHospitals,
  getOrderStatusGroupByData,
  qryDepartmentByReq,
  qryReferralListByPage,
  qryReferralCount,
} from '@/api/modular/system/posManage'
import { formatDate, getDateNow, getCurrentMonthLast } from '@/utils/util'
//   import recordDetail from './recordDetail'

export default {
  components: {
    STable,
    //   recordDetail
    // addForm,
    //   orderDetail,
    //   yzOrderDetail,
    //   continuationDetail,
    //   prescriptionDetail,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      treeData: [],
      departmentList: [],
      confirmLoading: false,
      currentTab: '',
      numberData: {
        TotalNum: 0,
        ReqCheckedNum: 0,
        CheckedNum: 0,
        UncheckedNum: 0,
      },
      queryParams: {
        keyWord: '',
        regTimeBegin: getDateNow(),
        regTimeEnd: getCurrentMonthLast(),
        status: '',
        flag: 1,
      },

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '患者姓名',
          dataIndex: 'name',
          ellipsis: true,
        },

        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄',
          dataIndex: 'userAge',
        },
        {
          title: '初步诊断',
          dataIndex: 'diagnos',
        },

        {
          title: '类型',
          dataIndex: 'tradeType',
        },

        {
          title: '转诊原因',
          dataIndex: 'referralReason',
        },
        {
          title: '申请机构',
          dataIndex: 'outHospitalName',
          align: 'right',
        },
        {
          title: '申请医生',
          dataIndex: 'reqDocName',
          align: 'right',
        },
        {
          title: '到院时间',
          dataIndex: 'serveTime',
        },

        {
          title: '转入科室',
          dataIndex: 'inDept',
          align: 'center',
        },
        {
          title: '收治医生',
          dataIndex: 'docName',
        },

        {
          title: '收治情况',
          dataIndex: 'statusShow',
          scopedSlots: { customRender: 'actionstatus' },
        },

        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
        this.queryParamsTemp.status = this.currentTab
        return qryReferralListByPage(Object.assign(parameter, this.queryParams))
          .then((res) => {
            if (res.code == 0 && res.data.rows.length > 0) {
              //组装控件需要的数据结构
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.total,
                totalPage: res.data.total / parameter.pageSize,
                rows: res.data.rows,
              }

              //设置序号
              data.rows.forEach((item, index) => {
                this.$set(item, 'serveTime', item.reachBeginDate + '至' + item.reachEndDate)
                this.$set(item, 'userName', item.userInfo ? item.userInfo.userName : '')
                this.$set(item, 'userSex', item.userInfo ? item.userInfo.userSex : '')
                this.$set(item, 'userAge', item.userInfo ? item.userInfo.userAge : '')
                this.$set(item, 'statusShow', item.status.value)
                this.$set(item, 'tradeType', item.tradeType.description)
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
    this.reset(false)
    this.queryParams.status = this.currentTab
    this.queryParamsTemp.status = this.currentTab
  },

  created() {
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

    this.getOrderStatusGroupByDataOut()
  },

  mounted() {
    this.$bus.$on('refreshtransinManage', (record) => {
      console.log('refreshtransinManage', record)
      this.$refs.table.refresh()

      
    })
  },

  methods: {
    seekReason(record) {
      //    只有是 收治未通过审核的 才允许进入详情界面 查看不审核通过原因
      if (record.status.value == 5) {
        this.goDetail(record)
      }
    },

    // 去详情
    goDetail(record) {
      this.$router.push({
        name: 'transinDetail',
        // path: '/servicewise/projectEdit',
        query: {
          id: record.tradeId,
        },
      })
    },

    goPrint() {
      //TODO
      this.$message.success('去打印')
    },

    goComment() {
      this.$message.success('去评论')
    },

    getType(record) {
      if (record.status.value == 4) {
        return '已收治'
      } else if (record.status.value == 2) {
        return '待接收'
      } else if (record.status.value == 5) {
        return '不予收治'
      }
    },

    getColor(record) {
      if (record.status.value == 4) {
        return 'span-green'
      } else if (record.status.value == 5) {
        return 'span-red'
      } else if (record.status.value == 2) {
        return 'span-gray'
      }
    },

    reset(clearTime) {
      this.queryParams.keyWord = ''

      if (clearTime) {
        this.createValue = []
      } else {
        this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
      }
      this.queryParams.regTimeBegin = clearTime ? '' : getDateNow()
      this.queryParams.regTimeEnd = clearTime ? '' : getCurrentMonthLast()
      this.queryParams.status = ''
      this.handleOk()
    },

    //订单分组
    getOrderStatusGroupByDataOut() {
      qryReferralCount(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              this.numberData.TotalNum = res.data.TotalNum
              this.numberData.ReqCheckedNum = res.data.ReqCheckedNum
              this.numberData.CheckedNum = res.data.CheckedNum
              this.numberData.UncheckedNum = res.data.UncheckedNum
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
      this.queryParams.status = type
      this.queryParamsTemp.status = type
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

    onChange(momentArr, dateArr) {
      if (dateArr[0] == '' && dateArr[1] == '') {
        this.queryParams.regTimeBegin = ''
        this.queryParams.regTimeEnd = ''
        return
      }

      this.createValue = momentArr
      this.queryParams.regTimeBegin = dateArr[0]
      this.queryParams.regTimeEnd = dateArr[1]
    },

    //挂号时间
    onChangeOrder(momentArr, dateArr2) {
      //   if (Math.abs(moment(dateArr2[1]).unix() - moment(dateArr2[0]).unix()) > 7776000) {
      //     this.$message.error('开始时间与结束时间跨度不能超过三个月!')
      //     this.createValue = []
      //     this.queryParams.createStartTime = ''
      //     this.queryParams.createEndTime = ''
      //     return
      //   }
      //   if (dateArr2) {
      //     if (dateArr2[0] > dateArr2[1]) {
      //       this.$message.error('开始时间不能大于结束时间')
      //       this.createValue = []
      //       this.queryParams.updateStartTime = ''
      //       this.queryParams.updateEndTime = ''
      //       return
      //     }
      //   }

      //   if (dateArr2[0] == '' && dateArr2[1] == '') {
      //     this.queryParams.createStartTime = ''
      //     this.queryParams.createEndTime = ''
      //     return
      //   }
      if (dateArr2[0] == '' && dateArr2[1] == '') {
        this.queryParams.appointStartTime = ''
        this.queryParams.appointEndTime = ''
        return
      }

      this.queryParams.appointStartTime = dateArr2[0] + ' 00:00:00'
      this.queryParams.appointEndTime = dateArr2[1] + ' 23:59:59'
    },

    handleOk() {
      this.queryParams.status = ''
      this.getOrderStatusGroupByDataOut()
      this.$refs.table.refresh()
    },
  },
}
</script>
   
   <style lang="less" scoped>
.span-blue {
  //   background-color: #ecf5ff;
  padding: 2px 10px;
  font-size: 12px;
  color: #3894ff;
  //   border: #3894ff 1px solid;
}

.span-green {
  //   background-color: #edffed;
  padding: 2px 10px;
  font-size: 12px;
  color: #69c07d;
  //   border: #69c07d 1px solid;
}

.span-green-p {
  //   background-color: #edffed;
  padding: 2px 4px;
  font-size: 12px;
  color: #69c07d;
  //   border: #69c07d 1px solid;
}

.span-red {
  //   background-color: #fff2f1;
  padding: 2px 10px;
  font-size: 12px;
  color: #f26161;
  //   border: #f26161 1px solid;
}

.span-red-p {
  //   background-color: #fff2f1;
  padding: 2px 4px;
  font-size: 12px;
  color: #f26161;
  //   border: #f26161 1px solid;
}

.span-gray {
  //   background-color: #fafafa;
  padding: 2px 10px;
  font-size: 12px;
  color: #4d4d4d;
  //   border: #4d4d4d 1px solid;
}

.span-green {
  padding: 2px 10px;
  font-size: 12px;
  color: #69c07d;
  // background-color: #85888e;
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
     
  