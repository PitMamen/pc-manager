<template>
  <a-card  :confirm-loading="confirm2Loading" :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
        allow-clear
          v-model="queryParams.tenantName"
          placeholder="可输入用户名称名称查询"
          style="width: 120px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <!-- <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div> -->
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 120px;height: 28px;">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
      
    </div>

    <div class="table-operator" style="overflow: hidden">
        <a-button icon="plus" style="float: right; margin-right: 0" @click="addTenant()"  @ok="handleOk">新增</a-button>
      </div>

    <!-- 修改密码弹框 -->
    <a-modal
      :title="titleResetPwd"
      :visible="visible_updPwd"
      :confirm-loading="confirmLoading"
      @ok="handleOkUpdPwd"
      @cancel="handleCancelUpdPwd"
    >
      <a-form :form="form2" >
        <!-- <a-form-item label="原密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入原密码"
            type="password"
            v-decorator="['oldPassword', { rules: [{ required: true, message: '请输入原密码！' }] }]"
          />
        </a-form-item> -->
        <a-form-item label="新密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-password 
            placeholder="请输入新密码"
            type="password"
            defaultValue=""
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: '请输入新密码！' },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="重复新密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-password 
            placeholder="请再次输入新密码"
            type="password"
            defaultValue=""
            v-decorator="[
              'confirm',
              {
                rules: [
                  { required: true, message: '请再次输入新密码！' },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

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
        <a @click="$refs.modify.modify(record)"><a-icon type="edit"></a-icon>修改</a>
        <a-divider type="vertical" />
        <a @click="resetPwsd(record)"><a-icon type="undo"></a-icon>重置密码</a>
        <a-divider type="vertical" />
        <a
          @click="record.initStatuas == 3||record.initStatuas == 4 ? $refs.initRecord.initrecord(record) : initTenant(record)"><a-icon style="margin-right:2px" type="history"></a-icon>初始化</a
        >
      </span>

      <span slot="statuas" slot-scope="text, record">
        <!-- <a-switch  :checked="record.enableStatus" @click="statusCheck(record)"/> -->
        <template v-if="true">
          <a-popconfirm placement="topRight" :title="record.enableStatus ? '确认停用？' : '确认启用？'" @confirm="() => statusCheck(record)">
            <a-switch size="small" :checked="record.enableStatus" />
          </a-popconfirm>
        </template>
      </span>
    </s-table>

    <modify ref="modify" @ok="handleOk" />
    <add-Tenant ref="addTenant" @ok="handleOk" />
    <init-Record ref="initRecord" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import { getTenantList, tenantInit, resetTenantPwd,updateTenantStatus } from '@/api/modular/system/posManage'
// import checkIndex from './checkIndex'
import addTenant from './addTenant'
import modify from './modify'
import initRecord from './initRecord'
export default {
  components: {
    STable,
    modify,
    addTenant,
    initRecord,
  },
  data() {
    return {
      // enableStatus:"",
      visible_updPwd: false,
      form1: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      isOpen: true,
      titleResetPwd:'',
      tenantId:'',
      // queryParamResetPwdData:{
      //   tenantId:"",
      //  password:"",
      // },
      datas: [],
      keshiData: [],
      queryParams: {
        metaName: '',
        status: 1,
        tenantName: '',
      },
      selects: [
      {
          id: '',
          name: '全部'
        },
        {
          id: 1,
          name: '启用'
        },
        {
          id: 2,
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
      confirm2Loading:false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '租户名称',
          dataIndex: 'tenantName',
          
          ellipsis: true,
        },
        {
          title: '登录账号',
          dataIndex: 'adminAccount',
         
        },
        {
          title: '应用权限',
          dataIndex: 'applicationNames',
         
          ellipsis: true,
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
         
        },
        {
          title: '到期日期',
          dataIndex: 'expireDate',
          
        },

        {
          title: '访问地址',
          dataIndex: 'indexUrl',
          
        },

        {
          title: '状态',
          dataIndex: 'status',
          fixed: 'right',
          width: 60,
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '操作',
          width: 230,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getTenantList(Object.assign(parameter, this.queryParams)).then((res) => {
          console.log('请求结果:', res.message)
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.size,
            rows: res.data.records,
          }
          if (res.code == 0 && res.data.records.length > 0) {
            data.rows.forEach((item, index) => {
              // this.$set(item, 'zt', item.status.description)
              this.$set(item, 'enableStatus', item.status != null ? item.status.value == 1 : 2)
              this.$set(item, 'initStatuas', item.initStatus != null ? item.initStatus.value : '')
            })
          }

          return data
        })
      },
    }
  },
  methods: {

    /**
     * 重置
     */
    reset() {
        this.queryParams.tenantName = ''
        this.queryParams.status=1
        this.handleOk()
    },

    /**
     *
     * @param {显示修改密码弹框} record
     */
    resetPwsd(record) {
      // console.log("55555",record.tenantId)
      this.visible_updPwd = true
      this.tenantId = record.tenantId
      this.titleResetPwd = "重置  "+record.tenantName+"  管理员密码"
    },

      /**
    * 开关
    */
    statusCheck(record){
     var state = ! record.enableStatus
     let queryParam ={
      tenantId:record.tenantId,
      status:state?1:2
     }
     this.confirmLoading = true
     updateTenantStatus(queryParam)
     .then((res) => {
       if (res.code == 0 && res.success) {
         record.enableStatus = state
         this.$message.success('操作成功')
            } else {
              this.$message.error('操作失败:' + res.message)
            }
            setTimeout(() => {
            this.handleOk()
          }, 500)
          })
          .finally((res) => {
            this.confirmLoading = false
          })

    },

    /**
     * 提交修改密码
     */
    handleOkUpdPwd() {
      const {
        form2: { validateFields },
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          var requestData = {
            password: values.password,
            tenantId: this.tenantId ,
          }
          // console.log("4444:",requestData)
          resetTenantPwd(requestData).then((res) => {
            if (res.success) {
              this.$message.success('修改成功')
              this.handleCancelUpdPwd()
            } else {
              this.$message.error('修改失败：' + res.message)
            }
          })
        }
      })
    },

    /**
     * 隐藏修改密码弹框
     */
    handleCancelUpdPwd() {
      this.visible = false
      this.visible_updPwd = false
      this.form2.resetFields()
    },

    compareToFirstPassword(rule, value, callback) {
      const form2 = this.form2
      if (value && value !== form2.getFieldValue('password')) {
        callback('请确认两次输入密码的一致性！')
      } else {
        callback()
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form2 = this.form2
      if (value && this.confirmDirty) {
        form2.validateFields(['confirm'], { force: true })
      }
      callback()
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      console.log('ddd', record)
      record.status.value = record.status.value == 1 ? 2 : 1
      record.enableStatus = record.status.value == 1 ? '停用' : '启用'
      var queryParamData = {
        id: record.id,
        status: record.status.value,
      }
    },

    /**
     * 初始化操作
     */
    initTenant(record) {
      this.confirm2Loading = true
      console.log("租户ID啊：",record.tenantId)
      tenantInit({ tenantId: record.tenantId })
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.handleOk()
            this.$message.success("初始化成功!")
          }else{
            this.$message.error("初始化失败:"+res.message)

          }
        })
        .finally((data) => {
          this.confirm2Loading = false
        })
    },

    /**
     * 新增
     */
    addTenant() {
      this.$refs.addTenant.add()
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    /**
     * 状态开关
     */
    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParams.status = 1
      } else {
        this.queryParams.status = 2
      }
      this.handleOk()
    },
  },
}
</script>
  
  <style lang="less">



.card-right-pac {
  overflow: hidden;
  width: 100%;

  .table-operator {
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
  button {
    margin-right: 8px;
  }

  .title {
    background: #fff;
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
}


.div-divider1 {
  margin-bottom: 0.5%;
  margin-top: 0.5%;
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

