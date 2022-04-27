<template>
  <a-modal
    title="编辑问答"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="所属类别" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            placeholder="请选择类别"
            v-decorator="['knowledgeType', { rules: [{ required: true, message: '请选择类别' }] }]"
          >
            <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="内容标题" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入内容标题"
            v-decorator="['title', { rules: [{ required: true, message: '请输入内容标题！' }] }]"
          />
        </a-form-item>

        <a-form-item label="内容详情" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-textarea
            placeholder="请输入内容详情"
            v-decorator="['content', { rules: [{ required: true, message: '请输入内容详情！' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { qryCodeValue, saveTradeAppoint } from '@/api/modular/system/posManage'

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
      statusData: [],
      visible: false,
      record: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },

  created() {
    qryCodeValue('KNOWLEDGE_TYPE').then((res) => {
      if (res.code == 0) {
        if (res.data && res.data.length > 0) {
          this.statusData = res.data
        }
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      this.record = {}
      this.record = record
      setTimeout(() => {
        this.form.setFieldsValue({
          knowledgeType: record.knowledgeType,
          title: record.title,
          content: record.content,
        })
      }, 100)
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          let chooseOne = this.statusData.find((item) => {
            return item.code == values.knowledgeType
          })

          this.record.knowledgeType = values.knowledgeType
          this.record.title = values.title
          this.record.content = values.content
          this.record.typeName = chooseOne.value

          delete this.record.updateTimeOut
          delete this.record.xh

          saveSysKnowledge(this.record)
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
