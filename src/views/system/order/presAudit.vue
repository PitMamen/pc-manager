<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
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

      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="输入用户名/医生/处方号"
          style="width: 188px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <!-- <div class="search-row">
          <span class="name">套餐类型:</span>
          <a-select v-model="queryParams.classifyId" placeholder="请选择" allow-clear style="width: 120px">
            <a-select-option v-for="(item, index) in packgeList" :key="index" :value="item.id">{{
              item.classifyName
            }}</a-select-option>
          </a-select>
        </div> -->

      <!-- <div class="search-row">
          <span class="name">开具时间:</span>
          <a-range-picker style="width: 190px" :value="orderTimeValue" @change="onChange" />
        </div> -->

      <!-- <div class="search-row">
          <span class="name">订单分类:</span>
          <a-select v-model="queryParams.orderType" placeholder="请选择" allow-clear style="width: 120px">
            <a-select-option v-for="(item, index) in ordertypeList" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </div> -->

      <div class="search-row">
        <span class="name">开具时间:</span>
        <a-range-picker style="width: 190px" :value="createValue" @change="onChangeOrder" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset(true)">重置</a-button>
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.checkStatus == 0 }" @click="onRadioClick(0)">
        <img v-if="queryParamsTemp.checkStatus == 0" src="~@/assets/icons/qbcf_c.png" />
        <img v-else src="~@/assets/icons/qbcf_n.png" />
        <span style="margin-left: 3px">全部处方({{ numberData.quanbu }})</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.checkStatus == 1 }" @click="onRadioClick(1)">
        <img v-if="queryParamsTemp.checkStatus == 1" src="~@/assets/icons/dsh_c.png" />
        <img v-else src="~@/assets/icons/dsh_n.png" />
        <span style="margin-left: 3px">待审核({{ numberData.daishenhe }}) </span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.checkStatus == 2 }" @click="onRadioClick(2)">
         <img v-if="queryParamsTemp.checkStatus == 2" src="~@/assets/icons/shcg_c.png" />
        <img v-else src="~@/assets/icons/shcg_n.png" />
        <span style="margin-left: 3px">审核成功({{ numberData.success }})</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParamsTemp.checkStatus == 3 }" @click="onRadioClick(3)">
        <img v-if="queryParamsTemp.checkStatus == 3" src="~@/assets/icons/shsb_c.png" />
        <img v-else src="~@/assets/icons/shsb_n.png" />
        <span style="margin-left: 3px">审核失败({{ numberData.fail }})</span>
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
        <a @click="goExamine(record)"
          ><a-icon style="margin-right: 5px" :type="getIcon(record.checkStatus)"></a-icon
          >{{ showText(record.checkStatus) }}</a
        >
      </span>

      <span slot="status" slot-scope="text, record" :class="getColor(record.checkStatus)">
        {{ record.checkStatusDesc }}
      </span>

      <!-- <span slot="commodityName" slot-scope="text, record" class="multiLine">
        {{ record.commodityName }}
      </span> -->
    </s-table>
    <process-View ref="processView" @ok="handleOk" />
  </a-card>
</template>
     
     <script>
import { STable } from '@/components'
import moment from 'moment'
import { accessHospitals1, getCommodityClassify, checkPreTab, checkPrePage } from '@/api/modular/system/posManage'
import { getDateNow, getCurrentMonthLast } from '@/utils/util'
import addForm from './addForm'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import processView from './processView'

export default {
  components: {
    STable,
    addForm,
    processView,
    // editForm,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      orderTimeValue: [],
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      packgeList: [],
      confirmLoading: false,
      currentTab: 0,
      numberData: {
        quanbu: 0,
        daishenhe: 0,
        success: 0,
        fail: 0,
      },
      ordertypeList: [
        { code: 'consultOrder', value: '咨询订单' },
        { code: 'srvPackOrder', value: '专科服务' },
        { code: 'youzanOrder', value: '商城订单' },
      ],
      queryParams: {
        // classifyId: undefined,
        // combinedCondition: undefined,
        // hospitalCode: undefined,
        // createEndTime: getCurrentMonthLast(),
        // createStartTime: getDateNow(),
        // orderType: undefined,
        // tabCode: '',

        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
        checkStatus: 0,
        hospitalCode: undefined,
        queryText: '',
      },

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '处方号',
          dataIndex: 'preNo',
          ellipsis: true,
        },
        {
          title: '用户姓名',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'userSex',
          ellipsis: true,
        },
        {
          title: '年龄',
          dataIndex: 'userAge',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
        },
        {
          title: '开方医生',
          dataIndex: 'docName',
          align: 'right',
        },
        {
          title: '开方科室',
          dataIndex: 'deptName',
          align: 'right',
        },
        {
          title: '金额',
          dataIndex: 'payTotal',
          align: 'right',
        },
        {
          title: '类型',
          dataIndex: 'preClass',
          //   align: 'right',
        },
        {
          title: '开具时间',
          dataIndex: 'createTime',
          width: 180,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'checkStatusDesc',
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
        this.queryParamsTemp.checkStatus = this.currentTab
        return checkPrePage(Object.assign(parameter, this.queryParams))
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
                // this.$set(item, 'checkStatus', 1)
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
    this.queryParams.checkStatus = this.currentTab
    this.queryParamsTemp.checkStatus = this.currentTab
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

    //   this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

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
    //查看/ 审核
    goExamine(record) {
      console.log('ggg:', record.checkStatus)
      //查看
      if (record.checkStatus == 2 || record.checkStatus == 3) {
        this.$refs.processView.lookview(record)
      } else {
        //审核
        this.$refs.processView.process(record)
      }
    },

    showText(value) {
      //如果是是审核失败或者审核成功的 操作栏显示 查看   否则显示审核
      if (value == 2 || value == 3) {
        return '查看'
      } else {
        return '审核'
      }
    },

    getIcon(value) {
      if (value == 1) {
        return 'idcard'
      } else {
        return 'hdd'
      }
    },

    getType(record) {
      if (record.value == 1) {
        return '运营审核'
      } else if (record.value == 2) {
        return '财务退款'
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
      if (value == 2) {
        return 'span-green'
      } else if (value == 3) {
        return 'span-red'
      } else if (value == 1) {
        return 'span-blue'
      }
    },

    isLoading() {
      return this.confirmLoading
    },

    // queryHospitalListOut() {
    //   //   let queryData = {
    //   //     tenantId: '',
    //   //     status: 1,
    //   //     hospitalName: '',
    //   //   }
    //   this.confirmLoading = true
    //   accessHospitals()
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
        this.treeData = []
        this.localHospitalCode = undefined
        this.queryHospitalListOut(undefined)
      }
    },

    reset(clearTime) {
      this.queryParams.hospitalCode = undefined
      this.queryParams.checkStatus = 0
      this.queryParams.queryText = ''
      if (clearTime) {
        this.createValue = []
        // this.orderTimeValue = []
      } else {
        this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]

        // this.orderTimeValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
      }
      this.queryParams.beginDate = clearTime ? '' : getDateNow() + ' 00:00:00'
      this.queryParams.endDate = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'
      // this.queryParams.updateStartTime = clearTime ? '' : getDateNow() + ' 00:00:00'
      // this.queryParams.updateEndTime = clearTime ? '' : getCurrentMonthLast() + ' 23:59:59'

      this.handleOk()
    },

    //订单分组
    getTabOut() {
      checkPreTab(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              if (res.data[index].checkStatus == 0) {
                //全部
                this.numberData.quanbu = res.data[index].count
              } else if (res.data[index].checkStatus == 1) {
                //待审核
                this.numberData.daishenhe = res.data[index].count
              } else if (res.data[index].checkStatus == 2) {
                //审核成功
                this.numberData.success = res.data[index].count
              } else if (res.data[index].checkStatus == 3) {
                //审核失败
                this.numberData.fail = res.data[index].count
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
      this.queryParams.checkStatus = type
      this.queryParamsTemp.checkStatus = type
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

        // this.orderTimeValue = []
        //   this.queryParams.updateStartTime = ''
        //   this.queryParams.updateEndTime = ''
        return
      }
      if (dateArr) {
        if (dateArr[0] > dateArr[1]) {
          this.$message.error('开始时间不能大于结束时间')
          //   this.orderTimeValue = []
          // this.queryParams.updateStartTime = ''
          // this.queryParams.updateEndTime = ''
          return
        }
      }

      // if (dateArr[0] == '' && dateArr[1] == '') {
      //   this.queryParams.updateStartTime = ''
      //   this.queryParams.updateEndTime = ''
      //   return
      // }

      //   this.orderTimeValue = momentArr
      // this.queryParams.updateStartTime = dateArr[0] + ' 00:00:00'
      // this.queryParams.updateEndTime = dateArr[1] + ' 23:59:59'
    },

    //创建时间
    onChangeOrder(momentArr, dateArr2) {
      if (Math.abs(moment(dateArr2[1]).unix() - moment(dateArr2[0]).unix()) > 7776000) {
        this.$message.error('开始时间与结束时间跨度不能超过三个月!')
        this.createValue = []
        this.queryParams.beginDate = ''
        this.queryParams.endDate = ''
        return
      }
      if (dateArr2) {
        if (dateArr2[0] > dateArr2[1]) {
          this.$message.error('开始时间不能大于结束时间')
          this.createValue = []
          // this.queryParams.updateStartTime = ''
          // this.queryParams.updateEndTime = ''
          return
        }
      }

      if (dateArr2[0] == '' && dateArr2[1] == '') {
        this.queryParams.beginDate = ''
        this.queryParams.endDate = ''
        return
      }

      this.createValue = momentArr
      this.queryParams.beginDate = dateArr2[0] + ' 00:00:00'
      this.queryParams.endDate = dateArr2[1] + ' 23:59:59'
    },

    handleOk() {
      this.getTabOut()
      this.$refs.table.refresh()
    },
  },
}
</script>
  
  
  
  
     
     <style lang="less" scoped>
.multiLine {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  // -webkit-line-clamp: 2;
  line-clamp: 2 !important;
}

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
  padding: 2px 4px;
  font-size: 12px;
  color: #0e9b0b;
  border: #69c07d 1px solid;
}

.span-green-p {
  background-color: #edffed;
  padding: 2px 10px;
  font-size: 12px;
  color: #0e9b0b;
  border: #69c07d 1px solid;
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
  padding: 2px 10px;
  font-size: 12px;
  color: #4d4d4d;
  border: #4d4d4d 1px solid;
  // background-color: #85888e;
}

// .span-green {
//   padding: 2px 4px;
//   font-size: 12px;
//   color: #69c07d;
//   // background-color: #85888e;
// }

// .span-green-p {
//   background-color: #edffed;
//   padding: 2px 10px;
//   font-size: 12px;
//   color: #69c07d;
//   border: #0e9b0b 1px solid;
//   // border: #69c07d 1px solid;
// }

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
       
