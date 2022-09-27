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
        <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="clearfix" style="margin-top: 20px">
            <a-upload
              :action="actionUrl"
              :headers="headers"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelPreview">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>

        <a-form-item label="职级" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入职级"
            v-decorator="['professionalTitle', { rules: [{ required: false, message: '请输入职级！' }] }]"
          />
        </a-form-item>

        <a-form-item label="擅长" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入擅长"
            v-decorator="['expertInDisease', { rules: [{ required: false, message: '请输入擅长！' }] }]"
          />
        </a-form-item>

        <!-- style="margin-left: 0 !important; margin-top: 1%" -->
        <a-form-item label="个人简介" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-textarea
            placeholder="请输入个人简介"
            v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入个人简介！' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

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

      form: this.$form.createForm(this),

      fileList: [],
      previewVisible: false,
      docInfo: {},
      previewImage: '',
      actionUrl: '/api/content-api/fileUpload/uploadImgFile',
      headers: {
        Authorization: '',
      },
    }
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
  },

  methods: {
    //初始化方法
    add(docInfo) {
      this.fileList = []
      this.docInfo = docInfo
      this.visible = true
      if (this.docInfo) {
        setTimeout(() => {
          this.form.setFieldsValue({
            professionalTitle: docInfo.professionalTitle,
            expertInDisease: docInfo.expertInDisease,
            doctorBrief: docInfo.doctorBrief,
          })
        }, 100)

        if (this.docInfo.avatarUrl) {
          this.fileList.push({
            uid: '-1',
            name: '封面' + 1,
            status: 'done',
            url: this.docInfo.avatarUrl,
          })
        }
      }
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

    handleCancelPreview() {
      this.previewVisible = false
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
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
          //组装头像图片  只有医生护士才有头像 职级 擅长 简介
          if (this.fileList.length > 0) {
            this.$set(values, 'avatarUrl', '')
            if (this.fileList[0].response) {
              values.avatarUrl = this.fileList[0].response.data.fileLinkUrl
            } else {
              values.avatarUrl = this.fileList[0].url
            }
          }
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
