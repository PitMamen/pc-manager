<template>
  <a-card :bordered="false" class="sys-card" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">姓名:</span>
        <a-input
          v-model="queryParams.name"
          allow-clear
          placeholder="人员姓名查询"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">管理科室:</span>
        <!-- <a-select
          class="sitemore"
          style="min-width: 120px; height: 28px; padding-bottom: 0px"
          :title="queryParams.depts"
          :maxTagCount="1"
          allow-clear
          v-model="queryParams.depts"
          mode="multiple"
          placeholder="请选择科室"
        >
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select> -->
        <a-select       
        style="min-width: 150px; height: 28px;"
          :maxTagCount="1"
          :collapse-tags="true"
          show-search
          v-model="queryParams.depts"
          mode="multiple"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择科室"
          @change="onDepartmentSelectChange"
          @search="onDepartmentSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in originData" :key="index" :value="item.department_id" >{{
            item.department_name
          }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>

      <!-- <div class="div-divider"></div> -->
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
      <span style="inline-block" slot="acount" slot-scope="text, record">
        <img v-if="record.openidFlag == 1" style="width: 22px; height: 22px" src="~@/assets/icons/weixin.png" />
        <img v-if="record.openidFlag == 0" style="width: 22px; height: 22px" src="~@/assets/icons/weixin2.png" />
      </span>

      <span style="inline-block" slot="action" slot-scope="text, record">
        <a @click="goFile(record)">健康档案</a>
        <a-divider type="vertical" />
        <a @click="$refs.visitManage.distribution(record)">随访管理</a>
      </span>
    </s-table>

    <visit-Manage ref="visitManage" @ok="handleOk" />
    <follow-Model ref="followModel" @ok="handleOk" @cancel="handleCancel" />
  </a-card>
</template>


<script>
import { STable } from '@/components'

import { getDepartmentListForSelect, qryMetaDataByPage, getDeptsPersonal, getDepts } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import visitManage from './visitManage'
import followModel from '../servicewise/followModel'
import Vue from 'vue'
import { size } from 'lodash'
export default {
  components: {
    STable,
    followModel,
    visitManage,
  },
  data() {
    return {
      fetching: false,
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
        
          size: 12,
        },
        {
          title: '姓名',
          dataIndex: 'name',
         
          ellipsis: true,
          size: 12,
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
         
          ellipsis: true,
          size: 12,
        },
        {
          title: '年龄',
          dataIndex: 'age',
         
          size: 12,
        },
        {
          title: '性别',
          dataIndex: 'sex',
         
          size: 12,
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        
          size: 12,
        },
        {
          title: '紧急联系人',
          dataIndex: 'urgentContacts',
         
          ellipsis: true,
          size: 12,
        },
        {
          title: '紧急联系人电话',
          dataIndex: 'urgentTel',
        
          size: 12,
        },
        {
          title: '管理科室',
          dataIndex: 'cyksmc',
         
          size:12,
          ellipsis:true,
        },

        {
          title: '账号信息',
          scopedSlots: { customRender: 'acount' },
         
          size: 12,
        },
        {
          size: 12,
          title: '操作',
          width: '150px',
          fixed: 'right',
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
    // if (this.user.roleId == 7 || this.user.roleName == 'admin') {
    //   getDepts().then((res) => {
    //     if (res.code == 0) {
    //       this.originData = res.data
    //     }
    //   })
    // } else {
    //   getDeptsPersonal().then((res) => {
    //     if (res.code == 0) {
    //       this.originData = res.data

    //       this.$refs.table.refresh(true)
    //     }
    //   })
    // }
    this.getDepartmentSelectList(undefined)
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

    /**
     *档案详情
     * @param {} record
     */
    goFile(record) {
      this.$set(record,'userName',record.name)
      this.$set(record,'userSex',record.sex)
      this.$refs.followModel.doFile(record, true)
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
     //获取管理的科室 可首拼
     getDepartmentSelectList(departmentName) {
      this.fetching = true
      getDepartmentListForSelect(departmentName).then((res) => {
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
<style lang="less" scoped>
 /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }
    /deep/.ant-select-selection__placeholder{
      margin-top: -8px !important;
    }
.ant-select-selection--multiple {
  min-height: 28px;
  cursor: text;
  zoom: 1;
}

.sitemore {
  .ant-select-selection.ant-select-selection--single {
    height: 28px !important;
  }

  margin-left: 5px;
  align-items: center;
  .ant-select-selection--multiple {
    width: 100%;
    height: 28px;
    padding-bottom: 2px !important;
    /deep/ .ant-select-selection__rendered {
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
        }
      }
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

<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 38px);
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
