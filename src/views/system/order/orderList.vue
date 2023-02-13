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
      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == '' }" @click="onRadioClick('')">
        <img
          style="width: 13px; height: 13px"
          :class="{ 'checked-icon': queryParams.orderStatus == '' }"
          src="~@/assets/icons/icon_wait.svg"
        /><span style="margin-left: 3px">全部订单({{ numberData.quanbu }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == 1 }" @click="onRadioClick(1)">
        <img
          :class="{ 'checked-icon': queryParams.orderStatus == 1 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/icon_completed.svg"
        /><span style="margin-left: 3px">待付款({{ numberData.daifukuan }}) </span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == 8 }" @click="onRadioClick(8)">
        <img
          :class="{ 'checked-icon': queryParams.orderStatus == 8 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfsb.png"
        /><span style="margin-left: 3px">待发货({{ numberData.daifahuo  }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == 4 }" @click="onRadioClick(4)">
        <img
          :class="{ 'checked-icon': queryParams.orderStatus == 4 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /><span style="margin-left: 3px">待收货({{ numberData.daishouhuo  }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == 9 }" @click="onRadioClick(9)">
        <img
          :class="{ 'checked-icon': queryParams.orderStatus == 9 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /><span style="margin-left: 3px">使用中({{numberData.shiyongzhong }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == 2 }" @click="onRadioClick(2)">
        <img
          :class="{ 'checked-icon': queryParams.orderStatus == 2 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /><span style="margin-left: 3px">已完成({{ numberData.yiwancheng }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == 102 }" @click="onRadioClick(102)">
        <img
          :class="{ 'checked-icon': queryParams.orderStatus == 102 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /><span style="margin-left: 3px">退款中({{ numberData.tuikuanzhong }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParams.orderStatus == 5 }" @click="onRadioClick(5)">
        <img
          :class="{ 'checked-icon': queryParams.orderStatus == 5 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/bcsf.png"
        /><span style="margin-left: 3px">已取消({{ numberData.yiquxiao }})</span>
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

      <!-- 状态 -->
      <span slot="orderStatus" slot-scope="text, record">
        <span :style="{color:getColor(record)}">{{ getType(record) }}</span>
      </span>

      
    </s-table>
    <orderDetail ref="orderDetail" @ok="handleOk" /> 
  </a-card>
</template>
 
 <script>
import { STable } from '@/components'
import moment from 'moment'
import { orderList, queryHospitalList, getOrderStatusGroupByData ,getCommodityClassify} from '@/api/modular/system/posManage'
import { formatDate, getDateNow, getCurrentMonthLast } from '@/utils/util'
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
      treeData: [],
      gropListData: [],
      packgeList:[],
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

      queryParamGrop: {
        combinedCondition: '',
        commodityName: '',
        doctorName: '',
        hospitalCode:undefined,
        orderEndTime: getCurrentMonthLast(),
        orderStartTime:  getDateNow(),
        classifyId: undefined,
      },
      queryParams: {
        combinedCondition: undefined,
        commodityName: '',
        doctorName: '',
        hospitalCode: undefined,
        orderEndTime: getCurrentMonthLast(),
        orderStartTime:  getDateNow(),
        classifyId: undefined,
        orderStatus: '',
      },
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
          title: '套餐名称',
          dataIndex: 'commodityName',
          ellipsis: true,
        },
        {
          title: '医院名称',
          dataIndex: 'hospitalName',
        },
        {
          title: '医生',
          dataIndex: 'doctorName',
        },
        {
          title: '应付',
          dataIndex: 'saleAmount',
        },
        {
          title: '实付',
          dataIndex: 'payTotal',
        },
        {
          title: '服务时间',
          dataIndex: 'serveTime',
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
          with: 130,
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
                this.$set(item, 'serveTime', item.startTime)
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
      // this.$refs.orderDetail.orderDetail(record)
      this.$router.push({
        path: '/order/orderDetail',
        query: {
          orderId:record.orderId,
          // orderId:1623236088379908098,
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
      } else if (record.orderStatus == 9) {
        return '使用中'
      } else if (record.orderStatus == 102) {
        return '退款中'
      }
    },

    getColor(record){
      if (record.orderStatus == 1) {
        return '#0E9B0B'
      } else if (record.orderStatus == 2) {
        return '#4D4D4D'
      } else if (record.orderStatus == 3) {
        return '#4D4D4D'
      } else if (record.orderStatus == 4) {
        return '#409EFF'
      } else if (record.orderStatus == 5) {
        return '#4D4D4D'
      } else if (record.orderStatus == 6) {
        return '#4D4D4D'
      } else if (record.orderStatus == 7) {
        return '#4D4D4D'
      } else if (record.orderStatus == 8) {
        return '#409EFF'
      } else if (record.orderStatus == 9) {
        return '#409EFF'
      } else if (record.orderStatus == 102) {
        return '#F40E0E'
      }


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

    reset() {
      this.queryParams.combinedCondition = ''
      this.queryParams.commodityName = ''
      this.queryParams.doctorName = ''
      this.queryParams.hospitalCode = undefined
      this.queryParams.orderEndTime = ''
      this.queryParams.orderStartTime = ''
      this.queryParams.classifyId = ''
      this.getOrderStatusGroupByDataOut()
      this.handleOk()
    },

    //订单分组
    getOrderStatusGroupByDataOut() {
      getOrderStatusGroupByData(this.queryParamGrop)
        .then((res) => {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              if (res.data[index].code == 1) {    //待付款
                this.numberData.daifukuan  = res.data[index].co
              }else if(res.data[index].code == 8){ //待发货
                this.numberData.daifahuo  = res.data[index].co
              }else if(res.data[index].code == 4){ //待收货
                this.numberData.daishouhuo  = res.data[index].co
              }else if(res.data[index].code == 9){ //使用中
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
      this.queryParams.orderStatus = type
      // if(type==-1){
        // this.queryParams.orderStatus = ''
      // }
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
      this.createValue = momentArr
      this.queryParams.orderStartTime = dateArr[0]
      this.queryParams.orderEndTime = dateArr[1]
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