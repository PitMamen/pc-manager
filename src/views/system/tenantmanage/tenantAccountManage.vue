<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="可输入姓名、账号查询"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
    
      <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="queryParams.status === 0" @change="onSwitchChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addAccount.addModel()">新增</a-button>
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
      
        <a  :disabled="record.accountStatus !== 0" @click="$refs.addAccount.editModel(record)">修改</a>
        <a-divider type="vertical" />
        <a @click="goAssDepartmanage(record)" :disabled="record.accountStatus !== 0">管理科室</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定重置密码吗？" ok-text="确定" cancel-text="取消" @confirm="goResetPwd(record)">
          <a :disabled="record.accountStatus !== 0">重置密码</a>
        </a-popconfirm>
        
      </span>
      <span slot="statuas" slot-scope="text, record">
        <a-switch  :checked="record.accountStatus==0"  @change="Enable(record)"/>
      </span>
    </s-table>

    <add-Account ref="addAccount" @ok="handleOk" />
    <departmanage ref="departmanage" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'

import {
  resetPasswordByAdmin,
  getDeptsPersonal,
  getDepts,
  searchDoctorAccount,
  setDoctorAccountStatus,
} from '@/api/modular/system/posManage'
import addAccount from './addAccount'
import departmanage from './departmanage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    addAccount,
    departmanage,
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      treeData: [],
      idArr: [],
      queryParams: {
        hospitalCode: '',
        notBoundOnly: false,
        queryText: '',
        status: 0,
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
          title: '登录账号',
          dataIndex: 'loginName',
        },
        {
          title: '人员姓名',
          dataIndex: 'userName',
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
        },
        {
          title: '角色',
          dataIndex: 'roleNames',
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
        },
       
        {
          title: '状态',
          width: 80,
          scopedSlots: { customRender: 'statuas' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: 190,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return searchDoctorAccount(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0 &&  res.data.rows) {
            res.data.rows.forEach((element) => {
              
            })
          }
          return res.data
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
          this.$refs.table.refresh(true)
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          var departmentIds = []

          res.data.forEach((item, index) => {
            departmentIds = departmentIds + item.departmentId

            if (index < res.data.length - 1) {
              departmentIds = departmentIds + ','
            }
          })
          console.log(departmentIds)
          this.queryParams.executeDepartment = departmentIds
          this.$refs.table.refresh(true)
        }
      })
    }
   
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


    /**
     * 
     * @param {关联科室} value 
     */
     goAssDepartmanage(record){
      this.$refs.departmanage.assdepartmanage(record)
     },

    



    
    onSwitchChange(value) {
      console.log(value)
      this.queryParams.status = value ? 0 : 1

      this.$refs.table.refresh(true)
    },
    onDepartmentChange(index) {
      console.log('index=' + index)
      if (index == undefined) {
        this.queryParams.executeDepartment = ''
        this.queryParams.departmentName = ''
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
     
      this.queryParams.hospitalCode = ''
      this.queryParams.queryText = ''
      this.queryParams.status = 0
   
      this.queryParams.pageNo = 1

      this.$refs.table.refresh(true)
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      this.confirmLoading = true
      var _status = record.accountStatus == 0 ? 1 : 0
      //更新接口调用
      setDoctorAccountStatus({
        accountId: record.accountId,
        status: _status,
      }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          record.accountStatus = _status
         
          this.handleOk()
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },
    //重置密码
    goResetPwd(record){
      resetPasswordByAdmin({
        accountId: record.accountId,
      }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
         
          this.handleOk()
        } else {
          this.$message.error('操作失败：' + res.message)
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
  margin-bottom: 10px!important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
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
      height: calc(100% - 96px);
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
