<template>
  <a-modal
    title="新增版本"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-if="false" label="版本名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请上传文件"
            disabled
            v-decorator="['versionCode', { rules: [{ required: true, message: '请上传文件！' }] }]"
          />
        </a-form-item>

        <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请上传文件"
            disabled
            v-decorator="['versionNumber', { rules: [{ required: true, message: '请上传文件！' }] }]"
          />
        </a-form-item>
        <a-form-item label="上传" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="clearfix">
            <!-- @preview="handlePreview" -->
            <!--               list-type="picture-card"  -->
            <a-upload
              :action="actionUrl"
              :multiple="false"
              :data="uploadData"
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
            v-decorator="['versionDescription', { rules: [{ required: false, message: '请输入更新说明！' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { addAppVersion } from '@/api/modular/system/posManage'
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

      // actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      actionUrl: '/api/bdcApi/appManager/uploadAppFile',
      fileList: [],
      uploadData: { platform: 1 },
      versionData: {
        fileName: '',
        fileSize: '',
        downloadUrl: '',
        fileHash: '',
        versionCode: '',
        versionNumber: 0,
        versionDescription: '',
        // 平台 1 医生端
        platform: 1,
        // 状态 0 正常 1 发布 2 删除
        state: 0,
        // fileName: 'HealthManage_v1.2.2_13_debug.apk',
        // fileSize: '54592595',
        // downloadUrl:
        //   'http://develop.mclouds.org.cn:8008/appManager/downloadApp/doctor/HealthManage_v1.2.2_13_debug.apk',
        // fileHash: '47f93a95671ab6fd8eebaeb387228ee9',
        // versionCode: 'v1.2.2',
        // versionNumber: '13',
      },
    }
  },
  created() {},
  methods: {
    //初始化方法
    add() {
      this.visible = true
      this.fileList = []
    },

    handleChange(changeObj) {
      console.log('fff', changeObj)
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
      } else {
        this.fileList = changeObj.fileList
        if (this.fileList[0].response && this.fileList[0].response.data) {
          this.versionData = Object.assign(this.versionData, this.fileList[0].response.data)
          setTimeout(() => {
            this.form.setFieldsValue({
              versionCode: this.versionData.versionCode,
              versionNumber: this.versionData.versionNumber,
              // versionDescription: this.versionData.versionDescription,
            })
          }, 100)
        }
      }
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          let user = Vue.ls.get(TRUE_USER)
          this.$set(this.versionData, 'createrId', user.userId)
          this.$set(this.versionData, 'createrName', user.userName)
          this.$set(this.versionData, 'versionDescription', values.versionDescription)

          addAppVersion(this.versionData)
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
<style lang="less">
.upload-btn {
  color: white;
  background-color: #3894ff;
  padding: 3px 8px;
  border-radius: 5px;
}
</style>