<template>
  <a-modal
    title="新增检查"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="请输入检查名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback required>
          <a-select v-model="type" allow-clear placeholder="请输入检查名称">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { sysPosAdd } from '@/api/modular/system/posManage'
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
          code: '1',
          value: 'B超',
        },
        {
          code: '2',
          value: '胸透',
        },
        {
          code: '3',
          value: '体温',
        },
        {
          code: '4',
          value: '耳鼻喉检查',
        },
        {
          code: '5',
          value: '外科检查',
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
      this.visible = true
      this.index = index
    },

    handleSubmit() {
      this.$emit('ok', this.index, this.type)
      this.visible = false
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
