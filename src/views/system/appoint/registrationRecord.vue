<template>
    <a-card :bordered="false" class="top-title">
      <div class="table-page-search-wrapper">
  
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
          <span class="name">挂号科室:</span>
          <a-select v-model="queryParams.departmentId" placeholder="请选择科室" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in departmentList" :key="item.departmentId" :value="item.departmentId">{{ item.departmentName }}</a-select-option>
        </a-select>
        </div>
  
  
        <div class="search-row">
          <span class="name">下单时间:</span>
          <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
        </div>


        <div class="search-row">
          <span class="name">挂号时间:</span>
          <a-range-picker style="width: 185px" :value="orderTimeValue" @change="onChangeOrder" />
        </div>





  
        <div class="action-row">
          <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
            <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
            <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset(true)">重置</a-button>
          </span>
        </div>
      </div>
  
      <div class="div-radio">
        <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == '' }" @click="onRadioClick('')">
          <span style="margin-left: 3px">全部订单({{ numberData.quanbu }})</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 1 }" @click="onRadioClick(1)">
          <span style="margin-left: 3px">待付款({{ numberData.daifukuan }}) </span>
        </div>
  
        <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 2 }" @click="onRadioClick(2)">
          <span style="margin-left: 3px">成功({{ numberData.yiwancheng }})</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.orderStatus == 5 }" @click="onRadioClick(5)">
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
          <a @click="$refs.recordDetail.detail(record)"><a-icon style="margin-right: 5px" type="hdd"></a-icon>详情</a>
        </span>
  
        <span slot="orderStatus" slot-scope="text, record" :class="getColor(record)">
          {{ getType(record) }}
        </span>
      </s-table>
      <recordDetail ref="recordDetail" @ok="handleOk" />
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
  } from '@/api/modular/system/posManage'
  import { formatDate, getDateNow, getCurrentMonthLast } from '@/utils/util'
  import recordDetail from './recordDetail'
  
  export default {
    components: {
      STable,
      recordDetail
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
        orderTimeValue: [],
        treeData: [],
        departmentList:[],
        confirmLoading: false,
        currentTab: '',
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
        queryParams: {
        
          
          orderStatus: '',

          departmentId: undefined,
          doctorName: '',
          combinedCondition: '',
          orderEndTime: getCurrentMonthLast(),  //下单结束时间 
          orderStartTime: getDateNow(),   ////下单开始时间
          orderType: 'outpatientRegister',
          appointStartTime:getDateNow(),  //挂号开始时间
          appointEndTime:getCurrentMonthLast() //挂号结束时间
        },
  
  
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
          },
          {
            title: '手机号',
            dataIndex: 'userPhone',
          },
          {
            title: '所属机构',
            dataIndex: 'hospitalName',
          },
          
          {
            title: '挂号科室',
            dataIndex: 'deptName',
  
            ellipsis: true,
          },
        
          {
            title: '医生',
            dataIndex: 'doctorName',
          },
          {
            title: '应付',
            dataIndex: 'saleAmount',
            align: 'right',
          },
          {
            title: '实付',
            dataIndex: 'payTotal',
            align: 'right',
          },
          {
            title: '挂号时间',
            dataIndex: 'visitStr',
            ellipsis: true,
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
          // if (this.queryParams.orderStartTime && this.queryParams.orderEndTime) {
          //   if (this.queryParams.orderStartTime > this.queryParams.orderEndTime) {
          //     this.$message.error('请选择开始时间小于结束时间')
          //     delete this.queryParams.orderStartTime
          //     delete this.queryParams.orderEndTime
          //     this.$refs.table.refresh()
          //     return
          //   }
          //   if (this.queryParams.orderStartTime) {
          //     let start = this.formatDate(this.queryParams.orderStartTime)
          //     this.queryParams.orderStartTime = start
          //   }
  
          //   if (this.queryParams.orderEndTime) {
          //     let end = this.formatDate(this.queryParams.orderEndTime)
          //     this.queryParams.orderEndTime = end 
          //   }
          // } else {
          //   delete this.queryParams.orderStartTime
          //   delete this.queryParams.orderEndTime
          // }
  
          this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))
          this.queryParamsTemp.orderStatus = this.currentTab
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
                  this.$set(item, 'serveTime', item.startTime + ' ' + item.endTime)
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
      this.queryParams.orderStatus = this.currentTab
      this.queryParamsTemp.orderStatus = this.currentTab
    },





  
    created() {
      this.createValue = [   //下单时间
        // moment(getlastMonthToday(), this.dateFormat),
        //   moment(formatDate(new Date().getTime()), this.dateFormat),
  
        moment(getDateNow(), this.dateFormat),
        moment(getCurrentMonthLast(), this.dateFormat),
      ]

      this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]  //挂号时间
      this.getOrderStatusGroupByDataOut()
      this.qryDepartmentByReqOut()
  
    },
  
    methods: {
      qryDepartmentByReqOut(){
        
        qryDepartmentByReq({departmentType:1}).then((res)=>{
          if (res.code==0) {
             this.departmentList = res.data
          }
        })
      },






  
      getType(record) {
        if (record.orderStatus == 1) {
          return '待付款'
        } else if (record.orderStatus == 2) {
          return '已完成'
        }else if (record.orderStatus == 5) {
          return '已取消'
        } 
      },
  
      getColor(record) {
        if (record.orderStatus == 1) {
          return 'span-green'
        } else if (
          record.orderStatus == 2 ||record.orderStatus == 5
        ) {
          return 'span-gray'
        } 
      },
  
  
      reset(clearTime) {
        this.queryParams.combinedCondition = ''
        this.queryParams.doctorName = ''
        this.queryParams.departmentId = undefined

        if (clearTime) {
        this.createValue = []
        this.orderTimeValue = []
      } else {
        this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

        this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
      }
      this.queryParams.orderStartTime = clearTime ? '' : getDateNow() + ' 00:00:00'
      this.queryParams.orderEndTime = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'
      this.queryParams.appointStartTime = clearTime ? '' : getDateNow() + ' 00:00:00'
      this.queryParams.appointEndTime = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'
        this.queryParams.orderStatus = ''
        this.queryParams.orderType = 'outpatientRegister'
        this.handleOk()
      },
  
      //订单分组
      getOrderStatusGroupByDataOut() {
        getOrderStatusGroupByData(this.queryParams)
          .then((res) => {
            if (res.code == 0) {
              for (let index = 0; index < res.data.length; index++) {
                if (res.data[index].code == 1) {
                  //待付款
                  this.numberData.daifukuan = res.data[index].co
                } else if (res.data[index].code == 2) {
                  //已完成
                  this.numberData.yiwancheng = res.data[index].co
                } else if (res.data[index].code == 5) {
                  //已取消
                  this.numberData.yiquxiao = res.data[index].co
                } else if (res.data[index].code == '') {
                  //全部订单
                  this.numberData.quanbu = res.data[index].co
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
        this.queryParams.orderStatus = type
        this.queryParamsTemp.orderStatus = type
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
        this.queryParams.orderStartTime = ''
        this.queryParams.orderEndTime = ''
        return
      }


        this.createValue = momentArr
        this.queryParams.orderStartTime = dateArr[0]+ ' 00:00:00'
        this.queryParams.orderEndTime = dateArr[1]+ ' 23:59:59'
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

      this.orderTimeValue = momentArr
      this.queryParams.appointStartTime = dateArr2[0]+' 00:00:00'
      this.queryParams.appointEndTime = dateArr2[1] + ' 23:59:59'
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
     
  