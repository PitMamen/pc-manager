<template>
  <a-modal
    title="修改"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          style="display: none;"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input v-decorator="['id']" />
        </a-form-item>

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

          <a-input  v-decorator="['fileId']"  style="display: none"/>
          <a-input  v-decorator="['fileName']" style="display: none"/>
          <a-input  v-decorator="['linkUrl']" style="display: none"/>
          <a-input  v-decorator="['previewFileId']" style="display: none"/>
          <a-input  v-decorator="['previewFileName']" style="display: none"/>
        </a-form-item>

        <a-form-item
          label="上传图片"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            name="file"
            :multiple="false"
            action="http://192.168.1.122:8071/fileUpload/uploadImgFile"
            :headers="headers"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>

        </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>
</template>


<script>
  import { bannerEdit } from '@/api/modular/system/banner'
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
        form: this.$form.createForm(this),
        headers: {
          authorization: 'authorization-text',
        }
      }


    },
    methods: {
      handleChange(info) {
        if(info.file.response!=null)  {
          var ret=info.file.response
          if(ret.success){
            this.form.setFieldsValue({
              fileId: ret.data.id
            })
            this.form.setFieldsValue({
              fileName: ret.data.id
            })
            this.form.setFieldsValue({
              linkUrl: ret.data.fileLinkUrl
            })
            this.form.setFieldsValue({
              previewFileId: ret.data.previewFileId
            })
            this.form.setFieldsValue({
              previewFileName: ret.data.previewFileId
            })
          }
        }
      },
      //初始化方法
      edit (record) {
        this.visible = true
        setTimeout(()=>{
          this.form.setFieldsValue(
            {
              id:record.id,
              fileName:record.fileName,
              title:record.title,
              linkUrl:record.linkUrl,
              brief:record.brief
            }
          );
        },100)
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            bannerEdit(values).then((res) => {
              if(res.success){
                this.$message.success('修改成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields();
              }else{
                this.$message.error('修改失败：'+res.message)
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
