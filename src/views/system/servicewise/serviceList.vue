<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">方案名称:</span>
        <a-input
          v-model="queryParams.planName"
          allow-clear
          placeholder="可输入方案名称"
          style="width: 180px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">执行科室:</span>

        <a-select
          class="deptselect-single"
          show-search
          style="width: 180px"
          v-model="queryParams.executeDepartment"
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
        <span class="name">状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="addName()">新增</a-button>
    </div>

    <!-- :scroll="{ x: true }" -->
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
        <a @click="editPlan(record)"><a-icon type="edit"></a-icon>修改</a>
        <a-divider type="vertical" />
        <a @click="goDetail(record)"><a-icon type="container" style="margin-right: 2px;"></a-icon>执行详情</a>
      </span>
      <span slot="executeDept" slot-scope="text, record">
        <ellipsis :length="30" tooltip>{{ record.executeDepartmentName }}</ellipsis>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          :title="record.status.value === 1 ? '确认停用？' : '确认启用？'"
          @confirm="Enable(record)"
        >
          <a-switch size="small" :checked="record.status.value == 1" />
        </a-popconfirm>
      </span>
    </s-table>

    <!-- <add-Name ref="addName" @ok="handleOk" /> -->
    <plan-Execute ref="planExecute" @ok="handleOk" />
    <executeDetail ref="executeDetail" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable, Ellipsis } from '@/components'

import {
  getDepartmentListForSelect,
  getDeptsPersonal,
  getDepts,
  qryFollowPlan,
  updateFollowPlanStatus,
} from '@/api/modular/system/posManage'
import planExecute from './planExecute'
import executeDetail from './executeDetail'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    planExecute,
    Ellipsis,
    executeDetail,
  },
  data() {
    return {
      fetching: false,
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        departmentName: undefined,
        planName: '',
        executeDepartment: undefined,

        status: '',
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
          title: '方案名称',

          dataIndex: 'planName',
        },
        {
          title: '制定时间',

          dataIndex: 'formulateTime',
        },
        {
          title: '制定人员',

          dataIndex: 'formulateUserName',
        },
        {
          title: '执行科室',

          // dataIndex: 'executeDept',
          scopedSlots: { customRender: 'executeDept' },
        },
        {
          title: '随访名单',

          dataIndex: 'metaConfigureName',
        },
        {
          title: '随访类型',

          dataIndex: 'followType',
        },
        // {
        //   title: '方案执行',

        //   dataIndex: 'planUserInfo',
        //   align: 'center',
        //   scopedSlots: { customRender: 'execute' },
        // },

        {
          title: '状态',

          fixed: 'right',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: '160px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryFollowPlan(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0) {
            res.data.rows.forEach((element) => {
              element.statusText = element.status.description
              element.followType = element.followType.description
            })
          }
          return res.data
        })
      },

      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '启用',
        },
        {
          id: 2,
          name: '停用',
        },
      ],
    }
  },

  mounted() {
    //用局部引用的时候 this.$bus改成Bus，跟上面引用的名字一样
    this.$bus.$on('proEvent', (data) => {
      console.log('proEvent Refres', data)
      // this.objct = data;
      this.refresh()
    })
  },

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

    goDetail(record){
      console.log("111111111111111111")
      this.$refs.executeDetail.detail1(record)
    },





    goExecute(record) {
      this.$refs.planExecute.execute(record)
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, undefined).then((res) => {
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
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      this.$refs.table.refresh(true)
    },

    // onSwitchChange(value) {
    //   console.log(value)
    //   this.queryParams.status = value ? 1 : 2

    //   this.$refs.table.refresh(true)
    // },
    onDepartmentChange(index) {
      console.log('index=' + index)
      if (index == undefined) {
        this.queryParams.executeDepartment = undefined
        this.queryParams.departmentName = undefined
      } else {
        console.log(this.originData[index])
        this.queryParams.executeDepartment = this.originData[index].departmentId
        this.queryParams.departmentName = this.originData[index].departmentName
      }
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams.status = 1
      this.queryParams.planName = ''
      this.queryParams.executeDepartment = undefined
      this.queryParams.departmentName = undefined
      this.queryParams.pageNo = 1

      this.$refs.table.refresh(true)
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      this.confirmLoading = true
      var _status = record.status.value == 1 ? 2 : 1
      //更新接口调用
      updateFollowPlanStatus({
        id: record.id,
        status: _status,
      }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          record.status.value = _status

          setTimeout(() => {
            this.handleOk()
          }, 1000)
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },
    upDateStatesText(_status) {
      return _status == 1 ? '确定停用此方案吗？' : '确定启用用此方案吗？'
    },
    /**
     * 新增
     */
    addName() {
      // this.$refs.addName.add()
      // this.$router.push({ name: 'project_add' })
      this.$router.push({ path: '/servicewise/projectAdd' })
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    // addPlan() {
    //   this.$message.info('clicked')
    // },

    // handleSubmit() {
    //   const {
    //     form: { validateFields },
    //   } = this
    //   this.confirmLoading = true
    //   validateFields((errors, values) => {
    //     if (!errors) {
    //       sysPosAdd(values)
    //         .then((res) => {
    //           if (res.success) {
    //             this.$message.success('新增成功')
    //             this.visible = false
    //             this.confirmLoading = false
    //             this.$emit('ok', values)
    //             this.form.resetFields()
    //           } else {
    //             this.$message.error('新增失败：' + res.message)
    //           }
    //         })
    //         .finally((res) => {
    //           this.confirmLoading = false
    //         })
    //     } else {
    //       this.confirmLoading = false
    //     }
    //   })
    // },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
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


