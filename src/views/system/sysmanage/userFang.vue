<template>
  <a-modal
    title="编辑角色"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="管理科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            mode="multiple"
            placeholder="请选择管理科室"
            v-decorator="['caseManageIds', { rules: [{ required: true, message: '请选择管理科室！' }] }]"
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
import { createDoctorUser, getDepts } from '@/api/modular/system/posManage'

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
      visible: false,
      confirmLoading: false,
      keshiDataPerson: [],
      caseManageIds: [],

      form: this.$form.createForm(this),
    }
  },

  created() {
    this.getDeptsOut()
  },

  methods: {
    //初始化方法
    add(caseManageIds) {
      this.caseManageIds = caseManageIds
      this.visible = true
      setTimeout(() => {
        this.form.setFieldsValue({
          caseManageIds: caseManageIds,
        })
      }, 100)
    },

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          //用于最下面选择的科室数据
          this.keshiDataPerson = JSON.parse(JSON.stringify(res.data))
          this.keshiDataPerson.shift()
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
          this.$emit('ok', values)
          this.visible = false
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
