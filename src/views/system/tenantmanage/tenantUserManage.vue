<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="可输入姓名"
          style="width: 180px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"         
          allow-clear
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择"
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
        <span class="name">状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 180px;height: 28px;">
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
      <a-button  icon="plus" style="float: right; margin-right: 0" @click="$refs.addUser.addModel()">新增</a-button>
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
      
        <a @click="$refs.addUser.editModel(record)" :disabled="record.userStatus !== 0"><a-icon type="edit"></a-icon>修改</a>
        <a-divider type="vertical" />
        <a @click="$refs.assDepartment.addModel(record)" :disabled="record.userStatus !== 0"><a-icon type="apartment"></a-icon>关联科室</a>
        
      </span>
      <span slot="statuas" slot-scope="text, record">
        <!-- <a-switch  :checked="record.userStatus==0"  @change="Enable(record)"/> -->
        <template v-if="true">
          <a-popconfirm placement="topRight" :title="record.userStatus===0 ? '确认停用？' : '确认启用？'" @confirm="() => update(record)">
            <a-switch size="small" :checked="record.userStatus === 0" />
          </a-popconfirm>
        </template>
      </span>
    </s-table>

    <add-User ref="addUser" @ok="handleOk" />
    <ass-Department ref="assDepartment" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'

import {
  queryHospitalList2,
  getDeptsPersonal,
  getDepts,
  searchDoctorUser,
  setDoctorUserStatus,
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
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      idArr: [],
      queryParams: {
        hospitalCode:undefined,//所属机构代码
        notBoundOnly:false,//是否返回未绑定账号的用户
        status: 0,//（0正常、1停用、2删除）
        queryText: ''
      },
      selects: [
      {
          id: '',
          name: '全部'
        },
        {
          id: 0,
          name: '启用'
        },
        {
          id: 1,
          name: '停用'
        }
      ],
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
          dataIndex: 'userName',
        },
        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '出生日期',
          dataIndex: 'birthday',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '人员类型',
          dataIndex: 'userTypeName',
        },
        {
          title: '登录账号',
          dataIndex: 'loginName',
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
        },
        {
          title: '所属科室',
          dataIndex: 'departmentName',
        },
        {
          title: '所属病区',
          dataIndex: 'areaId',
        },
        {
          title: '状态',
          width: '60px',
          fixed: 'right',
          scopedSlots: { customRender: 'statuas' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: 150,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return searchDoctorUser(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0 &&  res.data.rows) {
            res.data.rows.forEach((element) => {
              if(element.birthday){
               
          var birthday2= element.birthday.substring(0, 4) + '-' +element.birthday.substring(4, 6) + '-'+element.birthday.substring(6) 
          element.birthday=birthday2
              }
  
            })
          }
          return res.data
        })
      },
    }
  },



  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      console.log('333:', this.localHospitalCode)
      this.localHospitalCode = this.user.hospitalCode
    }
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
    this.queryHospitalListOut(undefined)
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
     queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      queryHospitalList2(queryData)
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
        this.localHospitalCode = undefined
        this.treeData = []
        this.queryHospitalListOut(undefined)
      }
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
      this.queryParams.hospitalCode = undefined
      this.queryParams.queryText = ''
      this.queryParams.status = 0

      this.$refs.table.refresh(true)
    },

    /**
     * 启用/停用
     */
    update(record) {
      this.confirmLoading = true
      var _status = record.userStatus == 0 ? 1 : 0
      record.userStatus = _status
      //更新接口调用
      setDoctorUserStatus({
        userId: record.userId,
        status: _status,
      }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          
          this.handleOk()
        } else {
          this.$message.error('编辑失败：' + res.message)
          record.userStatus = _status == 0 ? 1 : 0
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
<style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>


