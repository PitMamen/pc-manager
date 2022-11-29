<template>
  <a-card :bordered="false" class="card-right-pac">
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
      <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
      <div class="div-divider1"></div>
      <div class="table-operator" style="overflow: hidden">
        <a-button icon="plus" style="float: right; margin-right: 0" @click="addTenant()"  @ok="handleOk">新增</a-button>
      </div>
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
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modify.modify(record)">修改</a>
        <a-divider type="vertical" />
        <a @click="resetPwsd(record)">重置密码</a>
        <a-divider type="vertical" />
        <a
          @click="record.initStatuas == 3||record.initStatuas == 4 ? $refs.initRecord.initrecord(record) : initTenant(record)">初始化</a
        >
      </span>

      <span slot="statuas" slot-scope="text, record">
        <a-switch :disabled="true" :checked="record.enableStatus" />
      </span>
    </s-table>

    <modify ref="modify" @ok="handleOk" />
    <add-Tenant ref="addTenant" @ok="handleOk" />
    <init-Record ref="initRecord" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import { getTenantList, tenantInit, resetTenantPwd } from '@/api/modular/system/posManage'
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
        // pageNo: 1,
        // pageSize: 10,
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
          title: '租户名称',
          dataIndex: 'tenantName',
          width: 100,
          ellipsis: true,
        },
        {
          title: '登录账号',
          dataIndex: 'adminAccount',
          width: 180,
        },
        {
          title: '应用权限',
          dataIndex: 'applicationNames',
          width: 180,
          ellipsis: true,
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: 180,
        },
        {
          title: '到期日期',
          dataIndex: 'expireDate',
          width: 180,
        },

        {
          title: '状态',
          dataIndex: 'status',
          width: 70,
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '访问地址',
          dataIndex: 'indexUrl',
          width: 180,
        },

        {
          title: '操作',
          width: '170px',
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
      this.confirmLoading = true
      console.log("租户ID啊：",record.tenantId)
      tenantInit({ tenantId: record.tenantId })
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.$message.success("初始化成功!")
          }else{
            this.$message.error("初始化失败:"+res.message)

          }
        })
        .finally((data) => {
          this.confirmLoading = false
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