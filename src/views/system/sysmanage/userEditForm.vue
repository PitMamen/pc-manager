<template>
  <a-modal
    title="编辑用户"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- v-decorator="['loginName', { rules: [{ required: true, message: '请输入登录账号！' }] }]" -->
          <a-input
            placeholder="请输入登录账号"
            v-decorator="[
              'loginName',
              {
                rules: [{ required: true, message: '请输入登录账号！' }],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/[\u4E00-\u9FA5]/g, '')
                },
              },
            ]"
          />
        </a-form-item>

        <a-form-item label="登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- <a-input
            placeholder="请输入登录密码"
            type="password"
            v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码！' }] }]"
          /> -->
          <a-input-password
            v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码！' }] }]"
            placeholder="请输入登录密码"
          />
        </a-form-item>

        <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            disabled
            placeholder="请输入用户姓名"
            v-decorator="['userName', { rules: [{ required: true, message: '请输入用户姓名！' }] }]"
          />
        </a-form-item>

        <a-form-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            disabled
            placeholder="请输入身份证号"
            type="number"
            v-decorator="['identificationNo', { rules: [{ required: true, message: '请输入身份证号！' }] }]"
          />
        </a-form-item>

        <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            :disabled="ifCan"
            placeholder="请选择所属部门"
            v-decorator="['departmentId', { rules: [{ required: true, message: '请选择所属部门' }] }]"
          >
            <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="用户状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          valuePropName="checked"
        >
          <!-- <a-switch v-decorator="['isOpen', { rules: [{ message: '请选择用户状态！' }] }]" /> -->

          <a-switch @change="isOpenChange" :checked="isOpen" />
        </a-form-item>

        <a-form-item label="用户角色" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-radio-group name="radioGroup" v-model="record.roleId" disabled :default-value="3" @change="radioChange">
            <a-radio :value="3"> 医生 </a-radio>
            <a-radio :value="4" style="width: 100px"> 个案管理师 </a-radio>
            <!-- <a-radio :value="3" style="width: 100px"> 管理员 </a-radio> -->
          </a-radio-group>
        </a-form-item>
        <!-- <a-input
          v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }, { validator: handlePass }] }]"
          name="password"
        /> -->
        <a-form-item
          label="管理科室"
          v-show="radioValue == 4"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-select
            allow-clear
            mode="multiple"
            placeholder="请选择管理科室"
            v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]"
          >
            <a-select-option v-for="(item, index) in keshiDataPerson" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { updateUser, getDepts } from '@/api/modular/system/posManage'

export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      keshiData: [],
      keshiDataPerson: [],
      radioValue: 3,
      isOpen: true,
      record: {},
      ifCan: false,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
    }
  },

  created() {},

  methods: {
    //初始化方法
    edit(record) {
      this.record = record
      this.visible = true
      this.getDeptsOut()
    },

    hasCaseManageIds(rule, value, callback) {
      if (this.radioValue == 4 && (!value || value == 0)) {
        callback('请选择管理科室')
      }
      callback()
    },

    isOpenChange() {
      this.isOpen = this.isOpen ? false : true
    },

    radioChange(event) {
      console.log('radioChange', event)
      if (event.target.value == 3) {
        //添加
        this.keshiData.shift()
        setTimeout(() => {
          this.form.setFieldsValue({
            departmentId: this.keshiData[0].departmentId,
          })

          //TODO 状态处理
        }, 100)
        this.ifCan = false
        this.radioValue = 3
      } else if (event.target.value == 4) {
        //个案管理师的时候写死 病友服务中心
        this.keshiData.unshift({
          departmentId: 1,
          departmentName: '病友服务中心',
          hospitalId: 1,
          parentId: 0,
          children: null,
        })

        setTimeout(() => {
          this.form.setFieldsValue({
            departmentId: 1,
          })

          //TODO 状态处理
        }, 100)
        this.ifCan = true
        this.radioValue = 4
      }
    },

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.keshiData = res.data
          this.keshiDataPerson = JSON.parse(JSON.stringify(res.data))

          if (this.record.departmentId == 1) {
            this.keshiData.unshift({
              departmentId: 1,
              departmentName: '病友服务中心',
              hospitalId: 1,
              parentId: 0,
              children: null,
            })
            this.ifCan = true
            this.radioValue = 4
          } else {
            this.ifCan = false
            this.radioValue = 3
          }
          setTimeout(() => {
            console.log('departmentId', this.record.departmentId)
            console.log('record', this.record)
            this.form.setFieldsValue({
              loginName: this.record.loginName,
              password: this.record.password,
              userName: this.record.userName,
              roleId: this.record.roleId,
              identificationNo: this.record.identificationNo,
              departmentId: this.record.departmentId,
              caseManageIds: this.record.caseManageIds,
            })
          }, 100)

          this.isOpen = this.record.status == 0 ? true : false
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      // this.confirmLoading = true

      validateFields((errors, values) => {
        console.log('values', values)
        console.log('errors', errors)
        if (!errors) {
          console.log('createDoctorUser', values)
          if (this.isOpen) {
            this.$set(values, 'status', 0)
          } else {
            this.$set(values, 'status', 1)
          }
          //没修改密码的话，传空字符串后台认为没修改
          if (values.password.length > 20) {
            values.password = ''
          }
          values.accountId = this.record.accountId
          values.userId = this.record.userId
          values.roleId = this.record.roleId

          updateUser(values)
            .then((res) => {
              if (res.success) {
                this.$message.success('编辑成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('编辑失败：' + res.message)
              }
            })
            .finally((res) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
