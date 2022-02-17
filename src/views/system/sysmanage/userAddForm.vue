<template>
  <a-modal
    title="修改医生用户"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            
            placeholder="请输入姓名"
            v-decorator="['xm', { rules: [{ required: true, message: '请输入用户名称！' }] }]"
          />
        </a-form-item>

        <a-form-item label="归属部门" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            placeholder="请选择归属部门"
            v-decorator="['dept', { rules: [{ required: true, message: '请选择归属部门' }] }]"
          >
            <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            
            placeholder="请输入登录账号"
            v-decorator="['account', { rules: [{ required: true, message: '请输入登录账号！' }] }]"
          />
        </a-form-item>

        <a-form-item label="登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            
            placeholder="请输入登录密码"
            v-decorator="['psd', { rules: [{ required: true, message: '请输入登录密码！' }] }]"
          />
        </a-form-item>

        <a-form-item label="用户状态" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- <a-switch :checked="record.isOnline" v-decorator="['isOpen', { rules: [{ message: '请选择性别！' }] }]" /> -->
          <a-switch  v-decorator="['isOpen', { rules: [{ message: '请选择用户状态！' }] }]" />
        </a-form-item>

        <a-form-item label="用户角色" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-radio-group
            name="radioGroup"
            :default-value="1"
            v-decorator="['role', { rules: [{ required: true, message: '请选择用户角色！' }] }]"
          >
            <a-radio :value="1"> 医生 </a-radio>
            <a-radio :value="2" style="width: 100px"> 个案管理师 </a-radio>
            <a-radio :value="3" style="width: 100px"> 管理员 </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="管理科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            placeholder="湘雅附二医院"
            v-decorator="['jg', { rules: [{ required: true, message: '请选择管理科室' }] }]"
          >
            <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { changeStatus, getKeShiData } from '@/api/modular/system/posManage'

export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      keshiData: [],
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,
      
      form: this.$form.createForm(this),
    }
  },

  created() {
    this.getKeShi()
  },

  methods: {
    //初始化方法
    add(record) {
      this.visible = true
      console.log('record', record)
      setTimeout(() => {
        this.form.setFieldsValue({
          id: record.id,
          xm: record.xm,
          jg: '湘雅附二医院',
          ssks: record.ssks,
          zhic: record.zhic,
          tel: record.tel,
        })
        if (record.xb == '男' || !record.xb) {
          this.form.setFieldsValue({
            xb: 1,
          })
        } else {
          this.form.setFieldsValue({
            xb: 2,
          })
        }
      }, 100)
    },
    onSelected(ssks) {
      for (let i = 0; i < this.keshiData.length; i++) {
        if (this.keshiData[i].yyksdm == ssks) {
          this.seletSsksName = this.keshiData[i].yyksmc
        }
      }
    },

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
        })
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (values.xb == 1) {
            values.xb = '男'
          } else {
            values.xb = '女'
          }
          values.ssksName = this.seletSsksName
          delete values.jg
          changeStatus(values)
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
