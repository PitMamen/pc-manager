<template>
  <a-card :bordered="false" class="card-right-pac" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="12">
            <a-form-item label="姓名">
              <a-input
                v-model="queryParams.name"
                allow-clear
                placeholder="人员姓名查询"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item style="margin-left:-10%" label="管理科室">
              <a-select
                allow-clear
                v-model="queryParams.depts"
                mode="multiple"
                placeholder="请选择科室"
           
              >
                <a-select-option v-for="(item, index) in originData"  :value="item.departmentId" :key="index">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="24">
            <a-button style="margin-left: 1%" type="primary" @click="$refs.table.refresh(true)" icon="search"
              >查询</a-button
            >
            <a-button style="margin-left: 2%" type="primary" @click="reset()" icon="reload">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
      <div class="div-divider"></div>
      <!-- <a-button style="margin-left: 90%;margin-bottom: 1%;" type="primary" @click="addName()" icon="plus">新增</a-button> -->
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
        <img v-if="record.openidFlag==1" style="width:25px;height:25px" src="~@/assets/icons/weixin.png" />
        <img v-if="record.openidFlag==0" style="width:25px;height:25px" src="~@/assets/icons/weixin2.png" />
      </span>

      <span style="inline-block" slot="action" slot-scope="text, record">
        <a >健康档案</a>
        <a-divider type="vertical" />
      <a >随访管理</a>
      </span>

    
    </s-table>
  </a-card>
</template>


<script>
import { STable } from '@/components'

import {
  qryMetaDataByPage,
  getDeptsPersonal,
  getDepts,
  qryFollowPlan,
  updateFollowPlanStatus,
} from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
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
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '紧急联系人',
          dataIndex: 'urgentContacts',
        },
        {
          title: '紧急联系人电话',
          dataIndex: 'urgentTel',
          width: 150,
        },
        {
          title: '管理科室',
          dataIndex: 'cyksmc',
          width: 150,
        },

        {
          title: '账号信息',
          scopedSlots: { customRender: 'acount' },
          // width: 200,
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
            }else{
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
        console.log("啪啪啪啪：",this.originData[index].departmentId)
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
</style>