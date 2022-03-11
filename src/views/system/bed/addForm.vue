<template>
  <a-modal
    title="预约详情"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-appoint-detail">
        <!-- <p class="p-title">查看计划</p> -->
        <!-- 分割线 -->
        <!-- <div class="div-divider"></div> -->

        <div class="div-line-wrap">
          <!-- <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span> -->
          <span class="span-item-name">姓名 :</span>
          <span class="span-item-value">{{ record.userNameOut }} </span>
          <span class="span-item-name" style="margin-left: 3%"> 性别 :</span>

          <span class="span-item-value">{{ record.userSex }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 年龄 :</span>
          <span class="span-item-value">{{ record.userAge }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 身份证号 :</span>

          <span class="span-item-value">{{ record.identificationNo }} </span>
        </div>

        <div class="div-divider"></div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 开单日期 :</span>
          <span class="span-item-value">{{ record.reqTimeOut }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 开单科室 :</span>

          <span class="span-item-value">{{ record.reqDeptName }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 开单医生 :</span>
          <span class="span-item-value">{{ record.reqDocName }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 诊断名称 :</span>

          <span class="span-item-value">{{ record.diagnosis }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 预交定金 :</span>
          <span class="span-item-value">{{ record.prePay }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 预约科室 :</span>

          <span class="span-item-value">{{ record.appointDeptName }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 预约日期 :</span>
          <span class="span-item-value">{{ record.appointDate || '暂无' }} </span>
        </div>

        <div class="div-divider"></div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 记录 :</span>
          <span class="span-item-value"> </span>
        </div>

        <!-- 预约内容 -->
        <div class="div-appoint-content">
          <a-timeline>
            <a-timeline-item v-for="(item, index) in record.tradeAppointLog" :key="index" color="red">
              <!-- <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px" /> -->
              <!-- <span slot="dot" class="dotCircle">{{ index + 1 }} </span> -->
              <div slot="dot" class="dotCircle">
                <span class="span-dot"> {{ index + 1 }}</span>
              </div>
              <div class="div-content-item">
                <div class="div-time">{{ item.timeStr }}</div>
                <div class="div-content">{{ item.dealType }}</div>
                <div class="clearfix" style="margin-top: 20px">
                  <!-- :file-list="fileListDetail" -->
                  <!-- @preview="handlePreviewDetail" -->
                  <a-upload
                    disabled
                    :action="actionUrl"
                    :multiple="true"
                    list-type="picture-card"
                    :file-list="record.tradeAppointLog[index].dealImgList"
                    @change="handleChangeDetail"
                    @preview="handlePreviewDetail"
                  >
                    <div v-if="false">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-modal :visible="previewVisibleDetail" :footer="null" @cancel="handleCancelDetail">
                    <img alt="example" style="width: 100%" :src="previewImageDetail" />
                  </a-modal>
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>

        <!-- <div class="btn-add-plan" @click="addPlanItem" type="primary"></div> -->
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { sysPosAdd } from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'

export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },

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
      confirmLoading: false,
      form: this.$form.createForm(this),
      record: {},
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      previewImageDetail: '',
      previewVisibleDetail: false,
    }
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.visible = true

      //处理每条数据是否有图片
      if (this.record.tradeAppointLog && this.record.tradeAppointLog.length > 0) {
        for (let index = 0; index < this.record.tradeAppointLog.length; index++) {
          let date = this.formatDate(this.record.tradeAppointLog[index].createTime)
          this.$set(this.record.tradeAppointLog[index], 'timeStr', date)
          if (
            this.record.tradeAppointLog[index].dealImages &&
            this.record.tradeAppointLog[index].dealImages.length > 0
          ) {
            let detailPics = this.record.tradeAppointLog[index].dealImages.split(',')
            this.$set(this.record.tradeAppointLog[index], 'dealImgList', [])
            for (let i = 0; i < detailPics.length; i++) {
              this.record.tradeAppointLog[index].dealImgList.push({
                uid: 0 - i + '',
                name: '详情' + i,
                status: 'done',
                url: detailPics[i],
              })
            }
          }
        }
      }
    },

    handleCancelDetail() {
      this.previewVisibleDetail = false
    },

    async handlePreviewDetail(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageDetail = file.url || file.preview
      this.previewVisibleDetail = true
    },

    handleChangeDetail({ fileList }) {
      //this.record.tradeAppointLog[index].dealImgList
      // this.fileListDetail = fileList
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          sysPosAdd(values)
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
.div-appoint-detail {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 5% 0 5%;
  // padding: 0 15%;
  .p-title {
    margin-top: 20px;
    height: 20px;
    font-size: 20px;
    text-align: left;
    color: #000;
    font-weight: bold;
    // border-bottom: 1px solid #e6e6e6;
  }
  .div-divider {
    margin-top: 2%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 12%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }
  }
  .div-line-wrap2 {
    width: 100%;
    overflow: hidden;

    .span-item-name {
      width: 12%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }
  }

  .div-appoint-content {
    margin-top: 2%;
    width: 100%;
    height: 100%;

    .dotCircle {
      color: #333;
      width: 26px;
      height: 26px;
      border: #000 solid 1px;
      border-radius: 13px;
      display: inline-block;
      .span-dot {
        margin-top: 5px;
        display: inline-block;
        font-size: 14px;
        text-align: center;
      }
    }

    .div-content-item {
      overflow: hidden;
      margin-left: 2%;
      width: 100%;

      .div-time {
        color: #333;
        text-align: left;
        font-weight: bold;
        font-size: 14px;
      }
      .div-content {
        color: #333;
        text-align: left;
        font-size: 12px;
      }
    }
  }

  .btn-add-plan {
    margin-top: 3%;
    margin-left: 35%;
  }
  .btn-save-plan {
    margin-top: 5%;
    display: block;
    margin-bottom: 10%;
  }
}
</style>
