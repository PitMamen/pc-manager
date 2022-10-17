<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="方案名称">
              <a-input
                v-model="queryParams.planName"
                allow-clear
                placeholder="可输入方案名称"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="执行科室">
              <a-select allow-clear v-model="queryParams.departmentName" placeholder="请选择科室">
                <a-select-option v-for="(item, index) in originData" :key="index" @change="onDepartmentChange(index)">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="24">
            <a-form-item label="方案状态:">
              <!-- <a-popconfirm class="switch-button"> -->
              <a-switch :checked="queryParams.status===1" @change="onSwitchChange"/>
              <!-- </a-popconfirm> -->
              <a-button style="margin-left: 20%" type="primary" @click="$refs.table.refresh(true)" icon="search"
                >查询</a-button
              >
              <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-button style="margin-left: 95%" type="primary" @click="addName()" icon="plus">新增</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.checkIndex.check(record)">修改</a>
        <a-divider type="vertical" />
       
        <a-popconfirm :title="upDateStatesText(record.status.value)" ok-text="确定" cancel-text="取消" @confirm="Enable(record)">
                <a>{{record.status.value==1?'停用':'启用'}}</a>
              </a-popconfirm>
      </span>
    </s-table>

    <check-index ref="checkIndex" @ok="handleOk" />
    <add-Name ref="addName" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'

import { qryMetaConfigure, getDeptsPersonal, getDepts, qryFollowPlan,updateFollowPlanStatus } from '@/api/modular/system/posManage'
import checkindex from './checkIndex'
import addName from './addName'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    checkindex,
    addName,
  },
  data() {
    return {
      user:{},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        departmentName: '',
        planName: '',
        executeDepartment: '',
        pageNo: 1,
        pageSize: 10,
        status:1,
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
          dataIndex: 'createdTime',
        },
        {
          title: '制定人员',
          dataIndex: 'formulateUserName',
        },
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
        },
        {
          title: '随访名单',
          dataIndex: 'metaConfigureName',
        },
        {
          title: '随访类型',
          dataIndex: 'followType',
        },
        {
          title: '状态',
          dataIndex: 'statusText',
        },
        {
          title: '操作',
          width: '150px',
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
          var departmentIds=[]
        
          res.data.forEach((item,index)=>{
            departmentIds=departmentIds+item.departmentId
           
            if(index < res.data.length-1){
              departmentIds=departmentIds+','
            }
          })
          console.log(departmentIds)
          this.queryParams.executeDepartment= departmentIds
          this.$refs.table.refresh(true)
        }
      })
    }
  },
  methods: {
   
    onSwitchChange(value){
      console.log(value)
      this.queryParams.status=value?1:2
    
      this.$refs.table.refresh(true)
    },
    onDepartmentChange(index){
      this.queryParams.executeDepartment= this.originData[index].departmentId
      this.queryParams.departmentName= this.originData[index].departmentName
    },
    /**
     * 重置
     */
    reset() {
      this.queryParams.status=1
      this.queryParams.planName=''
      this.queryParams.executeDepartment=''
      this.queryParams. pageNo= 1
      
      this.$refs.table.refresh(true)
    },

    /**
     * 启用/停用
     */
    Enable(record) {
    
      this.confirmLoading = true
      var _status=record.status.value==1?2:1
      //更新接口调用
      updateFollowPlanStatus({
        id:record.id,
        status:_status
      }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          record.status.value=_status
          record.status.description=_status==1?'启用':'停用'
          record.statusText=_status==1?'启用':'停用'
          this.handleOk()
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },
    upDateStatesText(_status){
      return _status==1?'确定停用此方案吗？':'确定启用用此方案吗？'
    },
    /**
     * 新增
     */
    addName() {
      // this.$refs.addName.add()
      this.$router.push({ name: 'project_add' })
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
