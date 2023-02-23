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
        <span class="name">下单时间:</span>
        <a-range-picker style="width: 185px" :value="orderTimeValue" @change="onChangeOrder" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button type="primary" ghost icon="export" style="margin-left: 8px; margin-right: 0" @click="leadingOut()">导出</a-button>
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'qb' }" @click="onRadioClick('qb')">
        <span style="margin-left: 3px">全部({{ numberData.quanbu }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'yy' }" @click="onRadioClick('yy')">
        <span style="margin-left: 3px">运营商收款({{ numberData.yy }}) </span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'cw' }" @click="onRadioClick('cw')">
        <span style="margin-left: 3px">医院收款({{ numberData.cw }})</span>
      </div>

      <!-- <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.tabCode == 'wc' }" @click="onRadioClick('wc')">
          <span style="margin-left: 3px">已完成({{ numberData.wc }})</span>
        </div> -->
    </div>


   <div class="tab-all-content">
    

    <!-- 订单总额 -->
    <div class="tab-total">
      <div class="content-dis">
          <a-icon style="width: 14px; height: 16px;margin-top: 7px;" type="container" />
          <span style="font-size:12px;margin-left:10px;margin-top:3px">订单总额</span>
          <div style="float:right">

              <img style="padding-left:110px;margin-top: -10px;" src="@/assets/icons/tc.png" >
          </div>
      </div>

      <div class="content-dis">
        <span style="font-size:24px;margin-top:-14px">250000.04</span>
        <span style="font-size:12px;margin-top:-5px;margin-left: 10px;">(差异：200)</span>
      </div>
     <div class="line"></div>
     <div class="content-dis">
        <span style="font-size:12px;">总笔数：{{zbs}}</span>
        <span style="font-size:12px;margin-left: 5px;">(差异：200)</span>
      </div>
    </div>



     <!-- 微信支付 -->
     <div class="tab-wx">
      <div class="content-dis">
          <a-icon style="width: 14px; height: 16px;margin-top: 7px;" type="wechat" />
          <span style="font-size:12px;margin-left:10px;margin-top:3px">微信支付订单额</span>
          <div style="float:right">

              <img style="padding-left:74px;margin-top: -8px;" src="@/assets/icons/tc.png" >
          </div>
      </div>

      <div class="content-dis">
        <span style="font-size:24px;margin-top:-14px">250000.04</span>
        <span style="font-size:12px;margin-top:-5px;margin-left: 10px;">(差异：200)</span>
      </div>
     <div class="line"></div>
     <div class="content-dis">
        <span style="font-size:12px;">总笔数：{{zbs}}</span>
        <span style="font-size:12px;margin-left: 5px;">(差异：200)</span>
      </div>
    </div>



    <!-- 支付宝支付 -->
    <div class="tab-alipay">
      <div class="content-dis">
          <a-icon style="width: 14px; height: 16px;margin-top: 7px;" type="alipay" />
          <span style="font-size:12px;margin-left:10px;margin-top:3px">支付宝支付订单额</span>
          <div style="float:right">

              <img style="padding-left:61px;margin-top: -9px;" src="@/assets/icons/tc.png" >
          </div>
      </div>

      <div class="content-dis">
        <span style="font-size:24px;margin-top:-14px">250000.04</span>
        <span style="font-size:12px;margin-top:-5px;margin-left: 10px;">(差异：200)</span>
      </div>
     <div class="line"></div>
     <div class="content-dis">
        <span style="font-size:12px;">总笔数：{{zbs}}</span>
        <span style="font-size:12px;margin-left: 5px;">(差异：200)</span>
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

      <span slot="status" slot-scope="text, record" :class="getColor(record.status.value)">
        {{ record.status.description }}
      </span>
    </s-table>
    <orderDetail ref="orderDetail" @ok="handleOk" />
  </a-card>
</template>
     
     <script>
import { STable } from '@/components'
import moment from 'moment'
import {  queryHospitalList, getCommodityClassify, getTab, getPage } from '@/api/modular/system/posManage'
import {  getDateNow, getCurrentMonthLast } from '@/utils/util'
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
      zbs:102,
      queryParams: {
        classifyId: undefined,
        combinedCondition: undefined,
        hospitalCode: undefined,
        refundEndTime: getCurrentMonthLast(),
        refundStartTime: getDateNow(),
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
          title: '创建时间',
          dataIndex: 'createTime',
          //   width: 160,
        },

        {
          title: '更新时间',
          dataIndex: 'updateTime',
          ellipsis: true,
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
    this.leadingOut()
    this.queryParams.tabCode = this.currentTab
    this.queryParamsTemp.tabCode = this.currentTab
  },

  created() {
    this.queryHospitalListOut()

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

    //导出
    leadingOut(){

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

    //下单时间
    onChangeOrder(momentArr, dateArr) {
      this.orderTimeValue = momentArr
      this.queryParams.refundStartTime = dateArr[0]
      this.queryParams.refundEndTime = dateArr[1]
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


.tab-all-content{
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
  background: #8FCB4A;

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
  background: #5794E9;
  box-shadow: 0px 2px 4px 0px rgba(87,148,233,0.35);
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