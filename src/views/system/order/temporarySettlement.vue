<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择机构"
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
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="goExamine(record)">交易详情</a>
      </span>

      <span slot="userNameaction" slot-scope="text, record">
        <a @click="$refs.addUser.editModel(record,'signing')">{{record.user_name}}</a>
      </span>

    </s-table>
    <add-User ref="addUser" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import addUser from '../tenantmanage/addUser'

import {
  getDeptsPersonal,
  getDepts,
  getCommodityClassify,
  getUserInfoHvyogoPageList,
  accessHospitals1
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
      fetching: false,
      localHospitalCode: undefined,
      idArr: [],
      docList: [],
      queryParams: {
        hospitalCode: undefined, //所属机构代码
        userName: '',
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
          dataIndex: 'hospitalName',
        },
        {
          title: '医生姓名',
          dataIndex: 'user_name',
          scopedSlots: { customRender: 'userNameaction' },
        },
        {
          title: '身份证号',
          dataIndex: 'identification_no',
        },
        {
          title: '电话号码',
          dataIndex: 'phone',
        },
        {
          title: '临工平台',
          dataIndex: 'hvyogo_id',
        },
        {
          title: '账户数',
          dataIndex: 'bankCount',
          align: 'center',
          
        },
        {
          title: '当前余额',
          dataIndex: 'settlement_sum',
          align: 'right',
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
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
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
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   accessHospitals(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalCode)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalCode)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }
    //       return []
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },

/**
     * 所属机构接口
     */
     queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      accessHospitals1(queryData)
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
  
  
  