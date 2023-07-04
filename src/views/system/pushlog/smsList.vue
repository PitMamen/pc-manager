<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">患者信息:</span>
        <a-input
          v-model="queryParams.userNameOrTel"
          allow-clear
          placeholder="姓名或手机号"
          style="width: 125px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">执行科室:</span>
        <!-- <a-select v-model="queryParams.executeDepartmentId" placeholder="请选择科室" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select> -->
        <a-select
          class="deptselect-single"
          show-search
          style="width: 180px"
          v-model="queryParams.executeDepartmentId"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择科室"
          @change="onDepartmentSelectChange"
          @search="onDepartmentSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, index) in originData"
            :title="item.department_name"
            :key="index"
            :value="item.department_id"
            >{{ item.department_name }}</a-select-option
          >
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">发送状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in statusData" :value="item.code" :key="index">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">发送时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="search-row">
        <span class="name">随访方案:</span>
        <a-input
          v-model="queryParams.planName"
          allow-clear
          placeholder="输入方案名称"
          style="width: 125px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
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
        <a @click="goCheck(record)"><a-icon style="margin-right: 5px" type="eye"></a-icon>查看</a>
      </span>
      <span slot="status" slot-scope="text, record">
        <span v-if="record.status == '发送成功'" style="color: green">{{ record.status }}</span>
        <span v-if="record.status == '发送失败'" style="color: red">{{ record.status }}</span>
      </span>
    </s-table>
    <log-detail ref="logDetail" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'
import logDetail from './logDetail'
import {
  getDepartmentListForSelect,
  getSmsPushRecordHistory,
  getDeptsPersonal,
  getDepts,
} from '@/api/modular/system/posManage'

import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    logDetail,
  },
  data() {
    return {
      fetching: false,
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        executeDepartmentId: -1, //科室id
        executeEndTime: '',
        executeStartTime: '',
        planName: '',
        status: -1,
        userNameOrTel: undefined,
      },
      queryParamsOrigin: {
        executeDepartmentId: -1, //科室id
        executeEndTime: '',
        executeStartTime: '',
        planName: '',
        status: -1,
        userNameOrTel: undefined,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },

      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '发送成功' },
        { code: 2, value: '发送失败' },
      ],
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
      createValue: [],
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '接收号码',
          dataIndex: 'tel',
        },
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
        },
        {
          title: '随访方案',
          dataIndex: 'planName',
        },
        {
          title: '消息模版',
          dataIndex: 'templateTitle',
        },
        {
          title: '发送时间',
          dataIndex: 'executeTime',
        },
        {
          title: '状态',
          // dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '原因',
          dataIndex: 'errorDesc',
        },
        {
          title: '操作',
          fixed: 'right',
          width: '100px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(this.queryParams))
        // param.messageType = parseInt(param.messageType)
        if (param.status == -1) {
          delete param.status
        }
        if (param.executeDepartmentId == -1) {
          delete param.executeDepartmentId
        }
        console.log('fff', Object.assign(parameter, param))
        return getSmsPushRecordHistory(Object.assign(parameter, param)).then((res) => {
          if (res.code == 0) {
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            // //设置序号
            // data.rows.forEach((item, index) => {
            //   item.executeTime = item.executeTime.substring(0, 11)
            // })
          }
          return data
        })
      },
    }
  },

  // watch: {
  //   $route(to, from) {
  //     console.log('watch----smsList out', to, from)
  //     if (to.path.indexOf('smsList') > -1) {
  //       console.log('watch----smsList', to, from)
  //       this.refresh()
  //     }
  //   },
  // },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log(this.user)

    this.getDepartmentSelectList(undefined)
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },
    // this.$router.push({ path: '/servicewise/projectAdd' })
    editPlan(record) {
      this.$router.push({
        name: 'project_edit',
        // path: '/servicewise/projectEdit',
        query: {
          planId: record.id,
        },
      })
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
        if (departmentName === undefined) {
          res.data.records.unshift({ department_name: '全部', department_id: -1 })
        }

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
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      this.$refs.table.refresh(true)
    },
    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.executeStartTime = dateArr[0]
      this.queryParams.executeEndTime = dateArr[1]
    },

    goCheck(record) {
      this.$refs.logDetail.add(record, '短信详情')
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))

      this.createValue = []
      this.$refs.table.refresh()
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>
<style lang="less" scoped>
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
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>


