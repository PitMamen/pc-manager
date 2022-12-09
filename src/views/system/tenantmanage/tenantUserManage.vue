<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.planName"
          allow-clear
          placeholder="可输入姓名"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParams.parentDisarmamentId"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"         
        >
        </a-tree-select>
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="queryParams.status === 1" @change="onSwitchChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addUser.addModel()">新增</a-button>
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
      
        <a @click="editPlan(record)" >修改</a>
        <a-divider type="vertical" />
        <a @click="$refs.assDepartment.addModel(record)" >关联科室</a>
        
      </span>
      <span slot="statuas" slot-scope="text, record">
        <a-switch  :checked="record.enableStatus" />
      </span>
    </s-table>

    <add-User ref="addUser" @ok="handleOk" />
    <ass-Department ref="assDepartment" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'

import {
  queryHospitalList,
  getDeptsPersonal,
  getDepts,
  qryFollowPlan,
  updateFollowPlanStatus,
} from '@/api/modular/system/posManage'
import addUser from './addUser'
import assDepartment from './assDepartment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    addUser,
    assDepartment
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      treeData: [],
      idArr: [],
      queryParams: {
        departmentName: '',
        planName: '',
        executeDepartment: '',
        parentDisarmamentId:'',
        status: 1,
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
          title: '姓名',
          dataIndex: 'planName',
        },
        {
          title: '性别',
          dataIndex: '',
        },
        {
          title: '出生日期',
          dataIndex: 'formulateTime',
        },
        {
          title: '联系电话',
          dataIndex: '',
        },
        {
          title: '人员类型',
          dataIndex: 'formulateUserName',
        },
        {
          title: '登录账号',
          dataIndex: '',
        },
        {
          title: '所属机构',
          dataIndex: 'executeDepartmentName',
        },
        {
          title: '所属科室',
          dataIndex: '',
        },
        {
          title: '所属病区',
          dataIndex: '',
        },
        {
          title: '状态',
          width: '80px',
          scopedSlots: { customRender: 'statuas' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: 123,
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
    }
  },

  // watch: {
  //   $route(to, from) {
  //     console.log('watch----serviceList out', to, from)
  //     if (to.path.indexOf('serviceList') > -1) {
  //       console.log('watch----serviceList', to, from)
  //       this.refresh()
  //     }
  //   },
  // },

  mounted() { 
  //用局部引用的时候 this.$bus改成Bus，跟上面引用的名字一样
    this.$bus.$on("proEvent", (data) => {
      console.log('proEvent Refres',data)
      // this.objct = data;
      this.refresh()
    })
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
    this.queryHospitalListOut()
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
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalId)
              this.$set(item, 'value', item.hospitalId)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalId)
                this.$set(item1, 'value', item1.hospitalId)
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
    onSwitchChange(value) {
      console.log(value)
      this.queryParams.status = value ? 1 : 2

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
      this.queryParams.status = 1
      this.queryParams.planName = ''
      this.queryParams.executeDepartment = ''
      this.queryParams.departmentName = ''
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
          record.status.description = _status == 1 ? '启用' : '停用'
          record.statusText = _status == 1 ? '启用' : '停用'
          this.handleOk()
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
