<template>
  <a-modal
    title="编辑版本"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="版本名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请上传文件"
            disabled
            v-decorator="['title', { rules: [{ required: true, message: '请上传文件！' }] }]"
          />
        </a-form-item>

        <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请上传文件"
            disabled
            v-decorator="['title', { rules: [{ required: true, message: '请上传文件！' }] }]"
          />
        </a-form-item>
        <a-form-item label="上传" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="clearfix">
            <!-- @preview="handlePreview" -->
            <!--               list-type="picture-card"  -->
            <a-upload
              :action="actionUrl"
              :multiple="true"
              list-type="text"
              :file-list="fileList"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <!-- <div> -->
                <!-- <a-icon type="plus" /> -->
                <div class="upload-btn">选择文件</div>
              </div>
            </a-upload>
            <!-- <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal> -->
          </div>
        </a-form-item>

        <a-form-item label="更新说明" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-textarea
            placeholder="请输入更新说明"
            v-decorator="['content', { rules: [{ required: false, message: '请输入更新说明！' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { qryCodeValue, saveSysKnowledge } from '@/api/modular/system/posManage'

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

      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      fileList: [],
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

    handleChange(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
      } else {
        this.fileList = changeObj.fileList
      }
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
