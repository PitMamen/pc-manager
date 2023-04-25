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
          placeholder="可输入用户名/电话/订单号"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">医生:</span>
        <a-input
          v-model="queryParams.doctorName"
          allow-clear
          placeholder="可输入医生姓名查询"
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
        <span class="name">套餐名称:</span>
        <a-input
          v-model="queryParams.commodityName"
          allow-clear
          placeholder="可输入套餐名称查询"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>


      <div class="search-row">
        <span class="name">订单分类:</span>
        <a-select v-model="queryParams.orderType" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in ordertypeList" :key="index" :value="item.code">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>



      <div class="search-row">
        <span class="name">下单时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == '' }" @click="onRadioClick('')">
        <!-- <img
          style="width: 13px; height: 13px"
          :class="{ 'checked-icon': queryParams.orderStatus == '' }"
          src="~@/assets/icons/icon_wait.svg"
        /> -->
        <span style="margin-left: 3px">全部订单({{ numberData.quanbu }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 1 }" @click="onRadioClick(1)">
        <!-- <img
          :class="{ 'checked-icon': queryParams.orderStatus == 1 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/icon_completed.svg"
        /> -->
        <span style="margin-left: 3px">待付款({{ numberData.daifukuan }}) </span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 8 }" @click="onRadioClick(8)">
        <!-- <img
          :class="{ 'checked-icon': queryParams.orderStatus == 8 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfsb.png"
        /> -->
        <span style="margin-left: 3px">待发货({{ numberData.daifahuo }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 4 }" @click="onRadioClick(4)">
        <!-- <img
          :class="{ 'checked-icon': queryParams.orderStatus == 4 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /> -->
        <span style="margin-left: 3px">待收货({{ numberData.daishouhuo }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 101 }" @click="onRadioClick(101)">
        <!-- <img
          :class="{ 'checked-icon': queryParams.orderStatus == 101 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /> -->
        <span style="margin-left: 3px">使用中({{ numberData.shiyongzhong }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 2 }" @click="onRadioClick(2)">
        <!-- <img
          :class="{ 'checked-icon': queryParams.orderStatus == 2 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /> -->
        <span style="margin-left: 3px">已完成({{ numberData.yiwancheng }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 102 }" @click="onRadioClick(102)">
        <!-- <img
          :class="{ 'checked-icon': queryParams.orderStatus == 102 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /> -->
        <span style="margin-left: 3px">退款中({{ numberData.tuikuanzhong }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 5 }" @click="onRadioClick(5)">
        <!-- <img
          :class="{ 'checked-icon': queryParams.orderStatus == 5 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/bcsf.png"
        /> -->
        <span style="margin-left: 3px">已取消({{ numberData.yiquxiao }})</span>
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
      </span>

      <span slot="orderStatus" slot-scope="text, record" :class="getColor(record)">
        {{ getType(record) }}
      </span>
    </s-table>
    <orderDetail ref="orderDetail" @ok="handleOk" />
    <!-- <yzOrderDetail ref="yzOrderDetail" @ok="handleOk" /> -->
  </a-card>
</template>
 
 <script>
import { STable } from '@/components'
import moment from 'moment'
import { orderList, accessHospitals, getOrderStatusGroupByData ,getCommodityClassify} from '@/api/modular/system/posManage'
import { formatDate, getDateNow, getCurrentMonthLast } from '@/utils/util'
// import addForm from './addForm'
import orderDetail from './orderDetail'
import yzOrderDetail from './yzOrderDetail'

export default {
  components: {
    STable,
    // addForm,
    orderDetail,
    yzOrderDetail,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      treeData: [],
      gropListData: [],
      packgeList:[],
      confirmLoading:false,
      currentTab:'',
      numberData: {
        quanbu: 0,
        daifukuan: 0,
        daifahuo: 0,
        daishouhuo: 0,
        shiyongzhong: 0,
        yiwancheng: 0,
        tuikuanzhong: 0,
        yiquxiao: 0,
      },

      // queryParamGrop: {
      //   combinedCondition: '',
      //   commodityName: '',
      //   doctorName: '',
      //   hospitalCode:undefined,
      //   orderEndTime: getCurrentMonthLast(),
      //   orderStartTime:  getDateNow(),
      //   classifyId: undefined,
      // },
      queryParams: {
        combinedCondition: undefined,
        commodityName: '',
        doctorName: '',
        hospitalCode: undefined,
        orderEndTime: getCurrentMonthLast(),
        orderStartTime:  getDateNow(),
        classifyId: undefined,
        orderStatus: '',
        orderType:undefined,
      },


      ordertypeList:[{code:'consultOrder',value:'咨询订单'},{code:'srvPackOrder',value:'专科服务'},{code:'youzanOrder',value:'商城订单'}],

      queryParamsTemp:{},



      // 表头
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderId',
          ellipsis: true,
        },

        {
          title: '订单分类',
          dataIndex: 'orderTypeDesc',
          width:100,
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
          title: '所属机构',
          dataIndex: 'hospitalName',
        },
        {
          title: '医生',
          dataIndex: 'doctorName',
        },
        {
          title: '应付',
          dataIndex: 'saleAmount',
          align:'right'
        },
        {
          title: '实付',
          dataIndex: 'payTotal',
          align:'right'
        },
        {
          title: '服务时间',
          dataIndex: 'serveTime',
          width:160,
        },

        {
          title: '下单时间',
          dataIndex: 'orderTime',
          ellipsis: true,
        },
        {
          title: '支付方式',
          dataIndex: 'payType',
        },
        {
          title: '状态',
          dataIndex: 'orderStatus',
          scopedSlots: { customRender: 'orderStatus' },
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
        if (this.queryParams.orderStartTime && this.queryParams.orderEndTime) {
          if (this.queryParams.orderStartTime > this.queryParams.orderEndTime) {
            this.$message.error('请选择开始时间小于结束时间')
            delete this.queryParams.orderStartTime
            delete this.queryParams.orderEndTime
            this.$refs.table.refresh()
            return
          }
          if (this.queryParams.orderStartTime) {
            let start = this.formatDate(this.queryParams.orderStartTime)
            this.queryParams.orderStartTime = start + ' 00:00:00'
          }

          if (this.queryParams.orderEndTime) {
            let end = this.formatDate(this.queryParams.orderEndTime)
            this.queryParams.orderEndTime = end + ' 23:59:59'
          }
        } else {
          delete this.queryParams.orderStartTime
          delete this.queryParams.orderEndTime
        }

        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
        this.queryParamsTemp.orderStatus =this.currentTab
        return orderList(Object.assign(parameter, this.queryParams))
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
                this.$set(item, 'serveTime', item.startTime+" "+item.endTime)
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
    this.reset()
    this.queryParams.orderStatus = this.currentTab
    this.queryParamsTemp.orderStatus = this.currentTab
  },



  created() {
    this.queryHospitalListOut()
    this.createValue = [

    // moment(getlastMonthToday(), this.dateFormat),
    //   moment(formatDate(new Date().getTime()), this.dateFormat),

      moment(getDateNow(), this.dateFormat),
      moment(getCurrentMonthLast(), this.dateFormat),
    ]
    this.getOrderStatusGroupByDataOut()

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
    goDetail(record) {

      this.$router.push({
        path: record.orderType=='youzanOrder'?'/order/yzOrderDetail':'/order/orderDetail',
        query: {
          orderId:record.orderId,
        },
      })
    },

    getType(record) {
      if (record.orderStatus == 1) {
        return '待付款'
      } else if (record.orderStatus == 2) {
        return '已完成'
      } else if (record.orderStatus == 3) {
        return '支付中'
      } else if (record.orderStatus == 4) {
        return '待收货'
      } else if (record.orderStatus == 5) {
        return '已取消'
      } else if (record.orderStatus == 6) {
        return '未配送'
      } else if (record.orderStatus == 7) {
        return '已配送'
      } else if (record.orderStatus == 8) {
        return '待发货'
      } else if (record.orderStatus == 101) {
        return '使用中'
      } else if (record.orderStatus == 102) {
        return '退款中'
      }else if (record.orderStatus == 103) {
        return '退款成功'
      }else if (record.orderStatus == 104) {
        return '退款失败'
      }
    },

    getColor(record){
      if (record.orderStatus == 1) {
        return 'span-green'
      } else if (record.orderStatus == 2||record.orderStatus == 3||record.orderStatus == 5||record.orderStatus == 6||record.orderStatus == 7) {
        return 'span-gray'
      } else if (record.orderStatus == 4||record.orderStatus == 8||record.orderStatus == 101) {
        return 'span-blue'
      } else if (record.orderStatus == 102) {
        return 'span-red'
      }else if(record.orderStatus == 103){
        return 'span-green-p'
      }else if(record.orderStatus == 104){
        return 'span-red-p'
      }
    },

    // getClass(status) {
    //   if (status.value == 2) {
    //     return 'span-red'
    //   } else if (status.value == 1) {
    //     return 'span-gray'
    //   }
    // },


    isLoading(){
    return this.confirmLoading 
    },


    queryHospitalListOut() {
   //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    this.confirmLoading = true
      accessHospitals()
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

    reset() {
      this.queryParams.combinedCondition = ''
      this.queryParams.commodityName = ''
      this.queryParams.doctorName = ''
      this.queryParams.hospitalCode = undefined
      // this.queryParams.orderEndTime = ''
      // this.queryParams.orderStartTime = ''
      this.queryParams.classifyId = ''
      this.queryParams.orderStatus = ''
      this.queryParams.orderType = undefined
      this.handleOk()
    },

    //订单分组
    getOrderStatusGroupByDataOut() {
      getOrderStatusGroupByData(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              if (res.data[index].code == 1) {    //待付款
                this.numberData.daifukuan  = res.data[index].co
              }else if(res.data[index].code == 8){ //待发货
                this.numberData.daifahuo  = res.data[index].co
              }else if(res.data[index].code == 4){ //待收货
                this.numberData.daishouhuo  = res.data[index].co
              }else if(res.data[index].code == 101){ //使用中
                this.numberData.shiyongzhong  = res.data[index].co
              }else if(res.data[index].code == 2){ //已完成
                this.numberData.yiwancheng  = res.data[index].co
              }else if(res.data[index].code == 102){ //退款中
                this.numberData.tuikuanzhong  = res.data[index].co
              }else if(res.data[index].code == 5){  //已取消
                this.numberData.yiquxiao  = res.data[index].co
              }else if(res.data[index].code == ''){  //全部订单
                this.numberData.quanbu  = res.data[index].co
              }
              
            }
            // this.gropListData = res.data
          }
        })
        .catch((err) => {
          this.$message.error('请求错误：' + err.message)
        })
    },

    onRadioClick(type) {
       //如果在加载中  不让点击
       if(this.confirmLoading){
        return
       }
       this.currentTab = type
      this.queryParams.orderStatus = type
      this.queryParamsTemp = type
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
      this.createValue = momentArr
      this.queryParams.orderStartTime = dateArr[0]
      this.queryParams.orderEndTime = dateArr[1]
    },


    handleOk() {
      this.queryParams.orderStatus = ''
      this.getOrderStatusGroupByDataOut()
      this.$refs.table.refresh()
    },

   
  },
}
</script>
 
 <style lang="less" scoped>
.span-blue {
  background-color: #ecf5ff;
  padding: 2px 10px;
  font-size: 12px;
  color: #3894ff;
  border: #3894ff 1px solid;
  // background-color: #3894ff;
}

.span-green {
  background-color: #edffed;
  padding: 2px 10px;
  font-size: 12px;
  color: #69c07d;
  border: #69c07d 1px solid;
}

.span-green-p {
  background-color: #edffed;
  padding: 2px 4px;
  font-size: 12px;
  color: #69c07d;
  border: #69c07d 1px solid;
}

.span-red {
  background-color: #fff2f1;
  padding: 2px 10px;
  font-size: 12px;
  color: #f26161;
  border: #f26161 1px solid;
}

.span-red-p {
  background-color: #fff2f1;
  padding: 2px 4px;
  font-size: 12px;
  color: #f26161;
  border: #f26161 1px solid;
}

.span-gray {
  background-color: #fafafa;
  padding: 2px 10px;
  font-size: 12px;
  color: #4d4d4d;
  border: #4d4d4d 1px solid;
  // background-color: #85888e;
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
   
<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 115px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 137px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 72px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>