<template>
  <a-modal
    :title="editTitle"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="就诊人" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <span>{{ record.userName }}</span>
        </a-form-item>

        <a-form-item label="预约检查项" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <span>{{ record.appointItemName }}</span>
        </a-form-item>

        <a-form-item label="期望预约时间" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div style="margin-top: 6%">日期 : {{ record.appointDate }}</div>
          <div>时间段 : {{ record.appointTime }}</div>
        </a-form-item>

        <a-form-item label="检验申请单" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div v-if="hasPic" class="clearfix" style="margin-top: 20px">
            <a-upload
              disabled
              :action="actionUrl"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileListBanner"
              @preview="handlePreviewBanner"
              @change="handleChangeBanner"
            >
              <!-- <div v-if="fileListBanner.length < 5"> -->
              <div v-if="false">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisibleBanner" :footer="null" @cancel="handleCancelBanner">
              <img alt="example" style="width: 100%" :src="previewImageBanner" />
            </a-modal>
          </div>
          <span v-else style="color: #333">无</span>
        </a-form-item>

        <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <span style="font-weight: bold; margin-left: 20%; color: #333">预约反馈:</span>
        </a-form-item>

        <a-form-item label="预约状态" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- <a-radio-group name="radioGroup" :default-value="1" v-model="radioValue" @change="radioChang"> -->
          <a-radio-group name="radioGroup" :default-value="1" v-model="radioValue">
            <a-radio :value="1"> 成功 </a-radio>
            <a-radio :value="2" style="width: 100px"> 失败 </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item v-if="radioValue == 1" label="" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div style="margin-left: 20%; color: #333">预约时间 :</div>
        </a-form-item>
        <a-form-item v-if="radioValue == 1" label="日期" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- <a-date-picker v-model="chooseDate" placeholder="2021-12-31 " @change="onChange" /> -->
          <a-date-picker v-model="chooseDate" placeholder="2021-12-31 " />
        </a-form-item>

        <a-form-item v-if="radioValue == 1" label="时间段" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <span v-for="(item, index) in timeData" :key="index" class="span-time" style="margin-left: 0">{{
            item.value
          }}</span>

          <!-- <span class="span-time" style="margin-left: 0">08:30-09:00</span>
          <span class="span-time">09:30-10:00</span>
          <span class="span-time">10:30-12:00</span> -->
        </a-form-item>

        <!-- :label="locationDes" -->
        <!-- label="检查/检验地点" -->
        <a-form-item
          v-if="radioValue == 1"
          :labelCol="labelCol"
          :label="locationDes"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input v-model="remark" placeholder="请输入地点" />
        </a-form-item>

        <a-form-item v-if="radioValue == 2" label="失败原因" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-textarea v-model="failReason" placeholder="请输入失败原因" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { qryCodeValue, saveTradeAppoint } from '@/api/modular/system/posManage'
import { formatDateFull } from '@/utils/util'

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

      chooseDate: '',
      editTitle: 'ddd',
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      fileListBanner: [],
      previewImageBanner: '',
      previewVisibleBanner: false,

      remark: '', //地点
      hasPic: false,
      radioValue: 1,
      locationDes: '',
      timeData: [],
    }
  },

  created() {
    qryCodeValue('APPOINT_TYPE').then((res) => {
      if (res.code == 0) {
        if (res.data && res.data.length > 0) {
          this.timeData = res.data
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

      if (this.record.appointItem == 'CHECK') {
        this.locationDes = '检查地点'
      } else if (this.record.tradeType == 'EXAM') {
        this.locationDes = '检验地点'
      }

      this.editTitle = record.tradeType

      //组装图片
      let logImgItem = this.record.tradeAppointLog.find((item) => item.dealType == 'REQUEST')
      if (logImgItem && logImgItem.dealImages && logImgItem.dealImages.length > 0) {
        this.hasPic = true
        //banner图
        let bannerPics = logImgItem.dealImages.split(',')
        for (let index = 0; index < bannerPics.length; index++) {
          this.fileListBanner.push({
            uid: 0 - index + '',
            name: 'Banner' + index,
            status: 'done',
            url: bannerPics[index],
          })
        }
      } else {
        this.hasPic = false
      }

      // setTimeout(() => {
      //   this.form.setFieldsValue({
      //     knowledgeType: record.knowledgeType,
      //     title: record.title,
      //     content: record.content,
      //   })
      // }, 100)
    },

    // radioChang(event) {
    //   console.log('s2', event)
    //   if (event.target.value == 1) {
    //   }
    // },

    handleCancel() {},
    handleSubmit() {
      const {
        form: { validateFields },
      } = this

      if (!this.chooseDate) {
        this.$message.error('请选择预约日期！')
        return
      } else {
        this.record.appointDate = this.chooseDate
      }

      if (!this.remark) {
        this.$message.error('请输入地点！')
        return
      } else {
        this.$set(this.record, 'remark', this.remark)
        // this.record.appointDate = this.chooseDate
      }

      this.confirmLoading = true
      saveTradeAppoint(this.record)
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

    async handlePreviewBanner(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageBanner = file.url || file.preview
      this.previewVisibleBanner = true
    },

    handleChangeBanner({ fileList }) {
      this.fileListBanner = fileList
    },

    handleCancelBanner() {
      this.previewVisibleBanner = false
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
  },
}
</script>
<style lang="less">
.span-time {
  display: inline-block;
  height: 40px;
  color: #85888e;
  text-align: center;
  margin-right: 10px;
  margin-top: 5px;
  padding: 0px 3px;
  border-radius: 5px;
  border: 1px #85888e solid;

  &:hover {
    border: 1px #3894ff solid;
    color: #3894ff;
    cursor: pointer;
  }
}

.span-chose {
  display: inline-block;
  height: 40px;
  color: #3894ff;
  text-align: center;
  margin-right: 10px;
  margin-top: 5px;
  padding: 0px 3px;
  border-radius: 5px;
  border: 1px #3894ff solid;
}
</style>
