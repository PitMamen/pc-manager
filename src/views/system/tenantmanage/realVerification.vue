<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.queryStr"
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
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          allow-clear
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParams.authStatus" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">渠道来源:</span>
        <a-select v-model="queryParams.authSource" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in fromselect" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <!-- <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addUser.addModel()">新增</a-button>
    </div> -->

    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >

    <!-- :disabled="record.userStatus !== 0" -->
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.verificationView.process(record)" 
          ><a-icon style="margin-right: 5px" :type="getIcon(record.authStatusStr)"></a-icon>{{getTextShow(record.authStatusStr)}}</a
        >
      </span>

      <span slot="statuas" slot-scope="text, record"  :class="getColor(record.authStatusStr)">
        <!-- {{ getType(record.userStatus) }} -->
        {{ record.authStatusStr }}
      </span>
    </s-table>

    <verification-View ref="verificationView" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'

import {
  queryHospitalList,
  getDeptsPersonal,
  getDepts,
  searchDoctorUser,
  getTemporaryPageList,
} from '@/api/modular/system/posManage'
import verificationView from './verificationView'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    verificationView,
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      treeData: [],
      idArr: [],
      queryParams: {
        hospitalCode: undefined, //所属机构代码
        authStatus: '', //（1\3\9）
        authSource: undefined, //（1\2）
        queryStr: '',
      },
      selects: [
      {
          id: '',
          name: '全部',
        },
        {
          id: '1',
          name: '待审核',
        },
        {
          id: '3',
          name: '不通过',
        },
        {
          id: '9',
          name: '通过',
        },
      ],

      fromselect: [
        {
          id: 1,
          name: '注册认证',
        },
        {
          id: 2,
          name: '更新认证',
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
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '出生日期',
          dataIndex: 'birthDay',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '人员类型',
          dataIndex: 'personType',
        },
        {
          title: '登录账号',
          dataIndex: 'accountName',
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
          width: 150,
          ellipsis: true,
        },
        {
          title: '所属科室',
          dataIndex: 'departmentName',
          width: 150,
          ellipsis: true,
        },
        {
          title: '所属病区',
          dataIndex: 'areaId',
          width: 150,
          ellipsis: true,
        },
        {
          title: '申请时间',
          dataIndex: 'createTime',
        },
        {
          title: '渠道来源',
          dataIndex: 'authSourceStr',
        },

        {
          title: '状态',
          width: 120,
          scopedSlots: { customRender: 'statuas' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: 120,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {   //
        return getTemporaryPageList(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0 && res.data.records) {
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.total,
                totalPage: res.data.total / parameter.pageSize,
                rows: res.data.records,
              }

              data.rows.forEach((item) => {
                this.$set(item, 'personType', this.getPersonType(item.personType))
                this.$set(item, 'isLook', this.isLook(item.authStatusStr))
              })


              return data



            // res.data.records.forEach((element) => {
            //   if (element.birthday) {
            //     var birthday2 =
            //       element.birthday.substring(0, 4) +
            //       '-' +
            //       element.birthday.substring(4, 6) +
            //       '-' +
            //       element.birthday.substring(6)
            //     element.birthday = birthday2
            //   }
            // })
          }
        //   return res.data
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
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },


    getPersonType(string) {
      if (string == 'doctor') {
        return '医生'
      } else if (string == 'nurse') {
        return '护士'
      }
    },

    getIcon(value) {
      if (value == '待审核') {
        return 'idcard'
      } else {
        return 'eye'
      }
    },


    getTextShow(value){
        if(value=='审核通过'||value=='审核不通过'){
         return '查看'
        }else{
            return '审核'
        }
    },



    getColor(value) {
      if (value == '审核通过') {
        return 'span-green-p'
      } else if (value == '审核不通过') {
        return 'span-red'
      } else if (value == '待审核') {
        return 'span-gray'
      }
    },


   isLook(value){
    if(value=='待审核'){
        return false
    }else{
        return true
    }
   },



    getType(value) {
      if (value == 0) {
        return '待审核'
      } else if (value == 1) {
        return '通过'
      } else if (value == 2) {
        return '不通过'
      }
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
      this.queryParams.queryStr = ''
      this.queryParams.authStatus = ''
      this.queryParams.authSource = undefined

      this.$refs.table.refresh(true)
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

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
  <style lang="less" scoped>


.span-green-p {
    background-color: #edffed;
    padding: 2px 10px;
    font-size: 12px;
    color: #0e9b0b;
    border: #69c07d 1px solid;
  }

  .span-red {
    background-color: #fff2f1;
    padding: 2px 4px;
    font-size: 12px;
    color: #f26161;
    border: #f26161 1px solid;
  }

  .span-gray {
    background-color: #fafafa;
    padding: 2px 10px;
    font-size: 12px;
    color: #4d4d4d;
    border: #4d4d4d 1px solid;
    // background-color: #85888e;
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
  
  
  