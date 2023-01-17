<template>
  <a-card :bordered="false" class="sys-card" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">统计方式:</span>
        <a-select
          class="sitemore"
          @select="onSelected"
          allow-clear
          v-model="queryParamsStatisit.statType"
          style="width: 120px; height: 28px"
          placeholder="请选择统计方式"
        >
          <a-select-option
            style="height: 28px !important"
            v-for="(item, index) in StatisticsMode"
            :value="item.code"
            :key="index"
            >{{ item.value }}</a-select-option
          >
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">执行科室:</span>
        <!-- <a-select
          class="sitemore"
          :maxTagCount="1"
          :collapse-tags="true"
          allow-clear
          v-model="queryParamsStatisit.execDept"
          mode="multiple"
          style="min-width: 120px; height: 28px"
          placeholder="请选择科室"
        >
          <a-select-option
            style="max-height: 28px;padding-bottom: 0px;align-items: center"
            v-for="(item, index) in originData"
            :value="item.departmentId"
            :key="index"
            >{{ item.departmentName }}</a-select-option
          >
        </a-select> -->
        <a-select
          class="sitemore"
          style="min-width: 150px; height: 28px"
          :maxTagCount="1"
          :collapse-tags="true"
          show-search
          v-model="queryParamsStatisit.execDept"
          mode="multiple"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择科室"
          @change="onDepartmentSelectChange"
          @search="onDepartmentSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in originData" :key="index" :value="item.department_id">{{
            item.department_name
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row" style="margin-left: 15px; padding-bottom: 0%">
        <span class="name">时间:</span>
        <a-range-picker   :value="createValue" @change="onChange" style="height: 28px !important;width: 185px" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.tableStat.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <!-- :scroll="{ y: 700, x: 0 }"  -->
    <!--  style="overflow-y: auto" -->
    <s-table
      class="table-hover-hidden"
      :showPagination="false"
      style="overflow-y: auto; width: 101%"
      :scroll="{ y: 700, x: 0 }"
      bordered
      ref="tableStat"
      size="default"
      :columns="columnsStat"
      :data="loadDataStat"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action_total" slot-scope="text, record">
        <a @click="$refs.statisitDetail.checkDetail(record, 1)">{{ record.total }}</a>
      </span>
      <span slot="action_success" slot-scope="text, record">
        <a @click="$refs.statisitDetail.checkDetail(record, 2)">{{ record.success }}</a>
      </span>

      <span slot="action_fail" slot-scope="text, record">
        <a @click="$refs.statisitDetail.checkDetail(record, 3)"> {{ record.fail }}</a>
      </span>

      <span slot="action_overdue" slot-scope="text, record">
        <a @click="$refs.statisitDetail.checkDetail(record, 4)">{{ record.overdue }}</a>
      </span>

      <span slot="action_number" slot-scope="text, record">
        <a @click="$refs.statisitDetail.checkDetail(record, 5)">{{ record.undoTask }}</a>
      </span>

      <template v-if="queryParamsStatisit.statType == 1" slot="titleNNN">按随访方案</template>
      <template v-if="queryParamsStatisit.statType == 2" slot="titleNNN">按执行科室</template>
      <template v-if="queryParamsStatisit.statType == 3" slot="titleNNN">按问卷</template>
    </s-table>

    <statisit-Detail ref="statisitDetail" @ok="handleOk" />
  </a-card>
</template>
  
  <script>
import moment from 'moment'
import { STable } from '@/components'
import {
  getDepartmentListForSelect,
  getDepts,
  getDeptsPersonal,
  statExecuteRecord,
} from '@/api/modular/system/posManage'
import statisitDetail from './statisitDetail'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'

import { formatDate, getDateNow, getlastMonthToday } from '@/utils/util'

export default {
  components: {
    STable,
    statisitDetail,
  },

  data() {
    var spanArr = []
    var position = 0
    //列合并
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        attrs: {},
      }
      const _row = spanArr[index]
      const _col = _row > 0 ? 1 : 0
      obj.attrs = {
        rowSpan: _row,
        colSpan: _col,
      }

      return obj
    }

    //计算合并
    const rowspan = (userData) => {
      spanArr = []
      position = 0
      userData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          position = 0
        } else {
          //需要合并的地方判断
          if (userData[index].planName === userData[index - 1].planName) {
            spanArr[position] += 1
            spanArr.push(0)
          } else {
            spanArr.push(1)
            position = index
          }
        }
      })
    }

    return {
      //此属性用来做重置功能的
      confirmLoading: false,
      originData: [],
      createValue: [],
      createValueBor: [],
      titleName: '按问卷',
      /** 统计类别数据*/
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      form: this.$form.createForm(this),
      queryParamsStatisit: {
        beginDate: getlastMonthToday(),
        endDate: formatDate(new Date().getTime()),
        execDept: [],
        hospitalCode: '',
        statType: 3,
        tenantId: '',
      },

      // 表头
      columnsStat: [
        {
          dataIndex: 'planName',
          scopedSlots: { customRender: 'action', title: 'titleNNN' },
          customRender: renderContent,
        },
        {
          title: '随访方式',
          dataIndex: 'messageName',
        },
        {
          title: '任务数',
          dataIndex: 'total',
          scopedSlots: { customRender: 'action_total' },
        },

        {
          title: '成功数',
          dataIndex: 'success',
          scopedSlots: { customRender: 'action_success' },
        },
        {
          title: '成功率',
          dataIndex: 'successRate',
        },
        {
          title: '失败数',
          dataIndex: 'fail',
          scopedSlots: { customRender: 'action_fail' },
        },
        {
          title: '失败率',
          dataIndex: 'failRate',
        },

        {
          title: '待执行',
          dataIndex: 'undoTask',
          scopedSlots: { customRender: 'action_number' },
        },
        {
          title: '待执行率',
          dataIndex: 'undoTaskRate',
        },

        {
          title: '逾期数',
          dataIndex: 'overdue',
          scopedSlots: { customRender: 'action_overdue' },
        },
        {
          title: '逾期率',
          dataIndex: 'overdueRate',
        },
      ],

      user: {},
      fetching: false,
      StatisticsMode: [
        { code: 3, value: '按问卷' },
        { code: 1, value: '按随访方案' },
        { code: 2, value: '按执行科室' },
      ],

      dateFormat: 'YYYY-MM-DD',

      // 加载数据方法 必须为 Promise 对象
      loadDataStat: (parameter) => {
        this.user = Vue.ls.get(TRUE_USER)
        let param = JSON.parse(JSON.stringify(this.queryParamsStatisit))
        // if (this.user.roleId == 7 || this.user.roleName == 'admin') {
        //   param.execDept = []
        // }else{
        //   if(this.originData.length==0){
        //   param.execDept = "-1"
        // }
        // }

        if (this.originData.length == 0 && this.user.roleName != 'admin') {
          param.execDept = '-1'
        }

        return statExecuteRecord(Object.assign(parameter, param)).then((res) => {
          if (res.code == 0) {
            var data = {
              pageNo: 1,
              pageSize: res.data.length,
              totalRows: res.data.length,
              totalPage: 1,
              rows: res.data,
            }
            data.rows.forEach((item, index) => {
              this.$set(item, 'successRate', Math.round(item.successRate * 100) + '%')
              this.$set(item, 'failRate', Math.round(item.failRate * 100) + '%')
              this.$set(item, 'overdueRate', Math.round(item.overdueRate * 100) + '%')
              this.$set(item, 'undoTaskRate', Math.round(item.undoTaskRate * 100) + '%')
              this.$set(item, 'statType', this.queryParamsStatisit.statType)
              this.$set(item, 'beginDate', this.queryParamsStatisit.beginDate)
              this.$set(item, 'endDate', this.queryParamsStatisit.endDate)
              this.$set(item, 'execDept', this.queryParamsStatisit.execDept)
            })
            rowspan(data.rows)
            return data
          }
        })
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log('csscsc:', this.user)
    this.confirmLoading = true
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    // if (this.user.roleId == 7 || this.user.roleName == 'admin') {
    //   getDepts()
    //     .then((res) => {
    //       if (res.code == 0) {
    //         this.originData = res.data
    //       }
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // } else {
    //   getDeptsPersonal()
    //     .then((res) => {
    //       if (res.code == 0) {
    //         this.originData = res.data
    //         if (res.data.length == 0) {
    //           this.queryParamsStatisit.execDept = ['暂无科室']
    //         } else {
    //           var departmentIds = []
    //           res.data.forEach((item, index) => {
    //             departmentIds.push(item.departmentId)
    //           })
    //           this.queryParamsStatisit.execDept = departmentIds
    //         }
    //         this.$refs.tableStat.refresh(true)
    //         // var departmentIds = []
    //         // res.data.forEach((item, index) => {
    //         //   departmentIds = departmentIds + item.departmentId
    //         //   if (index < res.data.length - 1) {
    //         //     departmentIds.push(item.departmentId)
    //         //   }
    //         // })
    //         // console.log(departmentIds)
    //         // this.queryParams.depts= departmentIds
    //         // this.$refs.table.refresh(true)
    //       }
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // }

    this.getDepartmentSelectList(undefined)

    this.createValue = [
      moment(getlastMonthToday(), this.dateFormat),
      moment(formatDate(new Date().getTime()), this.dateFormat),
    ]
    this.createValueBor = [moment(getDateNow(), this.dateFormat), moment(getDateNow(), this.dateFormat)]
  },

  methods: {
    /** 统计列表方法*/
    onChange(momentArr, dateArr) {
      console.log('MMMMM:', dateArr)
      this.createValue = momentArr
      this.queryParamsStatisit.beginDate = dateArr[0]
      this.queryParamsStatisit.endDate = dateArr[1]
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'  
      getDepartmentListForSelect(departmentName,'managerDept').then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.originData = res.data.records
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
    },
    onSelected(ssks) {
      console.log('---------:', ssks)
      if (ssks == 1) {
        this.titleName = '按随访方案'
      } else if (ssks == 2) {
        this.titleName = '按执行科室'
      } else if (ssks == 3) {
        this.titleName = '按问卷'
      }
      this.$refs.tableStat.refresh(true)
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    /**
     * 重置
     */
    reset() {
      // this.createValue = []
      this.queryParamsStatisit.statType = ''
      this.queryParamsStatisit.execDept = []
      this.$refs.tableStat.refresh(true)
    },
  },
}
</script>


  <style lang="less" >

.ant-select-selection--multiple {
  min-height: 28px;
  cursor: text;
  zoom: 1;
}
.sitemore {
  align-items: center;
  .ant-select-selection.ant-select-selection--single {
    height: 28px !important;
    align-items: center;
  }

  li {
    height: 24px;
    margin-top: 1px !important;
    line-height: 22px;
  }

  margin-left: 5px;
  align-items: center;
  .ant-select-selection--multiple {
    width: 100%;
    height: 28px;
    margin-top: 1px !important;
    padding-bottom: 0px !important;
    /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }
    /deep/.ant-select-selection__placeholder{
      margin-top: -8px !important;
    }

  }
}

.table-hover-hidden {
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: none !important;
  }
  width: 100% !important;
  .table-hover-hidden .ant-table-body {
    //  overflow: auto ;
  }
  /deep/table tbody tr:hover > td {
    background: #e7f1ff !important;
  }
  .ant-table-body .ant-table-row-hover {
    background: #e7f1ff;
  }
  .ant-table-body .ant-table-row-hover > td {
    background: #e7f1ff;
  }
}

.table-page-search-wrapper {
  padding-bottom: 10px;
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

    .ant-input {
      width: 100%;
      height: 28px !important;
      padding: 4px 11px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 12px !important;
      line-height: 1.5;
    }
  }
}
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right {
    overflow: hidden;
    width: 100% !important;

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
}

.div-service-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-service-left-service {
    background-color: white;
    padding: 2% 2%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 18%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .p-part-title {
      height: 18px;
      font-size: 18px;
      text-align: left;
      color: #000;
      font-weight: bold;
    }

    .div-wrap-service {
      max-height: 662px;
      overflow-y: auto !important;

      .div-part {
        overflow: hidden;
        width: 100%;
        padding-left: 5%;
        height: 10%;

        .checked {
          color: #1890ff !important;
        }

        .p-name {
          margin-top: 3.5%;
          display: block;
          height: 100%;
          padding-left: 1%;
          color: #000;
          font-size: 14px;
          text-align: left;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}

.card-right-service {
  overflow: hidden;
  width: 82%;

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

.div-text-auto {
  width: 100%;
  display: inline-block;
  margin-top: -1.5%;
  .ant-input {
    height: 28px;
  }
}

.row-stat {
  display: flex;
  flex-direction: row;

  align-items: center;
  width: 100%;

  .row-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 50px 50px;
    justify-content: center;
    border: 1px #ddd solid;
    border-radius: 10px;
    background-color: white;
    height: 260px;
    width: 30%;

    .item-inside {
      display: flex;
      flex-direction: row;
      align-items: center;

      .item-image {
        width: 50px;
        margin-top: 15px;
        height: 50px;
      }

      .item-right {
        display: flex;
        margin-left: 20px;
        flex-direction: column;

        .item-right-top {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          .item-stat-num {
            font-size: 46px;
          }
          .item-stat-unit {
            font-size: 20px;
          }
        }

        .item-stat-name {
          font-size: 20px;
        }
      }
    }
  }
}
</style>