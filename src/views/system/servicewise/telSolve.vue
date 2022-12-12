<template >
  <div style="height: 500px; width: 100%">
    <div class="div-appoint-detail-tel">
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
            <a-select-option :value="followResultContent.planName">{{ followResultContent.planName }}</a-select-option>
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
          <a-select placeholder="请选择" disabled :value="followResultContent.taskBizStatus.description">
            <a-select-option :value="followResultContent.taskBizStatus.description">{{
              followResultContent.taskBizStatus.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 实际随访人 :</span>

          <a-select v-model="followResultContent.actualDoctorUserId"  placeholder="请选择">
            <a-select-option v-for="(item, index) in deptUsers" :key="index" :value="item.userId">{{
              item.userName
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
        <div class="span-mid-audio" v-show="audioShow">
          <audio class="audio" controls :src="audioSrc" autoplay></audio>
        </div>
        <div class="div-voice-wrap">
          <div class="span-item-name">电话录音 :</div>
          
          <div class="div-voice-content">
            <a
              ref="#"
              v-for="(item, index) in soundRecordingList"
              :key="index"
              :value="item"
              class="div-voice-item"
              @click="playAudio(item)"
              ><img src="~@/assets/icons/ly.png" class="img" />{{ item.recordName }}.mp3</a
            >
          </div>
          <a ref="#" v-if="patientInfo.tel && callers.length>0">
          <img
            
            src="~@/assets/icons/dianhua2.png"
            @click="goCall(patientInfo.tel)"
            style="width: 34px; height: auto;position: absolute;right: 45px;top: 0;"
          />
        </a>
          <img v-else src="~@/assets/icons/dianhua.png" style="width: 34px; height: auto;position: absolute;right: 45px;top: 0;" />
          <a ref="#" v-if="patientInfo.urgentTel && callers.length>0">
          <img
            
            src="~@/assets/icons/jinji2.png"
            @click="goCall(patientInfo.urgentTel)"
            style="width: 29px; height: auto; position: absolute;right: 0;top: 4px;"
          />
        </a>
          <img
            v-else
            src="~@/assets/icons/jinji.png"
            style="width: 29px; height: auto; position: absolute;right: 0;top: 4px;"
          />
        </div>

        <div style="flex: 1; margin-top: 5px; ">
          <iframe
            id="iframeId"
            defer="true"
            :src="questionUrl"
            style="width: 100%; height: 100%; overflow: scroll"
            frameborder="0"
            scrolling="yes"
          >
          </iframe>
        </div>
      </div>

      <div class="midline"></div>

      <div class="div-span-content-right" style="overflow-y: auto !important; max-height: 100%">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div>
        <div class="div-line-wrap" v-for="(item, index) in fieldList" :key="index" :value="item">
          <span class="span-item-name" style="width: auto;">{{ item.fieldComment }} :&#12288;</span>
          <span class="span-item-value" style="width: auto;">{{ item.fieldValue }} </span>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 12px; display: flex; flex-direction: row-reverse; align-items: center">
     
      <a-button
        type="default"
        @click="goCancel"
        style="width: 90px; color: #1890ff !important; border-color: #1890ff !important"
      >
        关闭
      </a-button>
      
      <a-button type="primary" :loading="isLoading"  @click="goConfirm" style=" margin-right: 30px; width: 90px"> 提交 </a-button>
      <a-button type="danger" :loading="isLoading"  @click="goZangua" style=" margin-right: 30px; width: 90px; "> 暂挂 </a-button>
    </div>
  </div>
</template>


<script>
import {
  getSoundRecordingList,
  followPlanPhoneCurrent,
  followPlanPhonePatientInfo,
  modifyFollowExecuteRecord,
  getUsersByDeptIdAndRole,
  getAccountParam,
  addTencentPhoneTape,
  hangExecuteRecord
} from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'
import { TRUE_USER,CURRENT_FOLLOW_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { parseString } from 'loader-utils'
let self //最外面全局的
export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },
  props: {
    record: Object,
  },
  data() {
    return {
      user:{},
      activeKey: '1',
      audioSrc: '',
      audioShow: false,
      isLoading:false,
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
      deptUsers: [],
      soundRecordingList: [],
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
      fieldList: [],
      callers: [],
      patientInfo: {},
      radioTyPe: 0,
      failureRadioTyPe: '',
      handleResult: '',
      questionUrl: '',
      iframe: {},
    }
  },

  created() {
     this.user = Vue.ls.get(TRUE_USER)
   
    self = this
    console.log('telSolve', this.record.userId)
    this.followPlanPhonePatientInfo(this.record.userId)
    this.followPlanPhoneCurrent(this.record.id)
    this.getUsersByDeptIdAndRoleOut(this.record.executeDepartmentId)
    this.getSoundRecordingList(this.record.id)

    //监听iframe发过来的消息
    window.addEventListener('message', self.submitFormFun)

    getAccountParam('follow_caller_phone').then((res) => {
      if (res.code == 0) {
        this.callers = res.data
      }
    })
  },
  destroyed() {
    console.log('随访操作destroyed')
    window.removeEventListener('message', self.submitFormFun)
  },
  methods: {
    goCall(phone) {
      this.$emit('goCall', phone, this.record.id)
    },

    //监听iframe发过来的消息
    submitFormFun(e) {
      // e.data为子页面发送的数据
      if (e.data == 'submitFormSuccess') {
        console.log('iframe中已提交成功')
        self.dodealsave()
      }
    },

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    //发送消息给iframe 通知其提交问卷
    postMessageToSubmit() {
      console.log('发送消息给iframe:submitForm')
      const iframe = window.frames['iframeId']
      const Do = iframe.contentWindow || iframe.contentDocument
      Do.postMessage('submitForm', '*')
    },

    //随访结果
    followPlanPhoneCurrent(id) {
      followPlanPhoneCurrent(id).then((res) => {
        if (res.code == 0) {
         
          res.data.actualDoctorUserId =this.followResultContent.actualDoctorUserId
          if (res.data.taskBizStatus.value == 2 || res.data.taskBizStatus.value == 3) {
            res.data.taskBizStatus.description = '已随访'
          } else {
            res.data.taskBizStatus.description = '待随访'
          }
          this.followResultContent = res.data
          this.questionUrl = res.data.projectKeyUrlW
          if (res.data.contacts) {
            this.patientInfo.tel = res.data.contacts
          }
          if (res.data.urgentContacts) {
            this.patientInfo.urgentTel = res.data.urgentContacts
          }
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
          res.data.forEach((element) => {
            if (element.tableField == 'id_card') {
              element.fieldValue = this.subStringIdcardNo(element.fieldValue)
            }
            if (element.tableField == 'sex') {
              element.fieldValue = element.fieldValue == 1 ? '男' : '女'
            }
          })
          this.fieldList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getUsersByDeptIdAndRoleOut(departmentId) {
      getUsersByDeptIdAndRole({ departmentId: departmentId, roleId: [3, 5,7,8] }).then((res) => {
        if (res.code == 0) {
          //保存的上次选择的实际随访人
          const actualDoctorUserId= Vue.ls.get(CURRENT_FOLLOW_USER)
          var deptUsers = res.data.deptUsers[0].users
          deptUsers.forEach(item=>{
           
            if(item.userId == actualDoctorUserId+''){
              console.log('相等')
              this.followResultContent.actualDoctorUserId=item.userId
            }
          })
          this.deptUsers=deptUsers
          console.log(this.deptUsers)
        }
      })
    },
    getSoundRecordingList(id) {
      //电话记录
      getSoundRecordingList(id).then((res) => {
        if (res.code === 0) {
          
          this.soundRecordingList = res.data
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
 //播放音频
 playAudio(soundRecord) {
      // this.audioSrc = soundRecord.recordUrL
      // this.audioShow = true
      this.$emit('playAudio', soundRecord.recordUrL)
    },
    subStringPhoneNo(phone) {
      var str = phone
      var pat = /(\d{3})\d*(\d{4})/
      return str.replace(pat, '$1****$2')
    },
    goCancel() {
      this.$emit('handleCancel', '')
    },
    //完成处理按钮
    goConfirm() {
      if (!this.followResultContent.actualDoctorUserId) {
        this.$message.info('请选择实际随访人')
        return
      }
      if (this.radioTyPe === 1) {
        //失败
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
      
        //保存处理信息
        this.dodealsave()
      } else {
        //成功
        //发送消息给iframe 通知其提交问卷  待监听到提交成功的消息后 保存处理信息
       
        this.postMessageToSubmit()
      }
    },

    //保存处理信息
    dodealsave() {
      this.isLoading=true
      var postdata = {
        actualDoctorUserId: this.followResultContent.actualDoctorUserId, //实际随访人
        failReason: this.failureRadioTyPe + 1,
        id: this.record.id,
        remark: this.handleResult,
        taskBizStatus: this.radioTyPe === 0 ? 2 : 3, //成功失败
      }
      modifyFollowExecuteRecord(postdata).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功！')
          //保存实际随访人
          Vue.ls.set(CURRENT_FOLLOW_USER, this.followResultContent.actualDoctorUserId)
          this.$emit('ok', '')
        } else {
          this.isLoading=false
          this.$message.error(res.message)
        }
      })
    },

    //暂挂
    goZangua(){
      this.isLoading=true
      var postdata={
        hangStatus:1,
        id: this.record.id,
      }
      hangExecuteRecord(postdata).then((res) => {
        this.isLoading=false
        if (res.code === 0) {
          this.$message.success('暂挂成功！')
         
          this.$emit('ok', '')
        } else {
          
          this.$message.error(res.message)
        }
      })
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
.div-appoint-detail-tel {
  background-color: white;
  width: 100%;
  height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  .div-span-content-left {
    width: 22%;
    height: 100%;
    overflow-y: auto !important;
  }
  .div-span-content-mid {
    width: 56%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    .span-mid-audio {
      position: absolute;

      left:26%;

      top: 35px;

      z-index: 10000;
    }
  }
  .div-span-content-right {
    width: 22%;
    height: 100%;
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
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 33%;
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      width: 65%;
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      width: 65% !important;
    }
    
  }
  .div-voice-wrap {
    width: 100%;
    overflow: hidden;
    display: flex;
    .img {
      width: 12px;
      height: 19px;
      margin-right: 8px;
      margin-bottom: 3px;
    }
    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .div-voice-content {
      flex: 1;
    }
    .div-voice-item {
      display: inline-block;
      color: #409eff;
      font-size: 14px;
      text-align: left;
      margin-left: 16px;
      margin-right: 20px;
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
        font-size: 12px;
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
