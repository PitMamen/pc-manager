<template>
  <a-modal
    title="新增问答"
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
import { qryCodeValue, saveSysKnowledge } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
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
      visible: false,
      statusData: [],
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
    add() {
      this.visible = true
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
          this.$set(values, 'typeName', chooseOne.value)

          let user = Vue.ls.get(TRUE_USER)
          this.$set(values, 'creator', user.userName)
          saveSysKnowledge(values)
            .then((res) => {
              if (res.success) {
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('新增失败：' + res.message)
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
