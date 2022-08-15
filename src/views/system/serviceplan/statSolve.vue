<template>
  <a-modal
    title="处理"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-appoint-detail">
        <div class="div-line-wrap">
          <span class="span-item-name">患者 :</span>
          <span class="span-item-value">{{ patientInfo.baseInfo.userName }} </span>
          <span class="span-item-name" style="margin-left: 3%"> 身份证号 :</span>

          <span class="span-item-value">{{ patientInfo.baseInfo.identificationNo }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 电话号码 :</span>
          <span class="span-item-value">{{ patientInfo.externalInfo.phone }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 紧急联系电话 :</span>

          <span class="span-item-value"></span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 所在病区 :</span>
          <span class="span-item-value">{{ szbq}} </span>

          <span class="span-item-value"></span>
        </div>
        <div class="div-divider"></div>

        <div v-if="DealCheck">
          <div class="div-line-wrap">
            <span class="span-item-name"> 处理人 :</span>
            <span class="span-item-value">{{ handleName }} </span>

            <span class="span-item-name" style="margin-left: 3%"> 处理时间 :</span>

            <span class="span-item-value">{{ handleTime }} </span>
          </div>
          <div class="div-line-wrap">
            <span class="span-item-name"> 处理措施 :</span>
            <span class="span-item-value">{{ radioTyPe === 0 ? '填写问卷' : '失访' }}</span>
          </div>
          <div v-show="radioTyPe === 1" class="div-line-wrap">
            <span class="span-item-name"> 失访理由 :</span>
            <span class="span-item-value">{{ handleResult }}</span>
          </div>
          <div v-show="radioTyPe === 0" style="min-height: 500px; overflow-y: auto">
            <iframe
              :src="questionUrl"
              style="width: 100%; min-height: 500px; overflow: scroll"
              frameborder="0"
              scrolling="yes"
            >
            </iframe>
          </div>
        </div>

        <div v-if="!DealCheck">
          <div class="div-line-wrap">
            <span class="span-item-name"> 处理人 :</span>
            <a-input
              :disabled="DealCheck"
              v-model="handleName"
              class="span-item-value"
              :maxLength="30"
              style="display: inline-block"
              allow-clear
              placeholder="请填写处理人姓名"
            />

            <span class="span-item-name" style="margin-left: 3%"> 处理时间 :</span>

            <span class="span-item-value">{{ handleTime }} </span>
          </div>

          <div class="div-line-wrap">
            <span class="span-item-name"> 处理措施 :</span>
            <span class="span-item-value">{{ record.reqDocName }} </span>

            <a-radio-group
              :disabled="DealCheck"
              name="radioGroup"
              style="width: 300px; margin-left: -30%"
              :default-value="radioTyPe"
              @change="radioChange"
            >
              <a-radio :value="0"> 填写问卷 </a-radio>
              <a-radio :value="1"> 失访 </a-radio>
            </a-radio-group>

            <span class="span-item-value">{{ record.diagnosis }} </span>
          </div>

          <div v-show="radioTyPe === 1" class="div-line-wrap">
            <span class="span-item-name"> 失访理由 :</span>
            <a-input
              :disabled="DealCheck"
              v-model="handleResult"
              class="span-item-value"
              style="display: inline-block; width: 80%"
              allow-clear
              placeholder="请填写失访理由"
            />
          </div>

          <div v-show="radioTyPe === 0" style="margin-top: 50rpx; min-height: 500px; overflow-y: auto">
            <iframe
              :src="questionUrl"
              style="width: 100%; min-height: 500px; overflow: scroll"
              frameborder="0"
              scrolling="yes"
            >
            </iframe>
          </div>
          <div style="margin-top: 50px">
            <a-button size="large" type="primary" @click="goConfirm" style="margin-left: 35%; width: 30%">
              处理完成
            </a-button>
          </div>
        </div>
        <div style="height: 50px; backgroud-color: white" />
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import {
  getBaseInfo,
  dealsave,
  dealget,
  queryHealthPlanTaskList,
  queryHealthPlanContent,
} from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'

export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },

  data() {
    return {
     
      DealCheck: false,
      patientId: '', //患者ID
      planId: '',
      patientInfo: {
        //患者详情
        baseInfo: {
          identificationNo: '',
          userName: '',
        },
        externalInfo: {
          phone: '',
        },
      },
      szbq:'',//所在病区
      radioTyPe: 0,
      handleName: '',
      handleTime: '',
      handleResult: '',
      questionTaskContent: {},
      questionUrl:'',
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

    //处理初始化方法
    edit(record) {
      console.log(record)
      ;(this.record = record), (this.patientId = record.userId), (this.visible = true), (this.planId = record.planId), (this.szbq = record.ksmc===record.bqmc?record.ksmc:record.ksmc+record.bqmc)
      this.handleTime = this.formatDate(new Date())

      this.getPatientBaseInfo()
      this.getQueryHealthPlanTaskList()
    },
    //查看初始化方法
    check(record) {
      ;(this.record = record), (this.patientId = record.userId), (this.visible = true), (this.planId = record.planId), (this.szbq = record.ksmc===record.bqmc?record.ksmc:record.ksmc+record.bqmc)
      this.DealCheck = true
      this.getPatientBaseInfo()
      this.getDealInfo()
      this.getQueryHealthPlanTaskList()
    },

    getPatientBaseInfo() {
      getBaseInfo({ userId: this.patientId }).then((res) => {
        this.patientInfo = res.data
      })
    },

    getDealInfo() {
      if (this.patientId === '') {
        this.$message.error('患者ID为空')
        return
      }
      if (this.planId === '') {
        this.$message.error('计划ID为空')
        return
      }
      var postData = {
        planId: this.planId,
        userId: this.patientId, //就诊人ID
      }
      dealget(postData).then((res) => {
        if (res.code === 0) {
          this.radioTyPe = res.data.dealType === '1' ? 0 : 1
          this.handleName = res.data.dealUserName
          this.handleResult = res.data.dealResult
          this.handleTime = res.data.dealTime
        } else {
          this.$message.error(res.message)
        }
      })
    },

    //查询计划和任务
    getQueryHealthPlanTaskList() {
      queryHealthPlanTaskList({ planId: this.planId }).then((res) => {
        if (res.code === 0) {
          for (var i = 0; i < res.data.length; i++) {
            var task = res.data[i]
            for (var j = 0; j < task.taskInfo.length; j++) {
              var content = task.taskInfo[j]
              if (content.planType === 'Quest') {
                //遇到第一个问卷退出
                this.questionTaskContent = content
                console.log(this.questionTaskContent)
                break
              }
            }
          }

          if (this.questionTaskContent.contentId) {
            this.getQueryHealthPlanContent()
          } else {
            this.$message.error('随访问卷不存在')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },



    //查询任务内容
    getQueryHealthPlanContent() {
      var postData = {
        contentId: this.questionTaskContent.contentId,
        planType: this.questionTaskContent.planType,
        userId: this.patientId,
      }
      queryHealthPlanContent(postData).then((res) => {
        if (res.code === 0) {
          this.questionTaskContent.questUrl=res.data.questUrl
          this.questionUrl=res.data.questUrl
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //点击处理完成时去查询该问卷任务是否已完成
    checkHealthPlanTaskEnd() {
      queryHealthPlanTaskList({ planId: this.planId }).then((res) => {
        if (res.code === 0) {
          for (var i = 0; i < res.data.length; i++) {
            var task = res.data[i]
            for (var j = 0; j < task.taskInfo.length; j++) {
              var content = task.taskInfo[j]
              if (content.contentId === this.questionTaskContent.contentId) {
                 if(content.execFlag===1){
                    //已完成
                    this.dodealsave()
                 }else{
                  this.$message.error('请先提交问卷')
                 }
                break
              }
            }
          }

          if (this.questionTaskContent.contentId) {
            this.getQueryHealthPlanContent()
          } else {
            this.$message.error('随访问卷不存在')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
  //完成处理
    goConfirm() {
      if (this.patientId === '') {
        this.$message.error('患者ID为空')
        return
      }
      if (this.planId === '') {
        this.$message.error('计划ID为空')
        return
      }
      if (this.handleName.length === 0) {
        this.$message.info('请填写处理人')
        return
      }
      if (this.radioTyPe === 0) {
        //处理措施,1填写问卷
        this.checkHealthPlanTaskEnd()
      } else if (this.radioTyPe === 1) {
        //失访
        if (this.handleResult.length === 0) {
          this.$message.info('请填写失访理由')
          return
        }
        this.dodealsave()
      }


    },

    //保存处理信息
    dodealsave(){
      var postdata = {
        dealResult: this.handleResult, //失访理由
        dealType: this.radioTyPe === 0 ? 1 : 2, //处理措施,1填写问卷/2失访
        dealUserName: this.handleName, //处理人
        ipNo: this.record.zyh, //住院号
        planId: this.planId, //计划ID
        regNo: this.record.jzlsh, //就诊流水号
        userId: this.patientId, //就诊人ID
      }
      dealsave(postdata).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功！')
          this.visible=false
        } else {
          this.$message.error(res.message)
        }
      })
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

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    handleChangeDetail({ fileList }) {
      //this.record.tradeAppointLog[index].dealImgList
      // this.fileListDetail = fileList
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    radioChange(e) {
      this.radioTyPe = e.target.value
      console.log(this.radioTyPe)
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
