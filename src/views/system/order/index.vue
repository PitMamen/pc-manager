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
           v-model="queryParams.queryStr"
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
           v-model="queryParams.queryStr"
           allow-clear
           placeholder="可输入医生姓名查询"
           style="width: 120px; height: 28px"
           @keyup.enter="$refs.table.refresh(true)"
           @search="$refs.table.refresh(true)"
         />
         <!-- <a-select v-model="queryParams.execDoctorUserId" placeholder="请选择" allow-clear style="width: 120px">
           <a-select-option v-for="(item, index) in docList" :value="item.userId" :key="index">{{
             item.userName
           }}</a-select-option>
         </a-select> -->
       </div>

       <div class="search-row">
         <span class="name">套餐类型:</span>
         <a-select v-model="queryParams.execDoctorUserId" placeholder="请选择" allow-clear style="width: 120px">
           <a-select-option v-for="(item, index) in packgeList" :value="item.id" :key="index">{{
             item.name
           }}</a-select-option>
         </a-select>
       </div>

       <div class="search-row">
         <span class="name">套餐名称:</span>
         <a-input
           v-model="queryParams.queryStr"
           allow-clear
           placeholder="可输入套餐名称查询"
           style="width: 120px; height: 28px"
           @keyup.enter="$refs.table.refresh(true)"
           @search="$refs.table.refresh(true)"
         />
       </div>
 
       <div class="search-row">
         <span class="name">下单时间:</span>
         <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
       </div>
 
       <!-- <div class="search-row">
         <span class="name">患者查找:</span>
         <a-input
           v-model="queryParams.queryStr"
           allow-clear
           placeholder="输入患者姓名或手机号码"
           style="width: 120px; height: 28px"
           @keyup.enter="$refs.table.refresh(true)"
           @search="$refs.table.refresh(true)"
         />
       </div> -->
 
       <div class="action-row">
         <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
           <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
           <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
         </span>
       </div>
     </div>
 
     <div class="div-radio">
       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 1 }" @click="onRadioClick(1)">
         <img
           style="width: 13px; height: 13px"
           :class="{ 'checked-icon': queryParams.type == 1 }"
           src="~@/assets/icons/icon_wait.svg"
         /><span style="margin-left: 3px">全部订单</span>
       </div>
       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 2 }" @click="onRadioClick(2)">
         <img
           :class="{ 'checked-icon': queryParams.type == 2 }"
           style="width: 13px; height: 13px"
           src="~@/assets/icons/icon_completed.svg"
         /><span style="margin-left: 3px">待付款({{2}}) </span>
       </div>
       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 3 }" @click="onRadioClick(3)">
         <img
           :class="{ 'checked-icon': queryParams.type == 3 }"
           style="width: 13px; height: 13px"
           src="~@/assets/icons/sfsb.png"
         /><span style="margin-left: 3px">待发货({{12}})</span>
       </div>
 
       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 4 }" @click="onRadioClick(4)">
         <img
           :class="{ 'checked-icon': queryParams.type == 4 }"
           style="width: 13px; height: 13px"
           src="~@/assets/icons/sfyq.png"
         /><span style="margin-left: 3px">待收货({{35}})</span>
       </div>

       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 5 }" @click="onRadioClick(5)">
         <img
           :class="{ 'checked-icon': queryParams.type == 5 }"
           style="width: 13px; height: 13px"
           src="~@/assets/icons/sfyq.png"
         /><span style="margin-left: 3px">使用中({{36}})</span>
       </div>

       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 6 }" @click="onRadioClick(6)">
         <img
           :class="{ 'checked-icon': queryParams.type == 6 }"
           style="width: 13px; height: 13px"
           src="~@/assets/icons/sfyq.png"
         /><span style="margin-left: 3px">已完成({{36}})</span>
       </div>

       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 7 }" @click="onRadioClick(7)">
         <img
           :class="{ 'checked-icon': queryParams.type == 7 }"
           style="width: 13px; height: 13px"
           src="~@/assets/icons/sfyq.png"
         /><span style="margin-left: 3px">退款中({{36}})</span>
       </div>

       
       <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 8 }" @click="onRadioClick(8)">
         <img
           :class="{ 'checked-icon': queryParams.type == 8 }"
           style="width: 13px; height: 13px"
           src="~@/assets/icons/sfyq.png"
         /><span style="margin-left: 3px">已取消({{(12)}})</span>
       </div>
     </div>
 
 
 
     <s-table
       :scroll="{ x: true }"
       ref="table"
       size="default"
       :columns="columns"
       :data="loadData"
       :alert="true"
       :rowKey="(record) => record.id"
     >
       <span slot="action" slot-scope="text, record">
         <a @click="goDetail(record)"><a-icon style="margin-right:5px" type="hdd"></a-icon>详情</a>
         <!-- <a-divider v-if="showLine" type="vertical" />
         <a v-if="showOrHide(record, queryParams.type)" @click="goCheck(record)">{{
           getText(record.auditResultStatus.value)
         }}</a>
         <a-divider type="vertical" />
         <a @click="gotransfer(record)" :disabled="checkDis(record.status)"><a-icon style="margin-right:5px" type="swap"></a-icon>转移</a> -->
       </span>
 
       <!-- 审核   只显示审核不通过的  未审核  审核通过不显示  v-if="record.auditResultStatus.value == 2" -->
       <span
         slot-scope="text, record"
         :title="showTitle(record)"
         slot="examine11"
         :class="getClass(record.auditResultStatus.value)"
       >
         {{ record.auditResultStatus.description }}
       </span>
 
       <!-- 计划日期 -->
       <span slot="planTime" slot-scope="text, record" :class="getClass1(record.overdueStatus.value)">
         {{ record.actualExecTime }}
       </span>
     </s-table>
     <examine ref="examine" @ok="handleOk" />
     <transfer ref="transfer" @ok="handleOk" />
     <followModel ref="followModel" @ok="handleOk" />
     <check ref="check" @ok="handleOk" />
   </a-card>
 </template>
 
 <script>
 import { STable } from '@/components'
 import moment from 'moment'
 import { getOrders,queryHospitalList } from '@/api/modular/system/posManage'
 import { formatDate, getDateNow, getlastMonthToday } from '@/utils/util'
 import addForm from './addForm'
 
 export default {
   components: {
     STable,
     addForm,
     // editForm,
   },
 
   data() {
     return {
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      treeData:[],
       packgeList:[
        {id:1,name:'图文咨询'},
        {id:1,name:'视频咨询'},
        {id:1,name:'电话咨询'},
       ],
 
       papa:1,
       queryParams: {
        hospitalCode:undefined,
         type: 1,
         beginExecuteTime: formatDate(new Date()),
         endExecuteTime: formatDate(new Date()),
         execDoctorUserId: undefined,
         messageOriginalId: undefined,
         executeDepartmentIds: [],
         queryStr: '',
         taskBizStatus: 1, // 1==待随访  2==随访成功  3=随访失败
         overdueStatus: '', // 随访逾期
         auditStatus: '', //  1 = 待核查  2 = 已核查
       },
       // 表头
       columns: [
         {
           title: '订单号',
           dataIndex: 'orderId',
         },
         {
           title: '用户姓名',
           dataIndex: 'orderTime',
         },
         {
           title: '手机号',
           dataIndex: 'functionTypeName',
         },
         {
           title: '套餐名称',
           dataIndex: 'userNameIn',
         },
         {
           title: '医院名称',
           dataIndex: 'userIdIn',
         },
         {
           title: '医生',
           dataIndex: 'status',
           scopedSlots: { customRender: 'status' },
         },
         {
           title: '应付',
           dataIndex: 'accountSum',
         },
         {
           title: '实付',
           dataIndex: 'shifu',
         },
         {
           title: '服务时间',
           dataIndex: 'servetime',
         },
         {
           title: '支付方式',
           dataIndex: 'paystay',
         },
         {
           title: '状态',
           dataIndex: 'status',
         },
         {
           title: '操作',
           width: '150px',
           dataIndex: 'action',
           scopedSlots: { customRender: 'action' },
         },
       ],
       // 加载数据方法 必须为 Promise 对象
       loadData: (parameter) => {
         if (this.queryParams.status == -1) {
           delete this.queryParams.status
         }
         if (this.queryParams.functionType == -1) {
           this.queryParams.functionType = ''
         }
 
         if (this.queryParams.startOrderTime && this.queryParams.endOrderTime) {
           if (this.queryParams.startOrderTime > this.queryParams.endOrderTime) {
             this.$message.error('请选择开始时间小于结束时间')
             delete this.queryParams.startOrderTime
             delete this.queryParams.endOrderTime
             this.$refs.table.refresh()
             return
           }
           if (this.queryParams.startOrderTime) {
             let start = this.formatDate(this.queryParams.startOrderTime)
             this.queryParams.startOrderTime = start + ' 00:00:00'
           }
 
           if (this.queryParams.endOrderTime) {
             let end = this.formatDate(this.queryParams.endOrderTime)
             this.queryParams.endOrderTime = end + ' 23:59:59'
           }
         } else {
           delete this.queryParams.startOrderTime
           delete this.queryParams.endOrderTime
         }
 
         return getOrders(Object.assign(parameter, this.queryParams)).then((res) => {
           for (let i = 0; i < res.data.rows.length; i++) {
             this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
             // this.$set(res.data.rows[i], 'userName', res.data.rows[i].userInfo.userName)
 
             if (res.data.rows[i].userInfo) {
               this.$set(res.data.rows[i], 'userNameIn', res.data.rows[i].userInfo.userName)
               this.$set(res.data.rows[i], 'userIdIn', res.data.rows[i].userInfo.userId)
             }
             this.$set(
               res.data.rows[i],
               'functionTypeName',
               res.data.rows[i].functionType == 0 ? '健康管家在线' : '互联网医院'
             )
 
             //订单状态（1：待支付 2：已完成 3：支付中 4：待收货 5：订单取消 6：已退款 7：已配送
             if (res.data.rows[i].status == 1) {
               this.$set(res.data.rows[i], 'statusText', '待支付')
             } else if (res.data.rows[i].status == 2) {
               this.$set(res.data.rows[i], 'statusText', '已完成')
             } else if (res.data.rows[i].status == 3) {
               this.$set(res.data.rows[i], 'statusText', '支付中')
             } else if (res.data.rows[i].status == 4) {
               this.$set(res.data.rows[i], 'statusText', '待收货')
             } else if (res.data.rows[i].status == 5) {
               this.$set(res.data.rows[i], 'statusText', '订单取消')
             } else if (res.data.rows[i].status == 6) {
               this.$set(res.data.rows[i], 'statusText', '已退款')
             } else if (res.data.rows[i].status == 7) {
               this.$set(res.data.rows[i], 'statusText', '已配送')
             }
           }
           return res.data
         })
       },
     }
   },
 
   created() {
    this.queryHospitalListOut()
    this.createValue = [
      moment(this.formatDate(new Date()), this.dateFormat),
      moment(this.formatDate(new Date()), this.dateFormat),
    ]
   },
 
   methods: {

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


    onRadioClick(type){
     this.queryParams.type = type
     this.handleOk()
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
       this.queryParams.startOrderTime = dateArr[0]
       this.queryParams.endOrderTime = dateArr[1]
     },
 
    //  downloadfile(res) {
    //    var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
    //    var contentDisposition = res.headers['content-disposition']
    //    var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
    //    var result = patt.exec(contentDisposition)
    //    var filename = result[1]
    //    var downloadElement = document.createElement('a')
    //    var href = window.URL.createObjectURL(blob) // 创建下载的链接
    //    var reg = /^["](.*)["]$/g
    //    downloadElement.style.display = 'none'
    //    downloadElement.href = href
    //    downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
    //    document.body.appendChild(downloadElement)
    //    downloadElement.click() // 点击下载
    //    document.body.removeChild(downloadElement) // 下载完成移除元素
    //    window.URL.revokeObjectURL(href)
    //  },
 
     handleOk() {
       this.$refs.table.refresh()
     },
   },
 }
 </script>
 
 <style lang="less" scoped>
 .span-blue {
   padding: 1% 2%;
   font-size: 12px;
   color: #3894ff;
   // background-color: #3894ff;
 }
 
 .span-red {
   padding: 1% 2%;
   font-size: 12px;
   color: #f26161;
   // background-color: #f26161;
 }
 
 .span-gray {
   padding: 1% 2%;
   font-size: 12px;
   color: #4d4d4d;
   // background-color: #85888e;
 }
 
 .span-green {
   padding: 1% 2%;
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