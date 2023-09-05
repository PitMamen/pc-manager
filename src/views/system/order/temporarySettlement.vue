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
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">医护人员:</span>
        <a-select v-model="queryParams.classifyId" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in docList" :key="index" :value="item.id">{{
            item.classifyName
          }}</a-select-option>
        </a-select>
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
        <a @click="goExamine(record)">交易详情</a>
      </span>

      <span slot="userNameaction" slot-scope="text, record">
        <a @click="$refs.addUser.editModel(record,'signing')">{{record.userName}}</a>
      </span>


      



    </s-table>

    <add-User ref="addUser" @ok="handleOk" />

  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import addUser from '../tenantmanage/addUser'

import {
  queryHospitalList,
  getDeptsPersonal,
  getDepts,
  searchDoctorUser,
  getCommodityClassify,
} from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    addUser
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      treeData: [],
      idArr: [],
      docList: [],
      queryParams: {
        hospitalCode: undefined, //所属机构代码
        notBoundOnly: false, //是否返回未绑定账号的用户
        status: 0, //（0正常、1停用、2删除）
        queryText: '',
      },
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 0,
          name: '启用',
        },
        {
          id: 1,
          name: '停用',
        },
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
          title: '医疗机构',
          dataIndex: 'userName',
        },
        {
          title: '医生姓名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userNameaction' },
        },
        {
          title: '身份证号',
          dataIndex: 'birthday',
        },
        {
          title: '电话号码',
          dataIndex: 'phone',
        },
        {
          title: '临工平台',
          dataIndex: 'userTypeName',
        },
        {
          title: '账户数',
          dataIndex: 'loginName',
        },
        {
          title: '当前余额',
          dataIndex: 'hospitalName',
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
          if (res.code == 0 && res.data.rows) {
            res.data.rows.forEach((element) => {
              if (element.birthday) {
                var birthday2 =
                  element.birthday.substring(0, 4) +
                  '-' +
                  element.birthday.substring(4, 6) +
                  '-' +
                  element.birthday.substring(6)
                element.birthday = birthday2
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

    getCommodityClassify({}).then((res) => {
      if (res.code == 0) {
        this.docList = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },
  methods: {




    goExamine(record) {
      let data = JSON.parse(JSON.stringify(record))
      this.$set(data, 'time', this.queryParams.createdTime)
      var state = ''
      if (this.currentTab == 1) {
        state = '待结算'
      } else if (this.currentTab == 2) {
        state = '已结算'
      } else if (this.currentTab == 3) {
        state = '不予结算'
      }
      this.$set(data, 'status', state)
      this.$router.push({
        path: '/order/temporaryDetail',
        query: {
          dataStr: JSON.stringify(data),
        },
      })
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
      queryHospitalList(queryData)
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
  
  
  