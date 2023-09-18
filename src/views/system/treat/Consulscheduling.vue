<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">科室:</span>
        <a-select
          class="sitemore"
          style="min-width: 180px; height: 28px"
          :collapse-tags="true"
          show-search
          v-model="selectDepartmentId"
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
        <span class="name">医护人员:</span>
        <a-input
          v-model="queryParams.userName"
          allow-clear
          placeholder="输入用户名/医生"
          style="width: 140px; height: 28px"
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
      :bordered="true"
      :rowKey="(record) => record.code"
    >
      <!-- 复诊续方 -->
      <!-- :title="record.status.value === 1 ? '确认停用？' : '确认启用？'" -->
      <span slot="fzxfaction" slot-scope="text, record">
        <a-popconfirm placement="topRight" @confirm="EnableFz(record)">
          <a-switch size="small" :checked="false" />

          <a-divider type="vertical" />
        </a-popconfirm>

        <a-icon type="setting" />
        <a style="margin-left: 5px" @click="$refs.fzmzConfig.editmodal(1)">配置</a>
      </span>

      <!-- 图文咨询 -->
      <span slot="twzxaction" slot-scope="text, record">
        <a-popconfirm placement="topRight" @confirm="EnableTw(record)">
          <a-switch size="small" :checked="false" />

          <a-divider type="vertical" />
        </a-popconfirm>

        <a-icon type="setting" />
        <a style="margin-left: 5px" @click="$refs.tuWenConfig.editmodal()">配置</a>
      </span>

      <!-- 电话咨询 -->
      <span slot="dhzxaction" slot-scope="text, record">
        <a-popconfirm placement="topRight" @confirm="EnableDh(record)">
          <a-switch size="small" :checked="false" />

          <a-divider type="vertical" />
        </a-popconfirm>

        <a-icon type="setting" />
        <a style="margin-left: 5px"  @click="$refs.phoneConfig.editmodal(1)">配置</a>
      </span>

      <!-- 视频咨询 -->
      <span slot="spzxaction" slot-scope="text, record">
        <a-popconfirm placement="topRight" @confirm="EnableSp(record)">
          <a-switch size="small" :checked="false" />

          <a-divider type="vertical" />
        </a-popconfirm>

        <a-icon type="setting" />
        <a style="margin-left: 5px"  @click="$refs.phoneConfig.editmodal(2)">配置</a>
      </span>

      <!-- 门诊随诊 -->
      <span slot="mzszaction" slot-scope="text, record">
        <a-popconfirm placement="topRight" @confirm="EnableMz(record)">
          <a-switch size="small" :checked="false" />

          <a-divider type="vertical" />
        </a-popconfirm>

        <a-icon type="setting" />
        <a style="margin-left: 5px" @click="$refs.fzmzConfig.editmodal(2)">配置</a>
      </span>
    </s-table>

    <fzmz-Config ref="fzmzConfig" @ok="handleOk" />
    <tuWen-Config ref="tuWenConfig" @ok="handleOk" />
    <phone-Config ref="phoneConfig" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'

import {
  queryHospitalList,
  getDeptsPersonal,
  getDepts,
  searchDoctorUser,
  getCommodityClassify,
  getDepartmentListForSelect,
  getUserInfoHvyogoPageList,
  accessHospitals,
} from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import fzmzConfig from './fzmzConfig.vue'
import tuWenConfig from './tuWenConfig.vue'
import phoneConfig from './phoneConfig.vue'
export default {
  components: {
    STable,
    fzmzConfig,
    tuWenConfig,
    phoneConfig,
  },
  data() {
    return {
      user: {},
      originData: [],
      treeData: [],
      fetching: false,
      selectDepartmentId: undefined,
      queryParams: {
        hospitalCode: undefined, //所属机构代码
        userName: '',
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '医生姓名',
          dataIndex: 'user_name',
          scopedSlots: { customRender: 'userNameaction' },
        },

        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
        },
        {
          title: '所属机构',
          dataIndex: 'hvyogo_id',
        },

        {
          title: '复诊续方',
          dataIndex: 'fzxfaction',
          scopedSlots: { customRender: 'fzxfaction' },
          align: 'center',
        },

        {
          title: '图文咨询',
          dataIndex: 'twzxaction',
          scopedSlots: { customRender: 'twzxaction' },
          align: 'center',
        },

        {
          title: '电话咨询',
          dataIndex: 'dhzxaction',
          scopedSlots: { customRender: 'dhzxaction' },
          align: 'center',
        },

        {
          title: '视频咨询',
          dataIndex: 'spzxaction',
          scopedSlots: { customRender: 'spzxaction' },
          align: 'center',
        },

        {
          title: '门诊随诊',
          dataIndex: 'mzszaction',
          scopedSlots: { customRender: 'mzszaction' },
          align: 'center',
        },

        // {
        //   title: '操作',
        //   fixed: 'right',
        //   width: 150,
        //   dataIndex: 'action',
        //   scopedSlots: { customRender: 'action' },
        // },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getUserInfoHvyogoPageList(Object.assign(parameter, this.queryParams)).then((res) => {
          let data = {}
          if (res.code == 0 && res.data.records) {
            data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            data.rows.forEach((item, index) => {
              this.$set(item, 'userId', item.user_id)
            })
          }
          return data
        })
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log(this.user)
    this.getDepartmentSelectList(undefined) //所属科室
    this.queryHospitalListOut() //所属机构
  },
  methods: {
    // 复诊续方 开关
    EnableFz() {
      console.log('1111111')
    },
    // 图文咨询 开关
    EnableTw() {
      console.log('2222222')
    },
    // 电话咨询 开关
    EnableDh() {
      console.log('3333333')
    },
    // 视频咨询 开关
    EnableSp() {
      console.log('4444444')
    },
    // 门诊随诊 开关
    EnableMz() {
      console.log('5555555')
    },

    refresh() {
      this.$refs.table.refresh(true)
    },
    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      accessHospitals(queryData)
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

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.originData = res.data.records
          this.$refs.tableStat.refresh()
          // if (this.originData.length == 1) {
          //   this.queryParamsStatisit.executeDepartmentIds.push(this.originData[0].department_id)
          // }
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      console.log('1111:', value)
      this.originData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value == undefined) {
        this.selectDepartmentId = ''
        this.queryParamsStatisit.executeDepartmentIds = []
        return
      }
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      this.$refs.tableStat.refresh()
    },
    /**
     * 重置
     */
    reset() {
      this.selectDepartmentId = undefined
      this.queryParams.hospitalCode = undefined
      this.queryParams.userName = ''

      this.$refs.table.refresh(true)
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
  padding-bottom: 20px !important;
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
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
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
    
    
    