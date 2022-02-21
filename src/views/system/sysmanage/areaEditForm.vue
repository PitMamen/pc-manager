<template>
  <a-modal
    title="编辑病区"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="病区名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入病区名称"
            v-decorator="['inpatientAreaName', { rules: [{ required: true, message: '请输入病区名称！' }] }]"
          />
        </a-form-item>

        <a-form-item label="所属科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            placeholder="请选择所属科室"
            v-decorator="['departmentId', { rules: [{ required: true, message: '请选择所属科室' }] }]"
          >
            <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { newDiseaseArea, getDepts } from '@/api/modular/system/posManage'

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
      queryParam: {},
      visible: false,
      record: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },

  created() {
    this.getKeShi()
  },

  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      this.record = record
      console.log('record', record)
      this.getDeptsOut()
      setTimeout(() => {
        this.form.setFieldsValue({
          inpatientAreaName: record.inpatientAreaName,
          departmentId: record.departmentId,
          id: record.id,
        })
      }, 100)
    },

    getDeptsOut() {
      getDepts(this.queryParam).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(res.data[i], 'xh', i + 1)
          }
          this.keshiData = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.$set(values, 'id', this.record.id)
          newDiseaseArea(values)
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
      this.record = {}
    },
  },
}
</script>
