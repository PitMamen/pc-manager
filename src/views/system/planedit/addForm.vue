<template>
  <a-modal
    title="选择计划类型"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="计划类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select v-model="type" allow-clear placeholder="请选择计划类型">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.taskType">{{
              item.value
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
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
      type: '',
      index: -1,
      typeData: [
        {
          taskType: 'Knowledge',
          value: '健康宣教',
        },
        {
          taskType: 'Quest',
          value: '健康问卷',
        },
        {
          taskType: 'Remind',
          value: '文字提醒',
        },
        {
          taskType: 'Check',
          value: '检查',
        },
        {
          taskType: 'Exam',
          value: '检验',
        },
      ],
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add(index) {
      this.type = ''
      this.index = index
      this.visible = true
      this.index = index
    },

    handleSubmit() {
      if (!this.type) {
        this.$message.error('请选择计划类型')
        return
      }
      let typeBean
      this.typeData.forEach((item) => {
        if (this.type == item.taskType) {
          typeBean = item
        }
      })
      this.$emit('ok', this.index, typeBean)
      this.visible = false
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
