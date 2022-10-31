<template>
  <div style="height: 650px;">
    <div class="div-appoint-detail">
      <div class="div-span-content-left">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">随访结果</span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 随访方式 :</span>
          <a-select placeholder="请选择" disabled :value="followResultContent.messageType.description">
            <a-select-option :value="followResultContent.messageType.description">{{
              followResultContent.messageType.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 随访方案 :</span>
          <a-select placeholder="请选择" disabled :value="followResultContent.planName">
            <a-select-option :value="followResultContent.planName">{{
              followResultContent.planName
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 是否逾期 :</span>
          <a-select placeholder="请选择" disabled :value="followResultContent.overdueStatus.description">
            <a-select-option :value="followResultContent.overdueStatus.description">{{
              followResultContent.overdueStatus.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 随访状态 :</span>
          <a-select placeholder="请选择" disabled :value="followResultContent.execStatus.description">
            <a-select-option :value="followResultContent.execStatus.description">{{
              followResultContent.execStatus.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 实际随访人 :</span>
          <a-select placeholder="请选择" disabled :value="followResultContent.actualDoctorUserName">
            <a-select-option :value="followResultContent.actualDoctorUserName">{{
              followResultContent.actualDoctorUserName
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 随访结果 :</span>
          <a-radio-group name="radioGroup" :default-value="radioTyPe" @change="radioChange">
            <a-radio :value="0"> 成功 </a-radio>
            <a-radio :value="1"> 失败 </a-radio>
          </a-radio-group>
        </div>
        <div v-show="radioTyPe === 1" class="div-line-wrap">
          <span class="span-item-name"> 失败原因 :</span>

          <a-radio-group name="radioGroup2" v-model="failureRadioTyPe">
            <a-radio style="margin-left: 30%" v-for="(item, index) in failureList" :key="index" :value="index">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </div>
        <div v-show="radioTyPe === 1" class="div-line-wrap">
          <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
          <a-input v-model="handleResult" class="span-item-value" allow-clear placeholder="" />
        </div>
      </div>

      <div class="midline"></div>

      <div class="div-span-content-mid">
        <div class="div-voice-wrap" style="justify-content: center">
          <div class="span-item-name">电话录音 :</div>
          <div class="div-voice-content"></div>

          <img src="~@/assets/icons/dianhua2.png" style="width: 34px; height: auto" />
          <img src="~@/assets/icons/jinji2.png" style="width: 29px; height: auto; margin-left: 20px; margin-top: 3px" />
        </div>

        <div style="height: 600px; margin-top: 10px; overflow-y: auto">
          <iframe
            id="iframeId"
            defer="true"
            :src="questionUrl"
            style="width: 100%; height: 600px; overflow: scroll"
            frameborder="0"
            scrolling="yes"
          >
          </iframe>
        </div>
      </div>

      <div class="midline"></div>

      <div class="div-span-content-right">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name">患者姓名 :</span>
          <span class="span-item-value">{{ patientInfo.userName }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 身份证号 :</span>
          <span class="span-item-value">{{ patientInfo ? subStringIdcardNo(patientInfo.idNumber) : '' }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 出生日期 :</span>
          <span class="span-item-value">{{ patientInfo.birthDate }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 联系电话 :</span>
          <span class="span-item-value">{{ patientInfo.tel }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 紧急联系人 :</span>
          <span class="span-item-value">{{ patientInfo.urgentContacts }}</span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 紧急联系电话 :</span>
          <span class="span-item-value">{{ patientInfo.urgentTel }} </span>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: row-reverse">
      <a-button type="default" @click="goConfirm" style="width: 90px"> 关闭 </a-button>
      <a-button type="primary" @click="goConfirm" style="border: red; margin-right: 30px; width: 90px"> 提交 </a-button>
    </div>
  </div>
</template>


<script>
import {
  getBaseInfo,
  dealsave,
  dealget,
  queryHealthPlanTaskList,
  queryHealthPlanContent,
  checksave,
  checkget,
  followPlanPhoneCurrent,
  followPlanPhonePatientInfo,
  modifyFollowExecuteRecord,
} from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },
  props: {
    record: Object,
  },
  data() {
    return {
      id: '612',
      activeKey: '1',
      DealEnd: false, //fasle为未处理  true为已处理待检查
      CheckEnd: false, //fasle为未检查  true为已检查
      patientId: '', //患者ID
      planId: '',
      failureList: [
        '电话无人接听',
        '电话号码有误',
        '主动放弃随访',
        '患者拒绝随访',
        '电话占线',
        '电话关机',
        '患者已死亡',
        '患者已迁出',
        '其他',
      ],
      followResultContent: {
        messageType: {
          value: '',
          description: '',
        },
        overdueStatus: {
          value: '',
          description: '',
        },
        execStatus: {
          value: '',
          description: '',
        },
        actualDoctorUserId: '',
        taskBizStatus: {
          value: '',
          description: '',
        },
        failReason: '',
        remark: '',
        projectKeyUrlR: '',
        projectKeyUrlW: '',
        planName: '',
        overdueFollowType: null,
      },
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
      szbq: '', //所在病区
      radioTyPe: 0,
      failureRadioTyPe: '',
      handleName: '',
      handleTime: '',
      handleResult: '',
      checkTime: '',
      checkName: '',
      checkResult: '',
      questionTaskContent: {},
      questionUrl: '',
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

      iframe: {},
      previewImageDetail: '',
      previewVisibleDetail: false,
    }
  },

  created() {
    var user = Vue.ls.get(TRUE_USER)
    this.followResultContent.actualDoctorUserName = user.userName
    this.followResultContent.actualDoctorUserId = user.userId
    ;(this.patientId = this.record.userId),
      (this.visible = true),
      (this.planId = this.record.planId),
      (this.szbq = this.record.ksmc === this.record.bqmc ? this.record.ksmc : this.record.ksmc + this.record.bqmc)
    this.handleTime = this.formatDate(new Date())

    this.followPlanPhonePatientInfo(612)
    this.followPlanPhoneCurrent(this.id)

    this.$nextTick(() => {
      const iframe = window.frames['iframeId']
      console.log('iframe', iframe)
      const handleLoad = () => {
        console.log('handleLoad')
        setTimeout(() => {
          const Do = iframe.contentWindow || iframe.contentDocument

          Do.postMessage('clickToConfirm', '*')
        }, 500)
      }
      iframe.addEventListener('load', handleLoad, true)
    })

    addEventListener('message', (e) => {
      // e.data为子页面发送的数据
      console.log(e.data)
    })
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
    doDeal(record) {},
    //检查初始化方法
    doCheck(record) {
      ;(this.record = record),
        (this.patientId = record.userId),
        (this.visible = true),
        (this.planId = record.planId),
        (this.szbq = record.ksmc === record.bqmc ? record.ksmc : record.ksmc + record.bqmc)
      this.DealEnd = true
      this.checkTime = this.formatDate(new Date())
      this.getPatientBaseInfo()
      this.getDealInfo()
      this.getQueryHealthPlanTaskList()
    },
    //已检查初始化方法
    checkInfo(record) {
      ;(this.record = record),
        (this.patientId = record.userId),
        (this.visible = true),
        (this.planId = record.planId),
        (this.szbq = record.ksmc === record.bqmc ? record.ksmc : record.ksmc + record.bqmc)
      this.DealEnd = true
      this.CheckEnd = true

      this.getPatientBaseInfo()
      this.getDealInfo()
      this.getCheckInfo()
      this.getQueryHealthPlanTaskList()
    },

    //随访结果
    followPlanPhoneCurrent(id) {
      followPlanPhoneCurrent(id).then((res) => {
        if (res.code == 0) {
          this.followResultContent=res.data
          this.questionUrl = res.data.projectKeyUrlW
          console.log(this.followResultContent)
          console.log(this.questionUrl)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    followPlanPhonePatientInfo(userId) {
      followPlanPhonePatientInfo(userId).then((res) => {
        if (res.code === 0) {
          this.patientInfo = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },

    subStringIdcardNo(idcard) {
      if (idcard) {
        const temp = idcard.substring(4, 15)
        return idcard.replace(temp, '***********')
      } else {
        return ''
      }
    },

    subStringPhoneNo(phone) {
      var str = phone
      var pat = /(\d{3})\d*(\d{4})/
      return str.replace(pat, '$1****$2')
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
                //遇到第一个问卷任务退出循环
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
          this.questionTaskContent.questUrl = res.data.questUrl

          var url =
            res.data.questUrl +
            '?userId=' +
            this.patientId +
            '&groupId=&contentId=' +
            this.questionTaskContent.contentId +
            '&execTime=' +
            this.formatDate(new Date()) +
            '&title=' +
            res.data.questName

          if (this.questionTaskContent.execFlag === 1) {
            //已完成
            //读状态
            url = url.replace('/s/', '/r/')
          } else {
            //写状态
            url = url.replace('/r/', '/s/')
          }

          this.questionUrl = url
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
                if (content.execFlag === 1) {
                  //已完成
                  this.dodealsave()
                } else {
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
    //完成处理按钮
    goConfirm() {
      if (this.radioTyPe === 1) {
        console.log(this.failureRadioTyPe)
        if (this.failureRadioTyPe.length === 0) {
          this.$message.info('请选择失败理由')
          return
        }

        if (this.failureRadioTyPe === 8) {
          if (this.handleResult.length === 0) {
            this.$message.info('请填写备注')
            return
          }
        }

        this.dodealsave()
      }
    },

    //保存处理信息
    dodealsave() {
      var postdata = {
        actualDoctorUserId: this.followResultContent.actualDoctorUserId, //实际随访人
        failReason: this.failureRadioTyPe + 1,
        id: this.id,
        remark: this.handleResult,
        taskBizStatus: this.radioTyPe === 0 ? 2 : 3, //成功失败
      }
      modifyFollowExecuteRecord(postdata).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功！')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //获取处理信息
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
    //点击抽查确定按钮
    gocheck() {
      if (this.patientId === '') {
        this.$message.error('患者ID为空')
        return
      }
      if (this.planId === '') {
        this.$message.error('计划ID为空')
        return
      }
      if (this.checkName.length === 0) {
        this.$message.info('请填写检查人姓名')
        return
      }
      if (this.checkResult.length === 0) {
        this.$message.info('请填写检查结果')
        return
      }
      this.dochecksave()
    },
    //保存检查信息
    dochecksave() {
      var postdata = {
        checkResult: this.checkResult, //检查理由
        checkUserName: this.checkName, //检查人
        ipNo: this.record.zyh, //住院号
        planId: this.planId, //计划ID
        regNo: this.record.jzlsh, //就诊流水号
        userId: this.patientId, //就诊人ID
      }
      checksave(postdata).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功！')
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //获取检查信息
    getCheckInfo() {
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
      checkget(postData).then((res) => {
        if (res.code === 0) {
          this.checkName = res.data.checkUserName
          this.checkResult = res.data.checkResult
          this.checkTime = res.data.checkTime
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
.midline {
  height: 100%;
  width: 1px;
  background: #c3c3c3;
  margin-left: 21px;
  margin-right: 21px;
}
.div-title {
  display: flex;
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 14px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.top-tab {
  width: 100%;
  overflow: hidden;
}
.div-appoint-detail {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  .div-span-content-left {
    width: 21%;
    height: 100%;
 
  }
  .div-span-content-mid {
    width: 58%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .div-span-content-right {
    width: 21%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
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
    margin-top: 6%;
    overflow: hidden;

    .span-item-name {
      width: 33%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 65%;
      color: #333;
      text-align: left;
      font-size: 14px;
      display: inline-block;
    }
    .ant-select {
      width: 65% !important;
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
