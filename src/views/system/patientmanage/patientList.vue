<template>
  <a-card :bordered="false" class="card-right-pac" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">应用名称:</span>
        <a-input
          v-model="queryParams.name"
          allow-clear
          placeholder="人员姓名查询"
          style="width: 120px;"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">科室管理:</span>
        <a-select  class="sitemore" :title="queryParams.depts" :maxTagCount=1 allow-clear v-model="queryParams.depts" style="min-width: 120px;" mode="multiple"  placeholder="请选择科室">
          <a-select-option  v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row" style="margin-bottom:-2px">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px;margin-right: 0;" @click="reset()">重置</a-button>
        </span>
      </div>

      <!-- <div class="div-divider"></div> -->
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span style="inline-block" slot="acount" slot-scope="text, record">
        <img v-if="record.openidFlag == 1" style="width: 25px; height: 25px" src="~@/assets/icons/weixin.png" />
        <img v-if="record.openidFlag == 0" style="width: 25px; height: 25px" src="~@/assets/icons/weixin2.png" />
      </span>

      <span style="inline-block" slot="action" slot-scope="text, record">
        <a>健康档案</a>
        <a-divider type="vertical" />
        <a @click="$refs.visitManage.distribution(record)">随访管理</a>
      </span>
    </s-table>

    <visit-Manage ref="visitManage" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'

import { qryMetaDataByPage, getDeptsPersonal, getDepts } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import visitManage from './visitManage'
import Vue from 'vue'
export default {
  components: {
    STable,
    visitManage,
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        depts: [],
        name: '',
        tableName: '',
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
          title: '序号',
          dataIndex: 'xh',
          width: 60,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: 80,
          ellipsis:true,
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
          width: 140,
          ellipsis:true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: 60,
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: 60,
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          width: 120,
        },
        {
          title: '紧急联系人',
          dataIndex: 'urgentContacts',
          width: 120,
          ellipsis:true,
        },
        {
          title: '紧急联系人电话',
          dataIndex: 'urgentTel',
          width: 120,
        },
        {
          title: '管理科室',
          dataIndex: 'cyksmc',
          width: 100,
        },

        {
          title: '账号信息',
          scopedSlots: { customRender: 'acount' },
          width: 80,
        },
        {
          title: '操作',
          width: '180px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.confirmLoading = true
        return qryMetaDataByPage(Object.assign(parameter, this.queryParams))
          .then((res) => {
            if (res.code == 0 && res.data.rows.length > 0) {
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.totalRows,
                totalPage: res.data.totalPage / parameter.pageSize,
                rows: res.data.rows,
              }
              data.rows.forEach((item, index) => {
                item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
              })
            } else {
              data = null
            }
            return res.data
          })
          .finally((data) => {
            this.confirmLoading = false
          })
      },
    }
  },
  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log(this.user)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          // var departmentIds = []
          // res.data.forEach((item, index) => {
          //   departmentIds = departmentIds + item.departmentId
          //   if (index < res.data.length - 1) {
          //     departmentIds.push(item.departmentId)
          //   }
          // })
          // console.log(departmentIds)
          // this.queryParams.depts= departmentIds
          this.$refs.table.refresh(true)
        }
      })
    }
  },
  methods: {
    editPlan(record) {
      this.$router.push({
        name: 'project_edit',
        query: {
          planId: record.id,
        },
      })
    },

    onDepartmentChange(index) {
      console.log('index=' + index)
      if (index == undefined) {
        this.queryParams.depts = []
        // this.queryParams.departmentName= ''
      } else {
        // debugger
        console.log('11111:', this.originData[index].departmentId)
        this.queryParams.depts.push(this.originData[index].departmentId)
        // this.queryParams.depts = this.originData[index].departmentId
        // console.log("ssss:",this.queryParams.depts)
      }
    },
    /**
     * 重置
     */
    reset() {
      this.queryParams.depts = []
      this.queryParams.name = ''
      this.queryParams.tableName = ''
      this.$refs.table.refresh(true)
    },

    // upDateStatesText(_status) {
    //   return _status == 1 ? '确定停用此方案吗？' : '确定启用用此方案吗？'
    // },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
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
  }
}
</style>