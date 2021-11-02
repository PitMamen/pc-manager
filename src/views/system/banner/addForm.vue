<template>
  <a-modal
    title="添加"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="图片名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input placeholder="输入图片名称，最多80个字" v-decorator="['fileName']" />
        </a-form-item>

      <a-form-item
        label="标题"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input placeholder="输入标题，最多50个字" v-decorator="['title']" />
      </a-form-item>

        <a-form-item
          label="链接url"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input placeholder="输入正确的连接URL，请以https或http开头" v-decorator="['linkUrl']" />
        </a-form-item>

      <a-form-item
        label="摘要"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-textarea :rows="4" placeholder="不能超过200个字"  v-decorator="['brief']"></a-textarea>
      </a-form-item>

        <a-form-item
          label="上传图片"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
<!--          <a-input placeholder="输入正确的连接URL，请以https或http开头" v-decorator="['fileName']" />-->
        </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>
</template>


<script>
  import { bannerAdd } from '@/api/modular/system/banner'
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
      //初始化方法
      add (record) {
        this.visible = true
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            bannerAdd(values).then((res) => {
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
