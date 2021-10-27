<template>
  <a-modal
    title="新增班次"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="创建人"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          admin
        </a-form-item>

      <a-form-item
        label="班次名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        has-feedback
      >
        <a-input placeholder="请输入班次名称" v-decorator="['scheName', {rules: [{required: true, message: '请输入班次名称！'}]}]" />
      </a-form-item>

      <a-form-item
        label="起止时间"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        has-feedback
      >
        <a-time-picker :default-value="moment('00:00', 'HH:mm')" format="HH:mm" v-decorator="['startTime', {rules: [{required: true, message: '请输入开始时间！'}]}]"/>
        <a-time-picker :default-value="moment('00:00', 'HH:mm')" format="HH:mm"  v-decorator="['endTime', {rules: [{required: true, message: '请输入结束时间！'}]}]"/>

      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="班次时长"
      >
        <a-input-number placeholder="" style="width: 100%" v-decorator="['schePeriod',  {rules: [{required: true,  message: '请输入班次时长！'}]},{ initialValue: 100 }]" :min="1" :max="1000" />
      </a-form-item>

      <a-form-item
        label="班次描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        has-feedback
      >
        <a-textarea :rows="4" placeholder="请输入至少五个字符"  v-decorator="['scheDesc']"></a-textarea>
      </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>
</template>


<script>
  import moment from 'moment';
  import { sysRoleAdd } from '@/api/modular/system/roleManage'
  export default {
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this)
      }


    },
    methods: {
      moment,
      //初始化方法
      add (record) {
        this.visible = true
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            schedulerAdd(values).then((res) => {
              if(res.success){
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields();
              }else{
                this.$message.error('新增失败：'+res.message)
              }
            }).finally((res) =>{
              this.confirmLoading = false
            })
          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        this.form.resetFields();
        this.visible = false
      }
    }
  }
</script>
